"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { PlusIcon } from "lucide-react";
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
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  favicon: string;
  isFavorite: boolean;
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

const initialLinks: LinkItem[] = [
  {
    id: 1,
    title: "GitHub",
    url: "https://github.com",
    description: "소프트웨어 개발 및 버전 관리를 위한 코드 호스팅 플랫폼",
    category: "개발",
    tags: ["git", "code", "opensource"],
    favicon: "https://github.com/favicon.ico",
    isFavorite: true,
    createdAt: "2026-11-01T09:00:00Z",
  },
  {
    id: 2,
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/ko/",
    description: "HTML, CSS, JavaScript 등 웹 표준 기술 공식 레퍼런스 문서",
    category: "문서",
    tags: ["web", "frontend", "reference"],
    favicon: "https://developer.mozilla.org/favicon-48x48.png",
    isFavorite: true,
    createdAt: "2026-11-03T14:20:00Z",
  },
  {
    id: 3,
    title: "Figma",
    url: "https://www.figma.com",
    description: "실시간 협업을 지원하는 웹 기반 UI/UX 디자인 및 프로토타이핑 툴",
    category: "디자인",
    tags: ["ui", "ux", "design", "prototype"],
    favicon: "https://static.figma.com/app/icon/1/favicon.png",
    isFavorite: false,
    createdAt: "2026-11-05T11:15:00Z",
  },
  {
    id: 4,
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "전 세계 개발자들의 프로그래밍 질의응답 커뮤니티",
    category: "커뮤니티",
    tags: ["qna", "programming", "debugging"],
    favicon: "https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico",
    isFavorite: false,
    createdAt: "2026-11-08T16:45:00Z",
  },
  {
    id: 5,
    title: "Notion",
    url: "https://www.notion.so",
    description: "메모, 문서, 프로젝트 관리 및 위키를 하나로 통합한 올인원 워크스페이스",
    category: "생산성",
    tags: ["note", "wiki", "productivity"],
    favicon: "https://www.notion.so/images/favicon.ico",
    isFavorite: true,
    createdAt: "2026-11-10T08:30:00Z",
  },
  {
    id: 6,
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "빠른 UI 구축을 위한 유틸리티 퍼스트 CSS 프레임워크",
    category: "개발",
    tags: ["css", "styling", "frontend"],
    favicon: "https://tailwindcss.com/favicons/favicon-32x32.png",
    isFavorite: false,
    createdAt: "2026-11-12T19:10:00Z",
  },
];

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

interface FormErrors {
  title?: string;
  url?: string;
  description?: string;
  tags?: string;
  favicon?: string;
}

type FormField = keyof FormErrors;

export default function ProfilePage() {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
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
  }

  function handleAddLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

    const newLink: LinkItem = {
      id: links.length > 0 ? Math.max(...links.map((item) => item.id)) + 1 : 1,
      title: trimmedTitle,
      url: normalizedUrl,
      description:
        description.trim() || `${trimmedTitle} 바로가기 링크입니다.`,
      category,
      tags: parsedTags,
      favicon: favicon.trim() || getDefaultFavicon(normalizedUrl),
      isFavorite,
      createdAt: new Date().toISOString(),
    };

    setLinks((prev) => [newLink, ...prev]);
    resetForm();
    setIsAddDialogOpen(false);
  }
  return (
    <div className="min-h-screen bg-slate-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* 상단 고정 Topbar (Sticky header + 이름 탭 및 문의하기 버튼 탭 배경 적용) */}
      <header className="sticky top-0 z-30 h-14 border-b border-slate-200/90 bg-white/95 shadow-2xs backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 lg:px-8">
          {/* 최상단 좌측: 이름 탭 (배경 적용) */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-slate-100/90 py-1 pr-3.5 pl-1.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-800/90">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white shadow-2xs">
              JH
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                김지후
              </span>
              <span className="h-3 w-px bg-slate-300 dark:bg-neutral-700" />
              <span className="text-xs font-medium text-slate-600 dark:text-neutral-400">
                Creator Profile
              </span>
            </div>
          </div>

          {/* 최상단 우측: 상태 뱃지 & 문의하기 버튼 탭 (배경 적용) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-100/90 p-1 shadow-2xs dark:border-neutral-800 dark:bg-neutral-800/90">
            <span
              className={`${pillStyles.green} hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold sm:inline-flex`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              바이브 코딩 집중 주간
            </span>
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
        {/* 12컬럼 비대칭 반응형 레이아웃 유지 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* 좌측 (5컬럼): 메인 프로필 카드 & 디자이너 노트 */}
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
                <span
                  className={`${pillStyles.red} rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
                >
                  ACTIVE 2026
                </span>
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
                      alt="김지후 프로필 아바타"
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
                    김지후{" "}
                    <span className="text-base font-medium text-slate-500 dark:text-neutral-400">
                      Kim Ji-hoo
                    </span>
                  </h1>
                </div>

                {/* 자기소개 박스 */}
                <div className="mt-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <p className="text-sm leading-relaxed font-normal text-slate-700 break-keep dark:text-neutral-300">
                    안녕하세요! 시각미디어디자인과 재학생{" "}
                    <strong className="font-bold text-neutral-900 dark:text-white">
                      김지후
                    </strong>
                    입니다. 감각적인 그래픽 디자인을 넘어, 지금은{" "}
                    <strong className="font-bold text-rose-700 dark:text-rose-400">
                      바이브 코딩(Vibe Coding)
                    </strong>
                    으로 상상을 직접 동작하는 웹 화면으로 구현하고 있어요.
                  </p>
                </div>

                {/* 대시보드형 요약 지표 (tabular-nums 적용) */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white py-3 text-center dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="px-2">
                    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
                      ROLE
                    </p>
                    <p className="mt-1 text-[15px] font-bold text-neutral-900 dark:text-neutral-50">
                      Creator
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
                      FOCUS
                    </p>
                    <p className="mt-1 text-[15px] font-bold text-rose-600 dark:text-rose-400">
                      Vibe Coding
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
                      GROWTH
                    </p>
                    <p className="mt-1 text-lg leading-tight font-bold text-neutral-900 tabular-nums dark:text-neutral-50">
                      85%
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

            {/* 좌측 하단: 디자이너 노트 카드 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-rose-700 uppercase dark:text-rose-400">
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
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                  DESIGNER NOTE
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                  Manifesto
                </span>
              </div>
              <p className="mt-2.5 text-[15px] leading-relaxed font-medium text-neutral-900 break-keep dark:text-neutral-100">
                &ldquo;좋은 디자인이 코드와 만나면, 보는 것을 넘어 사용자가 직접 경험하고 몰입할 수 있는 서비스가 됩니다.&rdquo;
              </p>
            </div>
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
                    85%
                  </span>
                </div>

                {/* Capsule Progress Bar */}
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700">
                  <div className="h-full w-[85%] rounded-full bg-rose-600 transition-all duration-500" />
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

                        <DialogFooter className="-mx-5 -mb-5 mt-1 rounded-b-2xl border-t border-slate-200/80 bg-slate-50/80 px-5 py-3.5 dark:border-neutral-800 dark:bg-neutral-900/80">
                          <DialogClose
                            render={
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-full px-4 text-xs font-bold"
                              />
                            }
                          >
                            취소
                          </DialogClose>
                          <Button
                            type="submit"
                            className="rounded-full bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700"
                          >
                            추가하기
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* 2열 반응형 카드 그리드 (동일 행 높이 유지 & 하단 메타데이터 고정) */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {links.map((link, index) => {
                  const num = String(index + 1).padStart(2, "0");
                  const badgeTone = categoryToneMap[link.category] ?? "neutral";

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:ring-4 focus-visible:ring-blue-600/25 focus-visible:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                    >
                      {/* 상단: 아이콘 + 뱃지 + 타이틀/설명/태그 */}
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
                          </div>
                        </div>

                        <p className="mt-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase tabular-nums dark:text-neutral-400">
                          {num} · {formatDomain(link.url)} · {formatDate(link.createdAt)}
                        </p>
                        <h3 className="mt-1 text-lg leading-snug font-bold text-neutral-900 dark:text-neutral-50">
                          {link.title}
                        </h3>
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

                      {/* 하단 고정 메타데이터 푸터 */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-neutral-800">
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
                      </div>
                    </a>
                  );
                })}
              </div>
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
              © 2026 김지후 (Kim Ji-hoo). All rights reserved.
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
