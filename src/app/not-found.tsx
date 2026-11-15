"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicProfileClient } from "@/app/[username]/PublicProfileClient";

const BASE_PATH = "/my-link";
const RESERVED_SEGMENTS = new Set(["dashboard", "404", "index.html"]);

export default function NotFound() {
  const [resolvedUsername, setResolvedUsername] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    const stripped = pathname.startsWith(BASE_PATH)
      ? pathname.slice(BASE_PATH.length)
      : pathname;
    const segments = stripped.split("/").filter(Boolean);

    if (segments.length === 1) {
      const candidate = decodeURIComponent(segments[0]).replace(/\.html$/, "");
      if (candidate && !RESERVED_SEGMENTS.has(candidate.toLowerCase())) {
        setResolvedUsername(candidate);
      }
    }
    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-neutral-950" />
    );
  }

  if (resolvedUsername) {
    return <PublicProfileClient username={resolvedUsername} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="max-w-md rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
          404 NOT FOUND
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
          요청하신 주소가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-rose-600 px-6 text-xs font-bold text-white shadow-xs transition-colors hover:bg-rose-700"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
