import { Suspense } from "react";
import { PublicProfileClient } from "./PublicProfileClient";

interface UsernamePageProps {
  params: Promise<{ username: string }>;
}

export function generateStaticParams() {
  return [{ username: "jihoo" }];
}

async function PublicProfileLoader({ params }: UsernamePageProps) {
  const { username } = await params;
  return <PublicProfileClient username={decodeURIComponent(username)} />;
}

function PublicProfileFallback() {
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

export default function UsernamePage({ params }: UsernamePageProps) {
  return (
    <Suspense fallback={<PublicProfileFallback />}>
      <PublicProfileLoader params={params} />
    </Suspense>
  );
}
