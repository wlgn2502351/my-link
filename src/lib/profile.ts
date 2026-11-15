import {
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  role: string;
  focus: string;
  growth: number;
  updatedAt?: string;
}

export interface ProfileFormErrors {
  username?: string;
  displayName?: string;
  bio?: string;
  role?: string;
  focus?: string;
  growth?: string;
  general?: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  username: "jihoo",
  displayName: "김지후",
  bio: "안녕하세요! 시각미디어디자인과 재학생 김지후입니다. 감각적인 그래픽 디자인을 넘어, 지금은 바이브 코딩(Vibe Coding)으로 상상을 직접 동작하는 웹 화면으로 구현하고 있어요.",
  role: "Creator",
  focus: "Vibe Coding",
  growth: 85,
};

const USERNAME_REGEX = /^[a-z0-9_-]{2,30}$/;

/**
 * 이메일 앞부분(@ 이전)을 기반으로 URL에 안전한 기본 username을 생성합니다.
 */
export function generateUsernameFromEmail(
  email: string | null | undefined,
  uid: string
): string {
  const localPart = email?.split("@")[0] ?? "";
  const sanitized = localPart
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 30);

  if (sanitized.length >= 2) {
    return sanitized;
  }

  return `user-${uid.slice(0, 6).toLowerCase()}`;
}

export function normalizeUsernameInput(raw: string): string {
  return raw.trim().toLowerCase();
}

export function clampGrowth(value: unknown, fallback = DEFAULT_PROFILE.growth): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(100, Math.max(0, Math.round(num)));
}

export function validateProfileValues(values: {
  username: string;
  displayName: string;
  bio: string;
  role: string;
  focus: string;
  growth: string;
}): ProfileFormErrors {
  const errors: ProfileFormErrors = {};
  const normalizedUsername = normalizeUsernameInput(values.username);
  const trimmedDisplayName = values.displayName.trim();
  const trimmedBio = values.bio.trim();
  const trimmedRole = values.role.trim();
  const trimmedFocus = values.focus.trim();
  const trimmedGrowth = values.growth.trim();

  if (!normalizedUsername) {
    errors.username = "공유 URL용 username을 입력해주세요.";
  } else if (!USERNAME_REGEX.test(normalizedUsername)) {
    errors.username =
      "username은 영문 소문자, 숫자, 하이픈(-), 밑줄(_)만 사용해 2~30자로 입력해주세요.";
  }

  if (!trimmedDisplayName) {
    errors.displayName = "표시 이름을 입력해주세요.";
  } else if (trimmedDisplayName.length > 40) {
    errors.displayName = "표시 이름은 40자 이내로 입력해주세요.";
  }

  if (trimmedBio.length > 200) {
    errors.bio = "소개글은 200자 이내로 입력해주세요.";
  }

  if (!trimmedRole) {
    errors.role = "역할(Role)을 입력해주세요.";
  } else if (trimmedRole.length > 24) {
    errors.role = "역할(Role)은 24자 이내로 입력해주세요.";
  }

  if (!trimmedFocus) {
    errors.focus = "집중 분야(Focus)를 입력해주세요.";
  } else if (trimmedFocus.length > 24) {
    errors.focus = "집중 분야(Focus)는 24자 이내로 입력해주세요.";
  }

  if (!trimmedGrowth) {
    errors.growth = "성장률(Growth)을 입력해주세요.";
  } else {
    const parsedGrowth = Number(trimmedGrowth);
    if (!Number.isInteger(parsedGrowth) || parsedGrowth < 0 || parsedGrowth > 100) {
      errors.growth = "0~100 사이의 정수로 입력해주세요.";
    }
  }

  return errors;
}

export function getProfileDocRef(uid: string) {
  return doc(db, "users", uid, "profile", "main");
}

/**
 * 다른 사용자가 이미 해당 username을 사용 중인지 확인합니다.
 */
export async function isUsernameTaken(
  username: string,
  currentUid: string
): Promise<boolean> {
  const normalized = normalizeUsernameInput(username);
  if (!normalized) return false;

  // 1. usernames/{username} 인덱스 문서 확인
  try {
    const usernameDocSnap = await getDoc(doc(db, "usernames", normalized));
    if (usernameDocSnap.exists()) {
      const ownerUid = usernameDocSnap.data()?.uid;
      if (typeof ownerUid === "string" && ownerUid !== currentUid) {
        return true;
      }
    }
  } catch {
    // usernames 컬렉션 접근 권한이 없는 경우 collectionGroup으로 폴백
  }

  // 2. users/{userId}/profile 서브컬렉션 전체에서 중복 확인
  try {
    const profileGroupQuery = query(
      collectionGroup(db, "profile"),
      where("username", "==", normalized)
    );
    const snapshot = await getDocs(profileGroupQuery);
    const takenByOther = snapshot.docs.some((docSnap) => {
      const ownerUid = docSnap.ref.parent.parent?.id;
      return Boolean(ownerUid && ownerUid !== currentUid);
    });
    if (takenByOther) {
      return true;
    }
  } catch {
    // collectionGroup 인덱스가 아직 없는 경우 무시
  }

  return false;
}

async function reserveUsername(
  username: string,
  uid: string,
  previousUsername?: string
) {
  const normalized = normalizeUsernameInput(username);
  const prevNormalized = previousUsername
    ? normalizeUsernameInput(previousUsername)
    : "";

  try {
    await setDoc(doc(db, "usernames", normalized), {
      uid,
      updatedAt: new Date().toISOString(),
    });

    if (prevNormalized && prevNormalized !== normalized) {
      const prevRef = doc(db, "usernames", prevNormalized);
      const prevSnap = await getDoc(prevRef);
      if (prevSnap.exists() && prevSnap.data()?.uid === uid) {
        await deleteDoc(prevRef);
      }
    }
  } catch {
    // usernames 보조 인덱스 쓰기 실패 시에도 기본 프로필 저장은 유지
  }
}

/**
 * 로그인 시 users/{userId}/profile 문서를 조회하고,
 * 없으면 이메일 앞부분(username)과 구글 이름(displayName)으로 기본 프로필을 생성합니다.
 */
export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const profileRef = getProfileDocRef(user.uid);
  const snap = await getDoc(profileRef);

  const fallbackUsername = generateUsernameFromEmail(user.email, user.uid);
  const fallbackDisplayName = user.displayName?.trim() || fallbackUsername;

  if (snap.exists()) {
    const data = snap.data();
    const existingUsername =
      typeof data.username === "string" && data.username.trim()
        ? normalizeUsernameInput(data.username)
        : fallbackUsername;
    const existingDisplayName =
      typeof data.displayName === "string" && data.displayName.trim()
        ? data.displayName.trim()
        : fallbackDisplayName;
    const existingBio = typeof data.bio === "string" ? data.bio : "";
    const existingRole =
      typeof data.role === "string" && data.role.trim()
        ? data.role.trim()
        : DEFAULT_PROFILE.role;
    const existingFocus =
      typeof data.focus === "string" && data.focus.trim()
        ? data.focus.trim()
        : DEFAULT_PROFILE.focus;
    const existingGrowth = clampGrowth(data.growth, DEFAULT_PROFILE.growth);

    if (
      !data.username ||
      !data.displayName ||
      !data.role ||
      !data.focus ||
      typeof data.growth !== "number"
    ) {
      const patched: UserProfile = {
        username: existingUsername,
        displayName: existingDisplayName,
        bio: existingBio,
        role: existingRole,
        focus: existingFocus,
        growth: existingGrowth,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(profileRef, patched, { merge: true });
      await reserveUsername(existingUsername, user.uid);
      return patched;
    }

    return {
      username: existingUsername,
      displayName: existingDisplayName,
      bio: existingBio,
      role: existingRole,
      focus: existingFocus,
      growth: existingGrowth,
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    };
  }

  let initialUsername = fallbackUsername;
  const taken = await isUsernameTaken(initialUsername, user.uid);
  if (taken) {
    initialUsername = `${fallbackUsername.slice(0, 24)}-${user.uid
      .slice(0, 4)
      .toLowerCase()}`;
  }

  const initialProfile: UserProfile = {
    username: initialUsername,
    displayName: fallbackDisplayName,
    bio: "",
    role: DEFAULT_PROFILE.role,
    focus: DEFAULT_PROFILE.focus,
    growth: DEFAULT_PROFILE.growth,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(profileRef, initialProfile);
  await reserveUsername(initialUsername, user.uid);

  return initialProfile;
}

/**
 * 프로필을 users/{userId}/profile에 저장합니다.
 * 저장 전 username 중복을 검사하며 중복일 경우 에러를 throw합니다.
 */
export async function saveUserProfile(
  uid: string,
  nextValues: {
    username: string;
    displayName: string;
    bio: string;
    role: string;
    focus: string;
    growth: string;
  },
  previousUsername?: string
): Promise<UserProfile> {
  const normalizedUsername = normalizeUsernameInput(nextValues.username);
  const trimmedDisplayName = nextValues.displayName.trim();
  const trimmedBio = nextValues.bio.trim();
  const trimmedRole = nextValues.role.trim();
  const trimmedFocus = nextValues.focus.trim();
  const parsedGrowth = clampGrowth(nextValues.growth, DEFAULT_PROFILE.growth);

  if (normalizedUsername !== normalizeUsernameInput(previousUsername ?? "")) {
    const taken = await isUsernameTaken(normalizedUsername, uid);
    if (taken) {
      const error = new Error(
        "이미 사용 중인 username입니다. 다른 username을 입력해주세요."
      );
      error.name = "DuplicateUsernameError";
      throw error;
    }
  }

  const payload: UserProfile = {
    username: normalizedUsername,
    displayName: trimmedDisplayName,
    bio: trimmedBio,
    role: trimmedRole,
    focus: trimmedFocus,
    growth: parsedGrowth,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(getProfileDocRef(uid), payload, { merge: true });
  await reserveUsername(normalizedUsername, uid, previousUsername);

  return payload;
}

function parseProfileDocument(
  data: Record<string, unknown>,
  fallbackUsername: string
): UserProfile {
  const username =
    typeof data.username === "string" && data.username.trim()
      ? normalizeUsernameInput(data.username)
      : fallbackUsername;

  return {
    username,
    displayName:
      typeof data.displayName === "string" && data.displayName.trim()
        ? data.displayName.trim()
        : username,
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
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
  };
}

/**
 * Firestore에서 profile.username이 일치하는 사용자(userId 및 profile)를 찾습니다.
 */
export async function findUserByUsername(
  rawUsername: string
): Promise<{ userId: string; profile: UserProfile } | null> {
  const normalized = normalizeUsernameInput(rawUsername.replace(/^@/, ""));
  if (!normalized) return null;

  // 1. users/{userId}/profile 서브컬렉션 전체에서 username 일치 문서 조회
  try {
    const profileQuery = query(
      collectionGroup(db, "profile"),
      where("username", "==", normalized),
      limit(1)
    );
    const snapshot = await getDocs(profileQuery);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const userId = docSnap.ref.parent.parent?.id;
      if (userId) {
        return {
          userId,
          profile: parseProfileDocument(docSnap.data(), normalized),
        };
      }
    }
  } catch {
    // collectionGroup 인덱스가 없는 경우 usernames 보조 컬렉션으로 폴백
  }

  // 2. usernames/{username} 인덱스 문서 조회 후 users/{userId}/profile/main 조회
  try {
    const usernameSnap = await getDoc(doc(db, "usernames", normalized));
    if (usernameSnap.exists()) {
      const uid = usernameSnap.data()?.uid;
      if (typeof uid === "string" && uid) {
        const profileSnap = await getDoc(getProfileDocRef(uid));
        if (profileSnap.exists()) {
          return {
            userId: uid,
            profile: parseProfileDocument(profileSnap.data(), normalized),
          };
        }
      }
    }
  } catch {
    // 조회 실패 시 null 반환
  }

  return null;
}

