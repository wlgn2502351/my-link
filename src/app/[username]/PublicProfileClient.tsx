"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, AtSignIcon } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { findUserByUsername, type UserProfile } from "@/lib/profile";
import {
  categoryToneMap,
  formatDate,
  formatDomain,
  incrementLinkClickCount,
  mapDocsToLinks,
  pillStyles,
  type LinkItem,
} from "@/lib/links";

interface PublicProfileClientProps {
  username: string;
}

export function PublicProfileClient({ username }: PublicProfileClientProps) {
  const [ownerUserId, setOwnerUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadPublicProfile() {
      setIsLoading(true);
      setIsNotFound(false);

      try {
        const result = await findUserByUsername(username);
        if (isCancelled) return;

        if (!result) {
          setIsNotFound(true);
          setIsLoading(false);
          return;
        }

        setOwnerUserId(result.userId);
        setProfile(result.profile);

        const linksRef = collection(db, "users", result.userId, "links");
        const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
        const linksSnapshot = await getDocs(linksQuery);

        if (isCancelled) return;
        setLinks(mapDocsToLinks(linksSnapshot.docs));
      } catch (error) {
        console.error("Failed to load public profile:", error);
        if (!isCancelled) {
          setIsNotFound(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPublicProfile();

    return () => {
      isCancelled = true;
    };
  }, [username]);

  if (isNotFound) {
    notFound();
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <header className="sticky top-0 z-30 h-14 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 lg:px-8">
            <div className="h-8 w-44 animate-pulse rounded-full bg-slate-200 dark:bg-neutral-800" />
            <div className="h-8 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-neutral-800" />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:pt-8 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="h-[460px] animate-pulse rounded-2xl border border-slate-200/90 bg-white lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-900" />
            <div className="h-[460px] animate-pulse rounded-2xl border border-slate-200/90 bg-white lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-900" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* 상단 고정 Topbar */}
      <header className="sticky top-0 z-30 h-14 border-b border-slate-200/90 bg-white/95 shadow-2xs backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 lg:px-8">
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

          <Link
            href="/dashboard"
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 text-xs font-bold text-neutral-900 shadow-2xs transition-colors hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            <ArrowLeftIcon className="size-3.5" />
            마이페이지로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:pt-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* 좌측 (5컬럼): 프로필 정보 카드 */}
          <section className="flex flex-col gap-4 lg:sticky lg:top-22 lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-3 dark:border-neutral-800">
                <span className="text-xs font-medium text-slate-600 dark:text-neutral-300">
                  크리에이터 프로필
                </span>
                <span
                  className={`${pillStyles.red} rounded-full px-2.5 py-0.5 text-[11px] font-bold`}
                >
                  PUBLIC PROFILE
                </span>
              </div>

              <div className="relative h-40 w-full overflow-hidden bg-slate-100 sm:h-44 dark:bg-neutral-800">
                <Image
                  src="/images/banner.jpg"
                  alt="프로필 커버 이미지"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
              </div>

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
                </div>

                <div>
                  <h1 className="text-[28px] leading-snug font-bold tracking-tight text-neutral-900 sm:text-[32px] dark:text-neutral-50">
                    {profile.displayName}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                      <AtSignIcon className="size-3 text-rose-600 dark:text-rose-400" />
                      {profile.username}
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
                      등록된 소개글이 없습니다.
                    </p>
                  )}
                </div>

                {/* 요약 지표: ROLE / FOCUS / GROWTH */}
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
              </div>
            </div>
          </section>

          {/* 우측 (7컬럼): 링크 리스트 */}
          <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-8">
            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4 dark:border-neutral-800">
                <div>
                  <span className="text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-neutral-400">
                    CHANNELS &amp; ARCHIVES
                  </span>
                  <h2 className="mt-1 text-[22px] leading-snug font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    포트폴리오 및 소통 채널
                  </h2>
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-neutral-400">
                  총 {links.length}개 채널
                </span>
              </div>

              {links.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-800/30">
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    등록된 채널 링크가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {links.map((link, index) => {
                    const num = String(index + 1).padStart(2, "0");
                    const badgeTone = categoryToneMap[link.category] ?? "neutral";

                    return (
                      <div
                        key={link.id}
                        className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                      >
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
                            {num} · {formatDomain(link.url)} ·{" "}
                            {formatDate(link.createdAt)}
                          </p>

                          <h3 className="mt-1 text-lg leading-snug font-bold text-neutral-900 dark:text-neutral-50">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                if (ownerUserId) {
                                  void incrementLinkClickCount(
                                    ownerUserId,
                                    link.id
                                  );
                                }
                              }}
                              className="hover:underline"
                            >
                              {link.title}
                            </a>
                          </h3>
                          <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-neutral-500">
                            {link.url}
                          </p>

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

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (ownerUserId) {
                              void incrementLinkClickCount(
                                ownerUserId,
                                link.id
                              );
                            }
                          }}
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
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>

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
            <span>@{profile.username}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
