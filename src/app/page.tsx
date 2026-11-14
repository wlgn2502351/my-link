import Image from "next/image";

const skills = [
  { name: "Visual Design", category: "Design" },
  { name: "Branding & Media", category: "Design" },
  { name: "Figma & UI/UX", category: "Tool" },
  { name: "Vibe Coding", category: "Dev" },
  { name: "Next.js & React", category: "Dev" },
  { name: "Tailwind CSS", category: "Dev" },
];

const links = [
  {
    title: "Behance 포트폴리오",
    subtitle: "시각미디어디자인 작업물 아카이브",
    href: "#behance",
    badge: "Portfolio",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Instagram",
    subtitle: "일상 기록과 비주얼 영감 노트",
    href: "#instagram",
    badge: "Social",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect width="18" height="18" x="3" y="3" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "GitHub",
    subtitle: "바이브 코딩으로 만들어보는 웹 프로젝트",
    href: "#github",
    badge: "Code",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "이메일 문의하기",
    subtitle: "협업 제안 및 디자인·개발 이야기 나누기",
    href: "mailto:hello@example.com",
    badge: "Contact",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-900 selection:bg-indigo-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
      {/* 배경 그라데이션 장식 요소 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-indigo-300 via-purple-300 to-pink-300 opacity-35 sm:left-[calc(50%-30rem)] sm:w-288.75 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 dark:opacity-25" />
      </div>

      <main className="mx-auto flex max-w-5xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        {/* 반응형 그리드: 모바일 1열, 데스크톱 12컬럼 벤토 레이아웃 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* 좌측: 메인 프로필 카드 */}
          <section className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-zinc-900/5 backdrop-blur-xl lg:col-span-5 dark:border-zinc-800/80 dark:bg-zinc-900/90">
            {/* 상단 커버 배너 이미지 */}
            <div className="relative h-36 w-full overflow-hidden sm:h-44">
              <Image
                src="/images/banner.jpg"
                alt="시각미디어디자인 추상 그래픽 커버 이미지"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute top-3.5 right-3.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-zinc-800 shadow-sm backdrop-blur-md dark:bg-zinc-900/85 dark:text-zinc-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  바이브 코딩 학습 중
                </span>
              </div>
            </div>

            {/* 프로필 아바타 및 기본 정보 */}
            <div className="relative px-6 pt-0 pb-8 text-center sm:px-8">
              <div className="-mt-14 mb-4 inline-flex rounded-full bg-white p-1.5 shadow-lg dark:bg-zinc-900">
                <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-indigo-500/20 sm:h-32 sm:w-32">
                  <Image
                    src="/images/avatar.jpg"
                    alt="김지후 프로필 이미지"
                    fill
                    priority
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* 소속 뱃지 */}
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300">
                  시각미디어디자인과
                </span>
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  Creator &amp; Student
                </span>
              </div>

              {/* 이름 */}
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                김지후
              </h1>
              <p className="mt-1 text-sm font-medium text-zinc-400 dark:text-zinc-500">
                @jihoo.design · Visual Media Design
              </p>

              {/* 소개글 */}
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 break-keep sm:text-base dark:text-zinc-300">
                안녕하세요! 시각미디어디자인과 재학생 <strong>김지후</strong>입니다.
                감각적인 비주얼 디자인에 <strong>바이브 코딩</strong>을 더해,
                상상을 실제로 동작하는 웹 경험으로 구현하는 법을 배우고 있습니다.
              </p>

              {/* 미니 스탯 / 요약 */}
              <div className="mt-6 grid grid-cols-3 divide-x divide-zinc-200/70 rounded-2xl bg-zinc-50/80 py-3.5 dark:divide-zinc-800 dark:bg-zinc-800/50">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">전공</p>
                  <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">시각디자인</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">관심사</p>
                  <p className="mt-0.5 text-sm font-bold text-indigo-600 dark:text-indigo-400">Vibe Coding</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">상태</p>
                  <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">성장 중 🌱</p>
                </div>
              </div>
            </div>
          </section>

          {/* 우측: 비주얼 아트워크, 스킬 태그 및 링크 모음 */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* 상단 카드: 비주얼 쇼케이스 & 스킬 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* 비주얼 아트워크 쇼케이스 카드 */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-lg shadow-zinc-900/5 sm:p-6 dark:border-zinc-800/80 dark:bg-zinc-900">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Visual Showcase
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      2026 Artwork
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Glass &amp; Motion Study
                  </h2>
                </div>

                <div className="relative mt-4 aspect-16/10 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src="/images/banner.jpg"
                    alt="3D 글래스모피즘 비주얼 아트워크"
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-zinc-500 break-keep dark:text-zinc-400">
                  빛의 굴절과 파스텔 톤 그라데이션을 활용한 디지털 미디어 아트워크 스터디
                </p>
              </div>

              {/* 스킬 & 키워드 카드 */}
              <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-lg shadow-zinc-900/5 sm:p-6 dark:border-zinc-800/80 dark:bg-zinc-900">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Skills &amp; Keywords
                  </span>
                  <h2 className="mt-1.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                    디자인과 코딩의 연결
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 break-keep dark:text-zinc-400">
                    시각적 완성도와 인터랙티브 웹 기술을 함께 탐구합니다.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-flex items-center rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700 dark:border-zinc-800 dark:bg-zinc-800/70 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3.5 dark:from-indigo-500/15 dark:via-purple-500/15 dark:to-pink-500/15">
                  <p className="text-xs font-medium text-zinc-700 break-keep dark:text-zinc-200">
                    💡 <strong>Current Goal:</strong> 나만의 인터랙티브 디자인 포트폴리오 웹사이트 완성하기
                  </p>
                </div>
              </div>
            </div>

            {/* 하단: 링크 리스트 섹션 */}
            <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-5 shadow-lg shadow-zinc-900/5 backdrop-blur-xl sm:p-6 dark:border-zinc-800/80 dark:bg-zinc-900/90">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Links &amp; Channels
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    작업물과 소식을 확인할 수 있는 공간입니다
                  </p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {links.length}개의 링크
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {links.map((link) => (
                  <a
                    key={link.title}
                    href={link.href}
                    className="group flex items-center justify-between rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:border-indigo-700/80 dark:hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-xs ring-1 ring-zinc-200/70 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 dark:bg-zinc-900 dark:text-indigo-400 dark:ring-zinc-700">
                        {link.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {link.title}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {link.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="ml-2 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mt-10 text-center text-xs text-zinc-400 dark:text-zinc-500">
          © 2026 김지후 (Kim Ji-hoo). Built with Next.js &amp; Tailwind CSS.
        </footer>
      </main>
    </div>
  );
}
