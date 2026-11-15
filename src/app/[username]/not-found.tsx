import Link from "next/link";
import { ArrowLeftIcon, UserXIcon } from "lucide-react";

export default function UsernameNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-800/50">
          <UserXIcon className="size-6" />
        </div>

        <p className="mt-4 text-xs font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
          404 · PROFILE NOT FOUND
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          사용자를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 break-keep dark:text-neutral-400">
          입력하신 username에 해당하는 프로필이 존재하지 않거나 주소가 변경되었을 수 있습니다.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-bold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-[0.98]"
          >
            <ArrowLeftIcon className="size-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
