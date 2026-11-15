"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  AtSignIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  LayersIcon,
  Link2Icon,
  LogOutIcon,
  MousePointerClickIcon,
  SparklesIcon,
  StarIcon,
  XIcon,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const FEATURE_CARDS = [
  {
    title: "링크 관리",
    badge: "LINK HUB",
    badgeClass:
      "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/50",
    iconBgClass: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
    Icon: Link2Icon,
    description:
      "개발·디자인·문서·커뮤니티 등 카테고리별 분류와 태그, 즐겨찾기 고정까지. 흩어진 링크를 한곳에서 깔끔하게 정리하고 즉시 수정하세요.",
    highlights: ["카테고리 & 태그 분류", "즐겨찾기 상단 고정", "실시간 추가 및 인라인 편집"],
  },
  {
    title: "클릭 통계",
    badge: "ANALYTICS",
    badgeClass:
      "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/50",
    iconBgClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    Icon: BarChart3Icon,
    description:
      "방문자가 어떤 링크를 가장 많이 클릭하는지 실시간으로 집계합니다. 링크별 클릭 수와 전체 누적 통계를 한눈에 확인하세요.",
    highlights: ["링크별 실시간 클릭 집계", "전체 누적 클릭 요약", "인기 채널 인사이트"],
  },
  {
    title: "개인 URL",
    badge: "CUSTOM URL",
    badgeClass:
      "bg-sky-50 text-sky-900 ring-1 ring-inset ring-sky-200/70 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800/50",
    iconBgClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400",
    Icon: AtSignIcon,
    description:
      "나만의 고유 @username 공개 프로필 페이지를 제공합니다. 이력서, GitHub, SNS 바이오에 단 하나의 링크만 공유하면 됩니다.",
    highlights: ["고유 /@username 주소", "공개 프로필 자동 생성", "모바일·데스크톱 최적화"],
  },
] as const;

const PREVIEW_LINKS = [
  {
    title: "GitHub 오픈소스 프로젝트",
    domain: "GITHUB.COM",
    description: "진행 중인 웹 서비스와 바이브 코딩 실습 저장소를 모아둔 공간입니다.",
    category: "개발",
    categoryClass:
      "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/50",
    tags: ["#NextJS", "#TypeScript"],
    clicks: 128,
    isFavorite: true,
  },
  {
    title: "2026 UI/UX 포트폴리오",
    domain: "FIGMA.COM",
    description: "브랜드 아이덴티티와 인터랙션 프로토타입 작업물을 확인할 수 있습니다.",
    category: "디자인",
    categoryClass:
      "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/50",
    tags: ["#Figma", "#Branding"],
    clicks: 84,
    isFavorite: true,
  },
  {
    title: "바이브 코딩 개발 회고록",
    domain: "VELOG.IO",
    description: "AI와 함께 빠르게 프로덕트를 설계하고 배포하며 배운 기록들입니다.",
    category: "문서",
    categoryClass:
      "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/70 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800/50",
    tags: ["#VibeCoding", "#Retrospect"],
    clicks: 62,
    isFavorite: false,
  },
] as const;

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleStartWithGoogle() {
    if (user) {
      router.push("/dashboard");
      return;
    }
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
      router.push("/dashboard");
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

      if (code === "auth/popup-blocked") {
        setAuthError(
          "브라우저에서 로그인 팝업이 차단되었습니다. 팝업 차단을 해제한 뒤 다시 시도해주세요."
        );
      } else if (code === "auth/unauthorized-domain") {
        setAuthError(
          "현재 도메인이 승인되지 않았습니다. Firebase Console의 승인된 도메인 설정을 확인해주세요."
        );
      } else {
        console.error("Failed to sign in with Google:", error);
        setAuthError(
          code
            ? `Google 로그인 중 오류가 발생했습니다. (${code})`
            : "Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요."
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      setAuthError(null);
      await signOut(auth);
    } catch (error) {
      console.error("Failed to sign out:", error);
      setAuthError("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* 상단 고정 네비게이션 */}
      <header className="sticky top-0 z-30 h-14 border-b border-slate-200/90 bg-white/95 shadow-2xs backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full py-1 pr-2 transition-opacity hover:opacity-85"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-xs font-extrabold tracking-tight text-white shadow-xs">
              ML
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                마이링크
              </span>
              <span className="hidden text-xs font-semibold text-slate-500 sm:inline dark:text-neutral-400">
                MyLink
              </span>
            </div>
          </Link>

          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-6 text-xs font-bold text-slate-600 md:flex dark:text-neutral-300"
          >
            <a
              href="#features"
              className="transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              기능 소개
            </a>
            <a
              href="#preview"
              className="transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              화면 미리보기
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-rose-600 px-3.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-[0.98]"
                >
                  내 대시보드
                  <ArrowRightIcon className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-slate-200/90 bg-white px-3 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-rose-400"
                >
                  <LogOutIcon className="size-3.5" />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleStartWithGoogle}
                className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-rose-600 px-4 text-xs font-bold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingIn ? "로그인 중..." : "시작하기"}
                <ArrowRightIcon className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {authError && (
          <div className="sticky top-16 z-40 mx-auto max-w-6xl px-4 pt-3 sm:px-6 lg:px-8">
            <div
              role="alert"
              className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/95 px-4 py-3 text-xs font-medium text-rose-700 shadow-md backdrop-blur-xs dark:border-rose-900/60 dark:bg-rose-950/95 dark:text-rose-300"
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
          </div>
        )}

        {/* 1. 히어로 섹션 */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-white py-16 sm:py-24 lg:py-28 dark:border-neutral-800/80 dark:bg-neutral-900/40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-72 max-w-3xl rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-500/15"
          />

          <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/80 px-3.5 py-1 text-xs font-bold text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/60 dark:text-rose-300">
              <SparklesIcon className="size-3.5" />
              <span>한양대학교 바이브 코딩 · 나만의 링크 허브</span>
            </div>

            <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl sm:leading-[1.15] dark:text-white">
              <span className="text-rose-600 dark:text-rose-400">마이링크</span>로
              <br className="sm:hidden" /> 흩어진 모든 링크를
              <br />
              하나의 페이지에.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-neutral-300">
              GitHub, 포트폴리오, 블로그, SNS까지 여기저기 흩어진 내 링크를 한곳에
              모아보세요. 실시간 클릭 통계와 나만의 개인 URL로 누구나 30초 만에
              깔끔한 프로필 페이지를 만들 수 있습니다.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleStartWithGoogle}
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 px-7 text-sm font-bold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {user ? (
                  <>
                    내 대시보드로 이동
                    <ArrowRightIcon className="size-4" />
                  </>
                ) : isLoggingIn ? (
                  "Google 로그인 중..."
                ) : (
                  <>
                    무료로 시작하기
                    <ArrowRightIcon className="size-4" />
                  </>
                )}
              </button>

              <a
                href="#preview"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-white px-7 text-sm font-bold text-neutral-800 shadow-2xs transition-colors hover:bg-slate-50 sm:w-auto dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                화면 미리보기
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Google 계정으로 3초 시작
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                실시간 클릭 통계 제공
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                나만의 @username URL
              </span>
            </div>
          </div>
        </section>

        {/* 2. 기능 소개 섹션 (3개 기능 카드) */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/70 px-3 py-1 text-[11px] font-bold tracking-wider text-slate-700 uppercase dark:bg-neutral-800 dark:text-neutral-300">
              <LayersIcon className="size-3" />
              CORE FEATURES
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
              링크 공유에 꼭 필요한 세 가지 기능
            </h2>
            <p className="mt-2.5 text-sm text-slate-600 sm:text-base dark:text-neutral-400">
              복잡한 설정 없이, 링크를 모으고 성과를 확인하고 공유하는 데 집중했습니다.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.Icon;
              return (
                <article
                  key={feature.title}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBgClass}`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${feature.badgeClass}`}
                      >
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-neutral-800">
                    {feature.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-neutral-300"
                      >
                        <CheckCircle2Icon className="size-3.5 shrink-0 text-rose-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. 미리보기 섹션 (예시 화면 목업 + CTA) */}
        <section
          id="preview"
          className="border-t border-slate-200/80 bg-white py-16 sm:py-20 dark:border-neutral-800/80 dark:bg-neutral-900/40"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold tracking-wider text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/50">
                LIVE PREVIEW
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                내 링크 페이지, 이렇게 보여집니다
              </h2>
              <p className="mt-2.5 text-sm text-slate-600 sm:text-base dark:text-neutral-400">
                모바일과 데스크톱 어디서 열어도 깔끔하게 정돈된 프로필과 링크 카드를
                확인해보세요.
              </p>
            </div>

            {/* 브라우저 목업 프레임 */}
            <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
              {/* 브라우저 상단 바 */}
              <div className="flex items-center justify-between border-b border-slate-200/90 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-100/80 px-3.5 py-1 text-[11px] font-medium text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>mylink.app/@jihoo</span>
                </div>

                <span className="hidden text-[11px] font-semibold text-slate-400 sm:inline dark:text-neutral-500">
                  공개 프로필 예시
                </span>
              </div>

              {/* 목업 내부 콘텐츠 */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
                  {/* 좌측 목업 프로필 카드 */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="relative h-28 w-full bg-slate-200 dark:bg-neutral-800">
                      <Image
                        src="/images/banner.jpg"
                        alt="프로필 배너 미리보기"
                        fill
                        sizes="(max-width: 1024px) 100vw, 420px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                      <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 shadow-xs backdrop-blur-xs dark:bg-neutral-900/90 dark:text-rose-300">
                        ACTIVE 2026
                      </span>
                    </div>

                    <div className="px-5 pb-5">
                      <div className="-mt-8 flex items-end justify-between">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-sm dark:border-neutral-900 dark:bg-neutral-800">
                          <Image
                            src="/images/avatar.jpg"
                            alt="김지후 아바타 미리보기"
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/50">
                          총 클릭 274회
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-extrabold text-neutral-900 dark:text-white">
                            김지후
                          </p>
                          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                            @jihoo
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-neutral-400">
                          시각미디어디자인과 재학생 · 바이브 코딩으로 아이디어를 빠르게
                          구현하고 있습니다.
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/50">
                          Vibe Coding
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/50">
                          Next.js &amp; React
                        </span>
                        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-900 ring-1 ring-inset ring-sky-200/70 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800/50">
                          Figma &amp; UI/UX
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 우측 목업 링크 리스트 */}
                  <div className="flex flex-col gap-3 lg:col-span-7">
                    {PREVIEW_LINKS.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-colors hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.categoryClass}`}
                              >
                                {item.category}
                              </span>
                              <span className="text-[11px] font-semibold tracking-wide text-slate-400 dark:text-neutral-500">
                                {item.domain}
                              </span>
                              {item.isFavorite && (
                                <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
                              )}
                            </div>

                            <h3 className="mt-2 truncate text-sm font-bold text-neutral-900 dark:text-white">
                              {item.title}
                            </h3>
                            <p className="mt-1 line-clamp-1 text-xs text-slate-600 dark:text-neutral-400">
                              {item.description}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 tabular-nums dark:bg-neutral-800 dark:text-neutral-200">
                              <MousePointerClickIcon className="size-3 text-rose-500" />
                              {item.clicks} 클릭
                            </span>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/80 text-slate-400 dark:border-neutral-700 dark:text-neutral-500">
                              <ExternalLinkIcon className="size-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 미리보기 하단 CTA */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleStartWithGoogle}
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 px-8 text-sm font-bold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {user
                  ? "내 대시보드에서 꾸미기"
                  : isLoggingIn
                    ? "로그인 중..."
                    : "지금 바로 내 페이지 만들기"}
                <ArrowRightIcon className="size-4" />
              </button>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                가입 없이 Google 계정으로 바로 시작할 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 4. 푸터 */}
      <footer className="border-t border-slate-200/90 bg-white py-8 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600 text-[10px] font-extrabold text-white">
                ML
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                마이링크 (MyLink)
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
              한양대학교 바이브 코딩
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/wlgn2502351/my-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub
            </a>
            <span className="text-xs text-slate-400 dark:text-neutral-500">
              © 2026 MyLink
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
