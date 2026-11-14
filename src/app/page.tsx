export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <main className="flex w-full max-w-md flex-col items-center rounded-2xl border border-zinc-200/80 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
        {/* 프로필 아바타 */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-2xl font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          지후
        </div>

        {/* 이름 */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          김지후
        </h1>

        {/* 소속 뱃지 */}
        <span className="mb-5 rounded-full bg-zinc-100 px-3.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          한양여대 시각미디어디자인과
        </span>

        {/* 소개글 */}
        <p className="leading-relaxed text-zinc-600 break-keep dark:text-zinc-400">
          안녕하세요! 한양여대 시각미디어디자인과 재학생 김지후 입니다. 지금은 바이브 코딩을 배우는 중입니다.
        </p>
      </main>
    </div>
  );
}
