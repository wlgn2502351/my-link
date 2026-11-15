"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  AlertTriangleIcon,
  AtSignIcon,
  BarChart3Icon,
  CheckIcon,
  LockIcon,
  LogOutIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { incrementLinkClickCount } from "@/lib/links";
import {
  clampGrowth,
  DEFAULT_PROFILE,
  ensureUserProfile,
  generateUsernameFromEmail,
  getProfileDocRef,
  saveUserProfile,
  validateProfileValues,
  type ProfileFormErrors,
  type UserProfile,
} from "@/lib/profile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const skills = [
  { name: "Digital Artwork", tone: "red" },
  { name: "Brand Identity", tone: "neutral" },
  { name: "Figma & UI/UX", tone: "teal" },
  { name: "Vibe Coding", tone: "red" },
  { name: "3D & Motion Graphics", tone: "neutral" },
  { name: "Next.js & React", tone: "green" },
  { name: "Tailwind CSS", tone: "teal" },
  { name: "Creative Prompting", tone: "green" },
] as const;

type PillTone = "red" | "teal" | "green" | "blue" | "neutral";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  favicon: string;
  isFavorite: boolean;
  clickCount: number;
  createdAt: string;
}

const pillStyles: Record<PillTone, string> = {
  red: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/50",
  teal: "bg-sky-50 text-sky-900 ring-1 ring-inset ring-sky-200/70 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800/50",
  green:
    "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/50",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/70 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800/50",
  neutral:
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200/70 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/50",
};

const categoryToneMap: Record<string, PillTone> = {
  개발: "green",
  문서: "blue",
  디자인: "red",
  커뮤니티: "teal",
  생산성: "neutral",
};

const categories = Object.keys(categoryToneMap);

function formatDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toUpperCase();
  } catch {
    return url.toUpperCase();
  }
}

function formatDate(isoDate: string) {
  return isoDate.slice(0, 10).replace(/-/g, ".");
}

function normalizeUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidWebUrl(rawUrl: string) {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized || /\s/.test(rawUrl.trim())) return false;
  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    return (
      parsed.hostname === "localhost" ||
      /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(parsed.hostname)
    );
  } catch {
    return false;
  }
}

function getDefaultFavicon(url: string) {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch {
    return "/globe.svg";
  }
}

function parseCreatedAt(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date(0).toISOString();
}

function mapDocsToLinks(
  docs: Array<{ id: string; data: () => Record<string, unknown> }>
): LinkItem[] {
  const items: LinkItem[] = docs.map((doc) => {
    const data = doc.data();
    const rawUrl = typeof data.url === "string" ? data.url : "";
    const rawFavicon = typeof data.favicon === "string" ? data.favicon : "";

    return {
      id: doc.id,
      title: typeof data.title === "string" ? data.title : "",
      url: rawUrl,
      description: typeof data.description === "string" ? data.description : "",
      category: typeof data.category === "string" ? data.category : "개발",
      tags: Array.isArray(data.tags)
        ? data.tags.filter((tag): tag is string => typeof tag === "string")
        : [],
      favicon: rawFavicon || getDefaultFavicon(rawUrl),
      isFavorite: Boolean(data.isFavorite),
      clickCount:
        typeof data.clickCount === "number" && Number.isFinite(data.clickCount)
          ? data.clickCount
          : 0,
      createdAt: parseCreatedAt(data.createdAt),
    };
  });

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

interface FormErrors {
  title?: string;
  url?: string;
  description?: string;
  tags?: string;
  favicon?: string;
}

type FormField = keyof FormErrors;

export function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const [lastKnownUid, setLastKnownUid] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("개발");
  const [tagsInput, setTagsInput] = useState("");
  const [favicon, setFavicon] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 인라인 편집 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editError, setEditError] = useState<{
    title?: string;
    url?: string;
    general?: string;
  }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // 링크 삭제 모달 상태
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 인증 UI 상태
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // 프로필 및 프로필 수정 모달 상태
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileUsername, setProfileUsername] = useState("");
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [profileFocus, setProfileFocus] = useState("");
  const [profileGrowth, setProfileGrowth] = useState("");
  const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({});
  const [profileTouched, setProfileTouched] = useState<{
    username?: boolean;
    displayName?: boolean;
    bio?: boolean;
    role?: boolean;
    focus?: boolean;
    growth?: boolean;
  }>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // onAuthStateChanged로 인증 상태 감지
  useEffect(() => {
    try {
      const savedUid = localStorage.getItem("mylink_last_uid");
      if (savedUid) {
        setLastKnownUid(savedUid);
      }
    } catch {
      // localStorage 접근 불가 시 무시
    }

    if (!auth) {
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.uid) {
        setAuthError(null);
        setLastKnownUid(currentUser.uid);
        try {
          localStorage.setItem("mylink_last_uid", currentUser.uid);
        } catch {
          // localStorage 접근 불가 시 무시
        }

        const fallbackUsername = generateUsernameFromEmail(
          currentUser.email,
          currentUser.uid
        );
        const fallbackDisplayName =
          currentUser.displayName?.trim() || fallbackUsername;

        ensureUserProfile(currentUser)
          .then((loadedProfile) => {
            setProfile(loadedProfile);
          })
          .catch((error) => {
            console.error("Failed to initialize user profile:", error);
            setProfile({
              username: fallbackUsername,
              displayName: fallbackDisplayName,
              bio: "",
              role: DEFAULT_PROFILE.role,
              focus: DEFAULT_PROFILE.focus,
              growth: DEFAULT_PROFILE.growth,
            });
          });
      } else {
        setEditingId(null);
        setEditTitle("");
        setEditUrl("");
        setEditError({});
        setDeleteTarget(null);
        setIsAddDialogOpen(false);
        setIsProfileDialogOpen(false);
        setProfileErrors({});
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  async function handleGoogleLogin() {
    if (!auth) {
      setAuthError(
        "Firebase 설정이 완료되지 않았습니다. GitHub Secrets에 NEXT_PUBLIC_FIREBASE_* 환경 변수를 등록해주세요."
      );
      return;
    }
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: unknown }).code)
          : "";

      if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        return;
      }

      if (code === "auth/configuration-not-found") {
        setAuthError(
          "Firebase Authentication 설정을 찾을 수 없습니다. Firebase Console → Authentication → 시작하기에서 Google 로그인 제공업체를 활성화해주세요."
        );
      } else if (code === "auth/operation-not-allowed") {
        setAuthError(
          "Google 로그인이 비활성화되어 있습니다. Firebase Console → Authentication → Sign-in method에서 Google을 사용 설정해주세요."
        );
      } else if (code === "auth/popup-blocked") {
        setAuthError(
          "브라우저에서 로그인 팝업이 차단되었습니다. 팝업 차단을 해제한 뒤 다시 시도해주세요."
        );
      } else if (code === "auth/unauthorized-domain") {
        setAuthError(
          "현재 도메인이 승인되지 않았습니다. Firebase Console → Authentication → Settings → 승인된 도메인에 추가해주세요."
        );
      } else {
        console.error("Failed to sign in with Google:", error);
        setAuthError("Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    if (!auth) return;
    try {
      setAuthError(null);
      await signOut(auth);
    } catch (error) {
      console.error("Failed to sign out:", error);
      setAuthError("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  const targetUid = user?.uid ?? lastKnownUid ?? "anonymous";

  const fetchLinks = useCallback(async () => {
    if (!db) {
      setIsLoadingLinks(false);
      return;
    }
    try {
      const linksRef = collection(db, "users", targetUid, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty && !user && targetUid !== "anonymous") {
        const fallbackRef = collection(db, "users", "anonymous", "links");
        const fallbackSnapshot = await getDocs(
          query(fallbackRef, orderBy("createdAt", "desc"))
        );
        setLinks(mapDocsToLinks(fallbackSnapshot.docs));
      } else {
        setLinks(mapDocsToLinks(snapshot.docs));
      }
    } catch (error) {
      console.error("Failed to fetch links from Firestore:", error);
    } finally {
      setIsLoadingLinks(false);
    }
  }, [targetUid, user]);

  useEffect(() => {
    if (!isAuthReady || !db) return;

    fetchLinks();

    const linksRef = collection(db, "users", targetUid, "links");
    const q = query(linksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty && !user && targetUid !== "anonymous") {
          try {
            const fallbackRef = collection(db, "users", "anonymous", "links");
            const fallbackSnapshot = await getDocs(
              query(fallbackRef, orderBy("createdAt", "desc"))
            );
            setLinks(mapDocsToLinks(fallbackSnapshot.docs));
          } catch {
            setLinks([]);
          }
        } else {
          setLinks(mapDocsToLinks(snapshot.docs));
        }
        setIsLoadingLinks(false);
      },
      (error) => {
        console.error("Failed to subscribe to links from Firestore:", error);
        setIsLoadingLinks(false);
      }
    );

    return () => unsubscribe();
  }, [fetchLinks, isAuthReady, targetUid, user]);

  useEffect(() => {
    if (!isAuthReady || !db) return;
    if (targetUid === "anonymous") {
      setProfile(DEFAULT_PROFILE);
      return;
    }

    const profileRef = getProfileDocRef(targetUid);
    const unsubscribe = onSnapshot(
      profileRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const fallbackUsername = user
            ? generateUsernameFromEmail(user.email, user.uid)
            : DEFAULT_PROFILE.username;
          const fallbackDisplayName = user
            ? user.displayName?.trim() || fallbackUsername
            : DEFAULT_PROFILE.displayName;

          setProfile({
            username:
              typeof data.username === "string" && data.username.trim()
                ? data.username.trim().toLowerCase()
                : fallbackUsername,
            displayName:
              typeof data.displayName === "string" && data.displayName.trim()
                ? data.displayName.trim()
                : fallbackDisplayName,
            bio: typeof data.bio === "string" ? data.bio : "",
            role:
              typeof data.role === "string" && data.role.trim()
                ? data.role.trim()
                : DEFAULT_PROFILE.role,
            focus:
              typeof data.focus === "string" && data.focus.trim()
                ? data.focus.trim()
                : DEFAULT_PROFILE.focus,
            growth: clampGrowth(data.growth, DEFAULT_PROFILE.growth),
            updatedAt:
              typeof data.updatedAt === "string" ? data.updatedAt : undefined,
          });
        } else if (!user) {
          setProfile(DEFAULT_PROFILE);
        }
      },
      (error) => {
        console.error("Failed to subscribe to profile from Firestore:", error);
      }
    );

    return () => unsubscribe();
  }, [isAuthReady, targetUid, user]);

  function handleOpenProfileDialog() {
    if (!user) return;
    setProfileUsername(profile.username);
    setProfileDisplayName(profile.displayName);
    setProfileBio(profile.bio);
    setProfileRole(profile.role);
    setProfileFocus(profile.focus);
    setProfileGrowth(String(profile.growth));
    setProfileErrors({});
    setProfileTouched({});
    setIsProfileDialogOpen(true);
  }

  function handleProfileFieldBlur(
    field: "username" | "displayName" | "bio" | "role" | "focus" | "growth"
  ) {
    setProfileTouched((prev) => ({ ...prev, [field]: true }));
    setProfileErrors(
      validateProfileValues({
        username: profileUsername,
        displayName: profileDisplayName,
        bio: profileBio,
        role: profileRole,
        focus: profileFocus,
        growth: profileGrowth,
      })
    );
  }

  function updateProfileFieldAndValidate(
    field: "username" | "displayName" | "bio" | "role" | "focus" | "growth",
    patch: Partial<{
      username: string;
      displayName: string;
      bio: string;
      role: string;
      focus: string;
      growth: string;
    }>
  ) {
    const merged = {
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio,
      role: profileRole,
      focus: profileFocus,
      growth: profileGrowth,
      ...patch,
    };
    if (profileTouched[field] || profileErrors[field]) {
      setProfileErrors(validateProfileValues(merged));
    }
  }

  async function handleSaveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      setProfileErrors({ general: "로그인이 필요한 기능입니다." });
      return;
    }

    setProfileTouched({
      username: true,
      displayName: true,
      bio: true,
      role: true,
      focus: true,
      growth: true,
    });
    const validationErrors = validateProfileValues({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio,
      role: profileRole,
      focus: profileFocus,
      growth: profileGrowth,
    });

    if (Object.keys(validationErrors).length > 0) {
      setProfileErrors(validationErrors);
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileErrors({});

      const saved = await saveUserProfile(
        user.uid,
        {
          username: profileUsername,
          displayName: profileDisplayName,
          bio: profileBio,
          role: profileRole,
          focus: profileFocus,
          growth: profileGrowth,
        },
        profile.username
      );

      setProfile(saved);
      setIsProfileDialogOpen(false);
    } catch (error) {
      if (error instanceof Error && error.name === "DuplicateUsernameError") {
        setProfileErrors({ username: error.message });
      } else {
        console.error("Failed to save profile to Firestore:", error);
        setProfileErrors({
          general:
            "프로필을 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        });
      }
    } finally {
      setIsSavingProfile(false);
    }
  }

  function validateValues(values: {
    title: string;
    url: string;
    description: string;
    tagsInput: string;
    favicon: string;
  }): FormErrors {
    const nextErrors: FormErrors = {};

    // 1. 채널 이름 검증 (필수, 2~40자)
    const trimmedTitle = values.title.trim();
    if (!trimmedTitle) {
      nextErrors.title = "채널 이름을 입력해주세요.";
    } else if (trimmedTitle.length < 2) {
      nextErrors.title = "채널 이름은 최소 2자 이상 입력해주세요.";
    } else if (trimmedTitle.length > 40) {
      nextErrors.title = "채널 이름은 40자 이내로 입력해주세요.";
    }

    // 2. 이동 URL 검증 (필수, 유효한 도메인/프로토콜, 중복 URL 방지)
    const trimmedUrl = values.url.trim();
    if (!trimmedUrl) {
      nextErrors.url = "이동할 URL을 입력해주세요.";
    } else if (!isValidWebUrl(trimmedUrl)) {
      nextErrors.url =
        "유효한 웹사이트 URL을 입력해주세요. (예: https://example.com)";
    } else {
      const normalized = normalizeUrl(trimmedUrl).replace(/\/+$/, "").toLowerCase();
      const isDuplicate = links.some(
        (item) => item.url.replace(/\/+$/, "").toLowerCase() === normalized
      );
      if (isDuplicate) {
        nextErrors.url = "이미 등록된 채널 URL입니다.";
      }
    }

    // 3. 채널 설명 검증 (선택, 최대 120자)
    if (values.description.trim().length > 120) {
      nextErrors.description = "채널 설명은 120자 이내로 입력해주세요.";
    }

    // 4. 태그 검증 (선택, 최대 5개, 태그당 최대 15자)
    const parsedTags = values.tagsInput
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter(Boolean);

    if (parsedTags.length > 5) {
      nextErrors.tags = "태그는 최대 5개까지 입력할 수 있습니다.";
    } else if (parsedTags.some((tag) => tag.length > 15)) {
      nextErrors.tags = "각 태그는 15자 이내로 입력해주세요.";
    }

    // 5. 파비콘 URL 검증 (선택, 입력 시 유효한 URL 또는 로컬 절대 경로)
    const trimmedFavicon = values.favicon.trim();
    if (trimmedFavicon) {
      const isLocalPath = trimmedFavicon.startsWith("/");
      const isValidRemote =
        /^https?:\/\//i.test(trimmedFavicon) && isValidWebUrl(trimmedFavicon);
      if (!isLocalPath && !isValidRemote) {
        nextErrors.favicon =
          "올바른 파비콘 URL을 입력해주세요. (예: https://example.com/favicon.ico)";
      }
    }

    return nextErrors;
  }

  function handleFieldBlur(field: FormField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = validateValues({
      title,
      url,
      description,
      tagsInput,
      favicon,
    });
    setErrors(nextErrors);
  }

  function updateFieldAndValidate(
    field: FormField,
    nextStatePatch: Partial<{
      title: string;
      url: string;
      description: string;
      tagsInput: string;
      favicon: string;
    }>
  ) {
    const merged = {
      title,
      url,
      description,
      tagsInput,
      favicon,
      ...nextStatePatch,
    };
    if (touched[field] || errors[field]) {
      setErrors(validateValues(merged));
    }
  }

  function resetForm() {
    setTitle("");
    setUrl("");
    setDescription("");
    setCategory("개발");
    setTagsInput("");
    setFavicon("");
    setIsFavorite(false);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }

  async function handleAddLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      setSubmitError("로그인이 필요한 기능입니다.");
      return;
    }

    setTouched({
      title: true,
      url: true,
      description: true,
      tags: true,
      favicon: true,
    });

    const validationErrors = validateValues({
      title,
      url,
      description,
      tagsInput,
      favicon,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const trimmedTitle = title.trim();
    const normalizedUrl = normalizeUrl(url);
    const parsedTags = Array.from(
      new Set(
        tagsInput
          .split(",")
          .map((tag) => tag.trim().replace(/^#/, ""))
          .filter(Boolean)
      )
    );

    const newLinkData = {
      title: trimmedTitle,
      url: normalizedUrl,
      description:
        description.trim() || `${trimmedTitle} 바로가기 링크입니다.`,
      category,
      tags: parsedTags,
      favicon: favicon.trim() || getDefaultFavicon(normalizedUrl),
      isFavorite,
      clickCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const linksRef = collection(db, "users", user.uid, "links");
      const docRef = await addDoc(linksRef, newLinkData);

      setLinks((prev) => {
        if (prev.some((item) => item.id === docRef.id)) {
          return prev;
        }
        return [{ id: docRef.id, ...newLinkData }, ...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      await fetchLinks();

      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add link to Firestore:", error);
      setSubmitError(
        "Firestore에 링크를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStartEdit(link: LinkItem) {
    if (!user) return;
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditError({});
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditError({});
  }

  async function handleSaveEdit(link: LinkItem) {
    if (!user) {
      setEditError({ general: "로그인이 필요한 기능입니다." });
      return;
    }

    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();
    const nextError: { title?: string; url?: string; general?: string } = {};

    if (!trimmedTitle) {
      nextError.title = "제목을 입력해주세요.";
    }
    if (!trimmedUrl) {
      nextError.url = "주소를 입력해주세요.";
    }

    if (Object.keys(nextError).length > 0) {
      setEditError(nextError);
      return;
    }

    const normalizedUrl = normalizeUrl(trimmedUrl);
    const nextFavicon =
      link.favicon === getDefaultFavicon(link.url)
        ? getDefaultFavicon(normalizedUrl)
        : link.favicon;

    try {
      setIsUpdating(true);
      setEditError({});

      const linkDocRef = doc(db, "users", user.uid, "links", link.id);
      await updateDoc(linkDocRef, {
        title: trimmedTitle,
        url: normalizedUrl,
        favicon: nextFavicon,
      });

      setLinks((prev) =>
        prev.map((item) =>
          item.id === link.id
            ? {
                ...item,
                title: trimmedTitle,
                url: normalizedUrl,
                favicon: nextFavicon,
              }
            : item
        )
      );

      setEditingId(null);
      setEditTitle("");
      setEditUrl("");
    } catch (error) {
      console.error("Failed to update link in Firestore:", error);
      setEditError({
        general: "링크 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  function handleOpenDeleteModal(link: LinkItem) {
    if (!user) return;
    setDeleteTarget(link);
    setDeleteError(null);
  }

  function handleCloseDeleteModal() {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget || !user) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const linkDocRef = doc(
        db,
        "users",
        user.uid,
        "links",
        deleteTarget.id
      );
      await deleteDoc(linkDocRef);

      setLinks((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      if (editingId === deleteTarget.id) {
        handleCancelEdit();
      }
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete link from Firestore:", error);
      setDeleteError(
        "링크를 삭제하는 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleLinkClick(linkId: string) {
    if (!user) {
      console.error("링크 클릭 카운트를 저장하려면 로그인이 필요합니다.");
      return;
    }

    await incrementLinkClickCount(user.uid, linkId);
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* 상단 고정 Topbar (Sticky header + 이름 탭 및 구글 로그인/로그아웃·문의하기 버튼 탭 배경 적용) */}
      <header className="sticky top-0 z-30 h-14 border-b border-slate-200/90 bg-white/95 shadow-2xs backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 lg:px-8">
          {/* 최상단 좌측: 이름 탭 (배경 적용) */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-slate-100/90 py-1 pr-3.5 pl-1.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-800/90">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white shadow-2xs">
              {profile.displayName.slice(0, 2).toUpperCase() || "MY"}
            </span>
            <div className="flex items-center gap-2">
              <span className="max-w-[140px] truncate text-[15px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {profile.displayName}
              </span>
              <span className="h-3 w-px bg-slate-300 dark:bg-neutral-700" />
              <span className="max-w-[120px] truncate text-xs font-medium text-slate-600 dark:text-neutral-400">
                @{profile.username}
              </span>
            </div>
          </div>

          {/* 최상단 우측: 상태 뱃지 & 구글 로그인/로그아웃 & 문의하기 버튼 탭 */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-100/90 p-1 shadow-2xs dark:border-neutral-800 dark:bg-neutral-800/90">
            <span
              className={`${pillStyles.green} hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold md:inline-flex`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              바이브 코딩 집중 주간
            </span>

            {user ? (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 shadow-2xs ring-1 ring-slate-200/90 dark:bg-neutral-900 dark:ring-neutral-700">
                <span className="max-w-[120px] truncate text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {profile.displayName || user.displayName || user.email || "사용자"}
                </span>
                <span className="h-3 w-px bg-slate-200 dark:bg-neutral-700" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-rose-400"
                >
                  <LogOutIcon className="size-3" />
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleGoogleLogin}
                className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 text-xs font-bold text-neutral-900 shadow-2xs transition-all hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-slate-400/30 focus-visible:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                <svg className="size-3.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoggingIn ? "로그인 중..." : "Google로 로그인"}
              </button>
            )}

            <a
              href="mailto:hello@example.com"
              className="inline-flex h-8 items-center justify-center rounded-full bg-rose-600 px-4 text-[13px] font-bold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-rose-500/30 focus-visible:outline-none"
            >
              문의하기
            </a>
          </div>
        </div>
      </header>

      {/* 메인 컨테이너 (모바일 16px 거터, 데스크톱 32px 거터) */}
      <main className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:pt-8 lg:px-8">
        {authError && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
          >
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{authError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              aria-label="오류 안내 닫기"
              className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-rose-600 transition-colors hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-900/60"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        )}

        {/* 12컬럼 비대칭 반응형 레이아웃 유지 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* 좌측 (5컬럼): 메인 프로필 카드 & 링크 클릭 통계 */}
          <section className="flex flex-col gap-4 lg:sticky lg:top-22 lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              {/* 카드 상단 메타 헤더 */}
              <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-3 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-neutral-300">
                  <svg
                    className="h-4 w-4 text-rose-600 dark:text-rose-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                    />
                  </svg>
                  <span>크리에이터 프로필</span>
                </div>
                <div className="flex items-center gap-2">
                  {user && (
                    <button
                      type="button"
                      onClick={handleOpenProfileDialog}
                      className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-[11px] font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-white"
                    >
                      <PencilIcon className="size-3" />
                      프로필 수정
                    </button>
                  )}
                  <span
                    className={`${pillStyles.red} rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
                  >
                    ACTIVE 2026
                  </span>
                </div>
              </div>

              {/* 배너 아트워크 이미지 */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100 sm:h-44 dark:bg-neutral-800">
                <Image
                  src="/images/banner.jpg"
                  alt="추상 3D 커버 그래픽"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
                <div className="absolute top-3 left-4">
                  <span
                    className={`${pillStyles.teal} inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs`}
                  >
                    CREATIVE STUDIO
                  </span>
                </div>
              </div>

              {/* 아바타 + 이름 + 자기소개 + 지표 */}
              <div className="relative px-5 pt-0 pb-5">
                <div className="-mt-12 mb-3 flex items-end justify-between">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-[3px] border-white bg-slate-100 shadow-md sm:h-26 sm:w-26 dark:border-neutral-900 dark:bg-neutral-800">
                    <Image
                      src="/images/avatar.jpg"
                      alt={`${profile.displayName} 프로필 아바타`}
                      fill
                      priority
                      sizes="104px"
                      className="object-cover"
                    />
                  </div>

                  <span
                    className={`${pillStyles.red} inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
                  >
                    VIBE CODER
                  </span>
                </div>

                {/* 타이틀 & 핸들 */}
                <div>
                  <span
                    className={`${pillStyles.teal} inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
                  >
                    CREATIVE DESIGNER &amp; BUILDER
                  </span>
                  <h1 className="mt-2 text-[28px] leading-snug font-bold tracking-tight text-neutral-900 sm:text-[32px] dark:text-neutral-50">
                    {profile.displayName}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                      <AtSignIcon className="size-3 text-rose-600 dark:text-rose-400" />
                      {profile.username}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-neutral-500">
                      공유 URL: /{profile.username}
                    </span>
                  </div>
                </div>

                {/* 자기소개 박스 */}
                <div className="mt-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                  {profile.bio.trim() ? (
                    <p className="text-sm leading-relaxed font-normal whitespace-pre-line text-slate-700 break-keep dark:text-neutral-300">
                      {profile.bio}
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed font-normal text-slate-400 break-keep dark:text-neutral-500">
                      아직 소개글이 없습니다. 프로필 수정에서 나를 소개해보세요.
                    </p>
                  )}
                </div>

                {/* 프로필 수정 모달 */}
                <Dialog
                  open={isProfileDialogOpen}
                  onOpenChange={(open) => {
                    if (isSavingProfile) return;
                    setIsProfileDialogOpen(open);
                    if (!open) setProfileErrors({});
                  }}
                >
                  <DialogContent className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:max-w-md dark:border-neutral-800 dark:bg-neutral-900">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        프로필 수정
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                        공유 URL용 username, 표시 이름, 소개글을 수정할 수 있습니다.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleSaveProfile}
                      noValidate
                      className="mt-1 flex flex-col gap-3.5"
                    >
                      {/* username (공유 URL용) */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="profile-username"
                            className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                          >
                            username (공유 URL용){" "}
                            <span className="text-rose-600">*</span>
                          </Label>
                          <span
                            className={`text-[11px] tabular-nums ${
                              profileUsername.trim().length > 30
                                ? "font-bold text-rose-600 dark:text-rose-400"
                                : "text-slate-400 dark:text-neutral-500"
                            }`}
                          >
                            {profileUsername.trim().length}/30
                          </span>
                        </div>
                        <Input
                          id="profile-username"
                          placeholder="예: kimjihoo"
                          value={profileUsername}
                          disabled={isSavingProfile}
                          aria-invalid={Boolean(profileErrors.username)}
                          onBlur={() => handleProfileFieldBlur("username")}
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            setProfileUsername(nextValue);
                            updateProfileFieldAndValidate("username", {
                              username: nextValue,
                            });
                          }}
                        />
                        <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                          공유 URL 미리보기: /
                          {profileUsername.trim().toLowerCase() || "username"}
                        </p>
                        {profileErrors.username && (
                          <p
                            role="alert"
                            className="text-xs font-medium text-rose-600 dark:text-rose-400"
                          >
                            {profileErrors.username}
                          </p>
                        )}
                      </div>

                      {/* displayName (표시 이름) */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="profile-display-name"
                            className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                          >
                            표시 이름 (displayName){" "}
                            <span className="text-rose-600">*</span>
                          </Label>
                          <span
                            className={`text-[11px] tabular-nums ${
                              profileDisplayName.trim().length > 40
                                ? "font-bold text-rose-600 dark:text-rose-400"
                                : "text-slate-400 dark:text-neutral-500"
                            }`}
                          >
                            {profileDisplayName.trim().length}/40
                          </span>
                        </div>
                        <Input
                          id="profile-display-name"
                          placeholder="예: 김지후"
                          value={profileDisplayName}
                          disabled={isSavingProfile}
                          aria-invalid={Boolean(profileErrors.displayName)}
                          onBlur={() => handleProfileFieldBlur("displayName")}
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            setProfileDisplayName(nextValue);
                            updateProfileFieldAndValidate("displayName", {
                              displayName: nextValue,
                            });
                          }}
                        />
                        {profileErrors.displayName && (
                          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                            {profileErrors.displayName}
                          </p>
                        )}
                      </div>

                      {/* bio (소개글) */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="profile-bio"
                            className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                          >
                            소개글 (bio)
                          </Label>
                          <span
                            className={`text-[11px] tabular-nums ${
                              profileBio.trim().length > 200
                                ? "font-bold text-rose-600 dark:text-rose-400"
                                : "text-slate-400 dark:text-neutral-500"
                            }`}
                          >
                            {profileBio.trim().length}/200
                          </span>
                        </div>
                        <Textarea
                          id="profile-bio"
                          placeholder="나를 소개하는 짧은 글을 입력해주세요."
                          value={profileBio}
                          disabled={isSavingProfile}
                          aria-invalid={Boolean(profileErrors.bio)}
                          onBlur={() => handleProfileFieldBlur("bio")}
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            setProfileBio(nextValue);
                            updateProfileFieldAndValidate("bio", {
                              bio: nextValue,
                            });
                          }}
                          rows={3}
                        />
                        {profileErrors.bio && (
                          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                            {profileErrors.bio}
                          </p>
                        )}
                      </div>

                      {/* role / focus / growth */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="profile-role"
                            className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                          >
                            Role <span className="text-rose-600">*</span>
                          </Label>
                          <Input
                            id="profile-role"
                            placeholder="예: Creator"
                            value={profileRole}
                            disabled={isSavingProfile}
                            aria-invalid={Boolean(profileErrors.role)}
                            onBlur={() => handleProfileFieldBlur("role")}
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              setProfileRole(nextValue);
                              updateProfileFieldAndValidate("role", {
                                role: nextValue,
                              });
                            }}
                          />
                          {profileErrors.role && (
                            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                              {profileErrors.role}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="profile-focus"
                            className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                          >
                            Focus <span className="text-rose-600">*</span>
                          </Label>
                          <Input
                            id="profile-focus"
                            placeholder="예: Vibe Coding"
                            value={profileFocus}
                            disabled={isSavingProfile}
                            aria-invalid={Boolean(profileErrors.focus)}
                            onBlur={() => handleProfileFieldBlur("focus")}
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              setProfileFocus(nextValue);
                              updateProfileFieldAndValidate("focus", {
                                focus: nextValue,
                              });
                            }}
                          />
                          {profileErrors.focus && (
                            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                              {profileErrors.focus}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="profile-growth"
                            className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                          >
                            Growth (%) <span className="text-rose-600">*</span>
                          </Label>
                          <Input
                            id="profile-growth"
                            type="number"
                            min={0}
                            max={100}
                            placeholder="85"
                            value={profileGrowth}
                            disabled={isSavingProfile}
                            aria-invalid={Boolean(profileErrors.growth)}
                            onBlur={() => handleProfileFieldBlur("growth")}
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              setProfileGrowth(nextValue);
                              updateProfileFieldAndValidate("growth", {
                                growth: nextValue,
                              });
                            }}
                          />
                          {profileErrors.growth && (
                            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                              {profileErrors.growth}
                            </p>
                          )}
                        </div>
                      </div>

                      {profileErrors.general && (
                        <p
                          role="alert"
                          className="text-xs font-medium text-rose-600 dark:text-rose-400"
                        >
                          {profileErrors.general}
                        </p>
                      )}

                      <DialogFooter className="-mx-5 -mb-5 mt-1 rounded-b-2xl border-t border-slate-200/80 bg-slate-50/80 px-5 py-3.5 dark:border-neutral-800 dark:bg-neutral-900/80">
                        <DialogClose
                          render={
                            <Button
                              type="button"
                              variant="outline"
                              disabled={isSavingProfile}
                              className="rounded-full px-4 text-xs font-bold"
                            />
                          }
                        >
                          취소
                        </DialogClose>
                        <Button
                          type="submit"
                          disabled={isSavingProfile}
                          className="rounded-full bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700"
                        >
                          {isSavingProfile ? "저장 중..." : "저장하기"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* 대시보드형 요약 지표 (tabular-nums 적용) */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white py-3 text-center dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="px-2">
                    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
                      ROLE
                    </p>
                    <p className="mt-1 truncate text-[15px] font-bold text-neutral-900 dark:text-neutral-50">
                      {profile.role}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
                      FOCUS
                    </p>
                    <p className="mt-1 truncate text-[15px] font-bold text-rose-600 dark:text-rose-400">
                      {profile.focus}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
                      GROWTH
                    </p>
                    <p className="mt-1 text-lg leading-tight font-bold text-neutral-900 tabular-nums dark:text-neutral-50">
                      {profile.growth}%
                    </p>
                  </div>
                </div>

                {/* 주요 행동 버튼 (Pill CTA) */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <a
                    href="#channels"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-rose-600 px-4 text-sm font-bold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-rose-500/30 focus-visible:outline-none"
                  >
                    작업물 살펴보기
                  </a>
                  <a
                    href="mailto:hello@example.com"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-slate-400/30 focus-visible:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    협업 제안하기
                  </a>
                </div>
              </div>
            </div>

            {/* 좌측 하단: 링크 클릭 통계 섹션 */}
            <section
              aria-labelledby="link-stats-heading"
              className="rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-6"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <BarChart3Icon className="size-4" />
                  </span>
                  <div>
                    <h2
                      id="link-stats-heading"
                      className="text-lg font-semibold tracking-tight text-foreground"
                    >
                      링크 클릭 통계
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      등록된 링크의 누적 클릭 현황입니다.
                    </p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground tabular-nums">
                  총 {links.length}개 링크
                </span>
              </div>

              {/* 총 클릭수 요약 카드 */}
              <div className="mt-4 flex flex-col gap-1 rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  누적 총 클릭수
                </p>
                <p className="mt-1 flex items-baseline gap-1.5 text-foreground">
                  <span className="text-sm font-medium text-muted-foreground">
                    총
                  </span>
                  <span className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                    {totalClicks.toLocaleString()}
                  </span>
                  <span className="text-base font-semibold text-muted-foreground">
                    클릭
                  </span>
                </p>
              </div>
            </section>
          </section>

          {/* 우측 (7컬럼): 스킬 & 학습 진행률 카드 + 채널 바로가기 카드 */}
          <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-8">
            {/* 섹션 1: 툴킷 & 바이브 코딩 진행률 */}
            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4 dark:border-neutral-800">
                <div>
                  <span className="text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-neutral-400">
                    01 · TOOLKIT &amp; PROGRESS
                  </span>
                  <h2 className="mt-1 text-[22px] leading-snug font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    보유 역량 및 학습 현황
                  </h2>
                </div>
                <span
                  className={`${pillStyles.red} rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
                >
                  DESIGN × CODE
                </span>
              </div>

              {/* 스킬 Pill 태그 리스트 */}
              <div className="mt-4">
                <p className="mb-2.5 text-[13px] font-medium text-slate-600 dark:text-neutral-300">
                  시각적 완성도와 인터랙티브 웹 구현을 위해 함께 다루는 도구들이에요.
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`${pillStyles[skill.tone]} inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 진행률 바 (Capsule track & tabular-nums 수치) */}
              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`${pillStyles.green} rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
                    >
                      진행 중
                    </span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                      인터랙티브 포트폴리오 구축 프로젝트
                    </span>
                  </div>
                  <span className="text-[22px] leading-snug font-bold text-rose-600 tabular-nums dark:text-rose-400">
                    {profile.growth}%
                  </span>
                </div>

                {/* Capsule Progress Bar */}
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full bg-rose-600 transition-all duration-500"
                    style={{ width: `${profile.growth}%` }}
                  />
                </div>

                <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600 break-keep dark:text-neutral-300">
                  디자인 감각을 바탕으로 Next.js와 Tailwind CSS를 활용한 반응형 웹 컴포넌트 제작 역량을 꾸준히 넓혀가고 있어요.
                </p>
              </div>
            </section>

            {/* 섹션 2: 채널 및 포트폴리오 링크 (Link-in-bio) */}
            <section
              id="channels"
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4 dark:border-neutral-800">
                <div>
                  <span className="text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-neutral-400">
                    02 · CHANNELS &amp; ARCHIVES
                  </span>
                  <h2 className="mt-1 text-[22px] leading-snug font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    포트폴리오 및 소통 채널
                  </h2>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-neutral-400">
                    총 {links.length}개 채널
                  </span>

                  {user ? (
                    <Dialog
                      open={isAddDialogOpen}
                      onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (!open) resetForm();
                      }}
                    >
                      <DialogTrigger
                        render={
                          <Button
                            type="button"
                            className="h-8 rounded-full bg-rose-600 px-3.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 focus-visible:ring-rose-500/30"
                          />
                        }
                      >
                        <PlusIcon className="size-3.5" />
                        새 채널 추가
                      </DialogTrigger>

                      <DialogContent className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:max-w-md dark:border-neutral-800 dark:bg-neutral-900">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            새 채널 링크 추가
                          </DialogTitle>
                          <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                            포트폴리오 및 소통 채널 목록에 표시할 새 링크 정보를 입력해주세요.
                          </DialogDescription>
                        </DialogHeader>

                        <form
                          onSubmit={handleAddLink}
                          noValidate
                          className="mt-1 flex flex-col gap-3.5"
                        >
                          {/* 채널 이름 */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="link-title"
                                className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                              >
                                채널 이름 <span className="text-rose-600">*</span>
                              </Label>
                              <span
                                className={`text-[11px] tabular-nums ${
                                  title.trim().length > 40
                                    ? "font-bold text-rose-600 dark:text-rose-400"
                                    : "text-slate-400 dark:text-neutral-500"
                                }`}
                              >
                                {title.trim().length}/40
                              </span>
                            </div>
                            <Input
                              id="link-title"
                              placeholder="예: GitHub, 개인 기술 블로그"
                              value={title}
                              aria-invalid={Boolean(errors.title)}
                              onBlur={() => handleFieldBlur("title")}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setTitle(nextValue);
                                updateFieldAndValidate("title", { title: nextValue });
                              }}
                            />
                            {errors.title && (
                              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                                {errors.title}
                              </p>
                            )}
                          </div>

                          {/* URL */}
                          <div className="flex flex-col gap-1.5">
                            <Label
                              htmlFor="link-url"
                              className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                            >
                              이동 URL <span className="text-rose-600">*</span>
                            </Label>
                            <Input
                              id="link-url"
                              type="text"
                              placeholder="https://example.com"
                              value={url}
                              aria-invalid={Boolean(errors.url)}
                              onBlur={() => handleFieldBlur("url")}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setUrl(nextValue);
                                updateFieldAndValidate("url", { url: nextValue });
                              }}
                            />
                            {errors.url && (
                              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                                {errors.url}
                              </p>
                            )}
                          </div>

                          {/* 카테고리 선택 (Pill 버튼) */}
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-bold text-slate-700 dark:text-neutral-200">
                              카테고리
                            </Label>
                            <div className="flex flex-wrap gap-1.5">
                              {categories.map((cat) => {
                                const tone = categoryToneMap[cat] ?? "neutral";
                                const isSelected = category === cat;
                                return (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                                      isSelected
                                        ? `${pillStyles[tone]} ring-2 ring-neutral-900 dark:ring-neutral-100`
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200/70 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 설명 */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="link-description"
                                className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                              >
                                채널 설명
                              </Label>
                              <span
                                className={`text-[11px] tabular-nums ${
                                  description.trim().length > 120
                                    ? "font-bold text-rose-600 dark:text-rose-400"
                                    : "text-slate-400 dark:text-neutral-500"
                                }`}
                              >
                                {description.trim().length}/120
                              </span>
                            </div>
                            <Textarea
                              id="link-description"
                              placeholder="채널이나 작업물에 대한 간단한 소개를 입력해주세요."
                              value={description}
                              aria-invalid={Boolean(errors.description)}
                              onBlur={() => handleFieldBlur("description")}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setDescription(nextValue);
                                updateFieldAndValidate("description", {
                                  description: nextValue,
                                });
                              }}
                              rows={2}
                            />
                            {errors.description && (
                              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                                {errors.description}
                              </p>
                            )}
                          </div>

                          {/* 태그 */}
                          <div className="flex flex-col gap-1.5">
                            <Label
                              htmlFor="link-tags"
                              className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                            >
                              태그{" "}
                              <span className="font-normal text-slate-400">
                                (쉼표로 구분 · 최대 5개)
                              </span>
                            </Label>
                            <Input
                              id="link-tags"
                              placeholder="예: frontend, portfolio, design"
                              value={tagsInput}
                              aria-invalid={Boolean(errors.tags)}
                              onBlur={() => handleFieldBlur("tags")}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setTagsInput(nextValue);
                                updateFieldAndValidate("tags", {
                                  tagsInput: nextValue,
                                });
                              }}
                            />
                            {errors.tags && (
                              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                                {errors.tags}
                              </p>
                            )}
                          </div>

                          {/* 파비콘 URL (선택) */}
                          <div className="flex flex-col gap-1.5">
                            <Label
                              htmlFor="link-favicon"
                              className="text-xs font-bold text-slate-700 dark:text-neutral-200"
                            >
                              파비콘 URL{" "}
                              <span className="font-normal text-slate-400">
                                (비워두면 도메인 기준 자동 설정)
                              </span>
                            </Label>
                            <Input
                              id="link-favicon"
                              placeholder="https://example.com/favicon.ico"
                              value={favicon}
                              aria-invalid={Boolean(errors.favicon)}
                              onBlur={() => handleFieldBlur("favicon")}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setFavicon(nextValue);
                                updateFieldAndValidate("favicon", {
                                  favicon: nextValue,
                                });
                              }}
                            />
                            {errors.favicon && (
                              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                                {errors.favicon}
                              </p>
                            )}
                          </div>

                          {/* 즐겨찾기 스위치 */}
                          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 dark:border-neutral-800 dark:bg-neutral-800/50">
                            <div className="flex flex-col gap-0.5">
                              <Label
                                htmlFor="link-favorite"
                                className="cursor-pointer text-xs font-bold text-neutral-900 dark:text-neutral-100"
                              >
                                ★ 즐겨찾기 채널로 표시
                              </Label>
                              <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                                카드 상단에 즐겨찾기 강조 뱃지를 함께 표시해요.
                              </span>
                            </div>
                            <Switch
                              id="link-favorite"
                              checked={isFavorite}
                              onCheckedChange={(checked) => setIsFavorite(checked)}
                            />
                          </div>

                          {submitError && (
                            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                              {submitError}
                            </p>
                          )}

                          <DialogFooter className="-mx-5 -mb-5 mt-1 rounded-b-2xl border-t border-slate-200/80 bg-slate-50/80 px-5 py-3.5 dark:border-neutral-800 dark:bg-neutral-900/80">
                            <DialogClose
                              render={
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isSubmitting}
                                  className="rounded-full px-4 text-xs font-bold"
                                />
                              }
                            >
                              취소
                            </DialogClose>
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="rounded-full bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700"
                            >
                              {isSubmitting ? "저장 중..." : "추가하기"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      className="h-8 rounded-full px-3.5 text-xs font-bold text-slate-600 dark:text-neutral-300"
                    >
                      <LockIcon className="size-3" />
                      로그인 후 편집 가능
                    </Button>
                  )}
                </div>
              </div>

              {/* 2열 반응형 카드 그리드 (동일 행 높이 유지 & 하단 메타데이터 고정) */}
              {isLoadingLinks ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex h-48 animate-pulse flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-neutral-800 dark:bg-neutral-800/40"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-neutral-700" />
                          <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-neutral-700" />
                        </div>
                        <div className="h-3 w-28 rounded bg-slate-200 dark:bg-neutral-700" />
                        <div className="h-5 w-40 rounded bg-slate-200 dark:bg-neutral-700" />
                        <div className="h-4 w-full rounded bg-slate-200 dark:bg-neutral-700" />
                      </div>
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-neutral-700" />
                    </div>
                  ))}
                </div>
              ) : links.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-800/30">
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    등록된 채널 링크가 없습니다.
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                    {user
                      ? "우측 상단의 ‘새 채널 추가’ 버튼을 눌러 첫 번째 링크를 추가해보세요."
                      : "채널 추가 및 수정은 상단 헤더에서 Google 로그인 후 이용할 수 있습니다."}
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {links.map((link, index) => {
                    const num = String(index + 1).padStart(2, "0");
                    const badgeTone = categoryToneMap[link.category] ?? "neutral";
                    const isEditing = editingId === link.id;

                    return (
                      <div
                        key={link.id}
                        className={`group flex h-full flex-col justify-between rounded-2xl border bg-white p-5 transition-all duration-200 dark:bg-neutral-900 ${
                          isEditing
                            ? "border-rose-400 ring-2 ring-rose-500/20 dark:border-rose-500/70"
                            : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-neutral-800 dark:hover:border-neutral-700"
                        }`}
                      >
                        {/* 상단: 아이콘 + 뱃지 + 수정 버튼 / 인라인 편집 폼 */}
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-neutral-800 dark:text-neutral-200 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={link.favicon}
                                alt={`${link.title} 파비콘`}
                                className="h-4.5 w-4.5 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/globe.svg";
                                }}
                              />
                            </span>
                            <div className="flex items-center gap-1.5">
                              {link.isFavorite && (
                                <span
                                  className={`${pillStyles.red} inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold`}
                                >
                                  ★ 즐겨찾기
                                </span>
                              )}
                              <span
                                className={`${pillStyles[badgeTone]} rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
                              >
                                {link.category}
                              </span>
                              {user && !isEditing && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(link)}
                                    aria-label={`${link.title} 수정`}
                                    title="수정"
                                    className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-[11px] font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
                                  >
                                    <PencilIcon className="size-3" />
                                    수정
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDeleteModal(link)}
                                    aria-label={`${link.title} 삭제`}
                                    title="삭제"
                                    className="inline-flex h-7 items-center gap-1 rounded-full border border-rose-200 bg-rose-50/70 px-2.5 text-[11px] font-bold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-400 dark:hover:bg-rose-950/90 dark:hover:text-rose-300"
                                  >
                                    <Trash2Icon className="size-3" />
                                    삭제
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <p className="mt-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase tabular-nums dark:text-neutral-400">
                            {num} · {formatDomain(link.url)} · {formatDate(link.createdAt)}
                          </p>

                          {isEditing ? (
                            <div className="mt-2.5 space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`edit-title-${link.id}`}
                                  className="text-[11px] font-bold text-slate-700 dark:text-neutral-200"
                                >
                                  제목
                                </Label>
                                <Input
                                  id={`edit-title-${link.id}`}
                                  value={editTitle}
                                  placeholder="링크 제목 입력"
                                  aria-invalid={Boolean(editError.title)}
                                  disabled={isUpdating}
                                  onChange={(e) => {
                                    setEditTitle(e.target.value);
                                    if (editError.title) {
                                      setEditError((prev) => ({
                                        ...prev,
                                        title: undefined,
                                      }));
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleSaveEdit(link);
                                    } else if (e.key === "Escape") {
                                      handleCancelEdit();
                                    }
                                  }}
                                  className="h-8 bg-white text-sm dark:bg-neutral-900"
                                />
                                {editError.title && (
                                  <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                    {editError.title}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-1">
                                <Label
                                  htmlFor={`edit-url-${link.id}`}
                                  className="text-[11px] font-bold text-slate-700 dark:text-neutral-200"
                                >
                                  주소 (URL)
                                </Label>
                                <Input
                                  id={`edit-url-${link.id}`}
                                  value={editUrl}
                                  placeholder="https://example.com"
                                  aria-invalid={Boolean(editError.url)}
                                  disabled={isUpdating}
                                  onChange={(e) => {
                                    setEditUrl(e.target.value);
                                    if (editError.url) {
                                      setEditError((prev) => ({
                                        ...prev,
                                        url: undefined,
                                      }));
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleSaveEdit(link);
                                    } else if (e.key === "Escape") {
                                      handleCancelEdit();
                                    }
                                  }}
                                  className="h-8 bg-white text-xs dark:bg-neutral-900"
                                />
                                {editError.url && (
                                  <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                    {editError.url}
                                  </p>
                                )}
                              </div>

                              {editError.general && (
                                <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                  {editError.general}
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              <h3 className="mt-1 text-lg leading-snug font-bold text-neutral-900 dark:text-neutral-50">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => void handleLinkClick(link.id)}
                                  className="hover:underline"
                                >
                                  {link.title}
                                </a>
                              </h3>
                              <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-neutral-500">
                                {link.url}
                              </p>
                            </>
                          )}

                          <p className="mt-1.5 text-[13px] leading-relaxed font-normal text-slate-600 break-keep dark:text-neutral-300">
                            {link.description}
                          </p>

                          {link.tags.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {link.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-neutral-800 dark:text-neutral-400"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 하단 고정 메타데이터 푸터 / 편집 모드 저장·취소 버튼 */}
                        {isEditing ? (
                          <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200/80 pt-3 dark:border-neutral-800">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isUpdating}
                              onClick={handleCancelEdit}
                              className="h-8 rounded-full px-3 text-xs font-bold"
                            >
                              <XIcon className="size-3.5" />
                              취소
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handleSaveEdit(link)}
                              className="h-8 rounded-full bg-rose-600 px-3.5 text-xs font-bold text-white hover:bg-rose-700"
                            >
                              <CheckIcon className="size-3.5" />
                              {isUpdating ? "저장 중..." : "저장"}
                            </Button>
                          </div>
                        ) : (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => void handleLinkClick(link.id)}
                            className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 focus-visible:outline-none dark:border-neutral-800"
                          >
                            <span className="text-[13px] font-bold text-blue-700 dark:text-blue-400">
                              사이트 바로가기
                            </span>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-blue-700 transition-all group-hover:translate-x-0.5 group-hover:bg-blue-50 dark:text-blue-400 dark:group-hover:bg-blue-950/60">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                />
                              </svg>
                            </span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 링크 삭제 확인 모달 */}
              <Dialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => {
                  if (!open) handleCloseDeleteModal();
                }}
              >
                <DialogContent className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:max-w-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                      정말 삭제하시겠습니까?
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm font-medium text-slate-700 dark:text-neutral-200">
                      &ldquo;{deleteTarget?.title}&rdquo; 링크가 삭제됩니다
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-200/80 bg-rose-50/80 px-3.5 py-2.5 text-xs font-bold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
                    <AlertTriangleIcon className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>이 작업은 되돌릴 수 없습니다</span>
                  </div>

                  {deleteError && (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      {deleteError}
                    </p>
                  )}

                  <DialogFooter className="-mx-5 -mb-5 mt-3 rounded-b-2xl border-t border-slate-200/80 bg-slate-50/80 px-5 py-3.5 dark:border-neutral-800 dark:bg-neutral-900/80">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isDeleting}
                      onClick={handleCloseDeleteModal}
                      className="rounded-full px-4 text-xs font-bold"
                    >
                      취소
                    </Button>
                    <Button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleConfirmDelete}
                      className="rounded-full bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700"
                    >
                      {isDeleting ? "삭제 중..." : "삭제하기"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </section>
          </div>
        </div>

        {/* 하단 푸터 (1px 보더 평면 카드 구조) */}
        <footer className="mt-8 flex flex-col items-center justify-between gap-2.5 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 sm:flex-row dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-2">
            <span
              className={`${pillStyles.red} rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
            >
              CREATOR
            </span>
            <p className="text-[13px] font-medium text-slate-600 dark:text-neutral-300">
              © 2026 {profile.displayName}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-neutral-400">
            <span>Tailwind CSS v4</span>
            <span>·</span>
            <span>Pretendard Variable</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
