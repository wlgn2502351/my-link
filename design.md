---
name: shadcn/ui
slug: shadcn-ui
category: design-system
logo: https://ui.shadcn.com/favicon.ico
last_updated: "2026-11-14"
created_at: "2026-11-14"
lang: ko
colors:
  ## Role layer — shadcn/ui semantic tokens (light = :root, dark- = .dark)
  background: "{colors.white}"
  foreground: "{colors.neutral-950}"
  card: "{colors.white}"
  card-foreground: "{colors.neutral-950}"
  popover: "{colors.white}"
  popover-foreground: "{colors.neutral-950}"
  primary: "{colors.neutral-900}"
  primary-foreground: "{colors.neutral-50}"
  secondary: "{colors.neutral-100}"
  secondary-foreground: "{colors.neutral-900}"
  muted: "{colors.neutral-100}"
  muted-foreground: "{colors.neutral-500}"
  accent: "{colors.neutral-100}"
  accent-foreground: "{colors.neutral-900}"
  destructive: "{colors.red-600}"
  destructive-foreground: "{colors.neutral-50}"
  border: "{colors.neutral-200}"
  input: "{colors.neutral-200}"
  ring: "{colors.neutral-400}"
  chart-1: "{colors.neutral-300}"
  chart-2: "{colors.neutral-500}"
  chart-3: "{colors.neutral-600}"
  chart-4: "{colors.neutral-700}"
  chart-5: "{colors.neutral-800}"
  sidebar: "{colors.neutral-50}"
  sidebar-foreground: "{colors.neutral-950}"
  sidebar-primary: "{colors.neutral-900}"
  sidebar-primary-foreground: "{colors.neutral-50}"
  sidebar-accent: "{colors.neutral-100}"
  sidebar-accent-foreground: "{colors.neutral-900}"
  sidebar-border: "{colors.neutral-200}"
  sidebar-ring: "{colors.neutral-400}"
  dark-background: "{colors.neutral-950}"
  dark-foreground: "{colors.neutral-50}"
  dark-card: "{colors.neutral-900}"
  dark-card-foreground: "{colors.neutral-50}"
  dark-popover: "{colors.neutral-900}"
  dark-popover-foreground: "{colors.neutral-50}"
  dark-primary: "{colors.neutral-200}"
  dark-primary-foreground: "{colors.neutral-900}"
  dark-secondary: "{colors.neutral-800}"
  dark-secondary-foreground: "{colors.neutral-50}"
  dark-muted: "{colors.neutral-800}"
  dark-muted-foreground: "{colors.neutral-400}"
  dark-accent: "{colors.neutral-800}"
  dark-accent-foreground: "{colors.neutral-50}"
  dark-destructive: "{colors.red-400}"
  dark-destructive-foreground: "{colors.neutral-50}"
  dark-border: oklch(1 0 0 / 0.10)
  dark-input: oklch(1 0 0 / 0.15)
  dark-ring: "{colors.neutral-500}"
  dark-sidebar: "{colors.neutral-900}"
  dark-sidebar-foreground: "{colors.neutral-50}"
  dark-sidebar-primary: "{colors.blue-600}"
  dark-sidebar-primary-foreground: "{colors.neutral-50}"
  dark-sidebar-accent: "{colors.neutral-800}"
  dark-sidebar-accent-foreground: "{colors.neutral-50}"
  dark-sidebar-border: oklch(1 0 0 / 0.10)
  dark-sidebar-ring: "{colors.neutral-500}"
  ## Primitive palette — Tailwind CSS v4 OKLCH neutral & semantic primitives
  white: oklch(1 0 0)                   # #FFFFFF — pure white
  neutral-50: oklch(0.985 0 0)          # #FAFAFA — Tailwind v4 neutral-50
  neutral-100: oklch(0.97 0 0)          # #F5F5F5 — Tailwind v4 neutral-100
  neutral-200: oklch(0.922 0 0)         # #E5E5E5 — Tailwind v4 neutral-200
  neutral-300: oklch(0.87 0 0)          # #D4D4D4 — Tailwind v4 neutral-300
  neutral-400: oklch(0.708 0 0)         # #A3A3A3 — Tailwind v4 neutral-400
  neutral-500: oklch(0.556 0 0)         # #737373 — Tailwind v4 neutral-500
  neutral-600: oklch(0.439 0 0)         # #525252 — Tailwind v4 neutral-600
  neutral-700: oklch(0.371 0 0)         # #404040 — Tailwind v4 neutral-700
  neutral-800: oklch(0.269 0 0)         # #262626 — Tailwind v4 neutral-800
  neutral-900: oklch(0.205 0 0)         # #171717 — Tailwind v4 neutral-900
  neutral-950: oklch(0.145 0 0)         # #0A0A0A — Tailwind v4 neutral-950
  red-400: oklch(0.704 0.191 22.216)    # #F87171 — dark destructive
  red-600: oklch(0.577 0.245 27.325)    # #DC2626 — light destructive
  blue-600: oklch(0.488 0.243 264.376)  # #2563EB — dark sidebar-primary
typography:
  xs:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.333
  sm:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.428
  base:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
  lg:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.555
  h4:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: -0.015em
  h3:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.333
    letterSpacing: -0.02em
  h2:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.025em
  h1:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.111
    letterSpacing: -0.025em
  display:
    fontFamily: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.03em
spacing:
  space-1: 4px
  space-1.5: 6px
  space-2: 8px
  space-2.5: 10px
  space-3: 12px
  space-4: 16px
  space-6: 24px
  space-8: 32px
  space-10: 40px
rounded:
  radius-sm: 6px     # calc(var(--radius) * 0.6) — checkboxes, small badges, compact controls
  radius-md: 8px     # calc(var(--radius) * 0.8) —xs/sm buttons, menu items, inner pills
  radius-lg: 10px    # var(--radius) (0.625rem) — default buttons, inputs, selects, tabs
  radius-xl: 14px    # calc(var(--radius) * 1.4) — cards, dialogs, popovers
  radius-4xl: 26px   # calc(var(--radius) * 2.6) — pill badges, switches, progress tracks, avatars
elevation:
  ring-hairline: 0 0 0 1px oklch(0.145 0 0 / 0.10)
  shadow-xs: 0 1px 2px 0 oklch(0 0 0 / 0.05)
  shadow-sm: 0 1px 3px 0 oklch(0 0 0 / 0.10), 0 1px 2px -1px oklch(0 0 0 / 0.10)
  shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.10), 0 2px 4px -2px oklch(0 0 0 / 0.10)
  shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.10), 0 4px 6px -4px oklch(0 0 0 / 0.10)
components:
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.radius-lg}"
  button-default-hover:
    backgroundColor: oklch(0.205 0 0 / 0.80)
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.radius-lg}"
  button-outline:
    backgroundColor: "{colors.background}"
    borderColor: "{colors.border}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.radius-lg}"
  button-outline-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.radius-lg}"
  button-ghost-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
  button-destructive:
    backgroundColor: oklch(0.577 0.245 27.325 / 0.10)
    textColor: "{colors.destructive}"
    rounded: "{rounded.radius-lg}"
  badge-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.radius-4xl}"
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.radius-4xl}"
  badge-outline:
    borderColor: "{colors.border}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.radius-4xl}"
  badge-destructive:
    backgroundColor: oklch(0.577 0.245 27.325 / 0.10)
    textColor: "{colors.destructive}"
    rounded: "{rounded.radius-4xl}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.radius-xl}"
  input:
    backgroundColor: transparent
    borderColor: "{colors.input}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.radius-lg}"
  switch-checked:
    backgroundColor: "{colors.primary}"
  switch-unchecked:
    backgroundColor: "{colors.input}"
  checkbox-checked:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.radius-sm}"
  checkbox-unchecked:
    borderColor: "{colors.input}"
    rounded: "{rounded.radius-sm}"
fonts:
  font-family-sans: "\"Pretendard Variable\", Pretendard, var(--font-geist-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
  font-family-mono: "var(--font-geist-mono), \"JetBrains Mono\", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
---

# shadcn/ui (Neutral · Base-Nova) — design.md

> `https://ui.shadcn.com/` 공식 스펙과 `shadcn@4.23` CLI의 `base-nova` 프리셋(`@base-ui/react` 헤드리스 프리미티브 + Tailwind CSS v4 `@theme inline` + OKLCH 시맨틱 컬러 토큰)을 기준으로 정의한 디자인 시스템 문서다. 모든 색상은 무채색(Chroma `0`) Neutral 팔레트와 OKLCH 색공간으로 설계되었으며, 한국어 가독성을 위해 Pretendard Variable과 Geist Sans/Mono를 결합한 타이포그래피 체계를 사용한다 [src:1][src:2][src:3].

## Brand & Style

`shadcn/ui` 디자인 시스템의 핵심 철학은 **소유 가능한 컴포넌트 아키텍처(Open Code & Composition)**와 **절제된 모노크롬 미니멀리즘(High-Contrast Neutral Minimalism)**이다. 외부 패키지 안에 스타일이 숨겨진 블랙박스 UI 라이브러리와 달리, 모든 컴포넌트가 프로젝트 내부([`src/components/ui/`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui))에 소스 코드 형태로 존재하며 CSS 변수와 유틸리티 클래스로 일관되게 제어된다.

시각 언어의 중심은 **고대비 무채색(`primary` = `neutral-900` / 다크 `neutral-200`) + 정교한 1px 보더(`border` / `ring-foreground/10`) + 반투명 포커스 링(`ring/50`)**이다. 브랜드 컬러를 남용해 화면 전체를 채색하는 대신, 배경(`background`), 카드(`card`), 보조 표면(`muted`, `secondary`)의 미세한 명도 차이와 1px 헤어라인으로 정보 위계를 구축한다. 색채(Chroma > 0)는 파괴적 행동·오류 상태(`destructive`)나 데이터 시각화·상태 배지 등 의미 전달이 필수적인 지점에만 제한적으로 사용한다.

제품 카피와 인터페이스는 군더더기 없는 명확함(Clarity)을 지향한다. 한국어 환경에서는 `해요/합니다` 체의 친근하고 정돈된 문장을 본문과 안내문에 사용하고, 버튼과 배지에는 `저장하기`, `편집`, `채널 추가`, `문의하기`처럼 직관적인 명사·동사 라벨을 배치한다.

## Colors

> **Tailwind CSS v4 & OKLCH 시맨틱 아키텍처.** 본 시스템은 RGB/HSL 대신 지각적 균일성(Perceptual Uniformity)을 보장하는 **OKLCH 색공간**을 사용한다. Neutral 테마의 모든 기본 단계는 채도(Chroma)와 색상각(Hue)이 `0`인 순수 무채색(`oklch(L 0 0)`)으로 정의되어, 라이트 모드와 다크 모드 어디에서도 색조 치우침 없이 깨끗한 대비를 유지한다.
>
> **Background / Foreground 쌍 규칙.** `shadcn/ui`의 모든 표면 토큰은 배경 역할을 하는 `<role>` 토큰과 그 위의 텍스트·아이콘 색상을 정의하는 `<role>-foreground` 토큰이 한 쌍으로 동작한다(예: `bg-primary text-primary-foreground`, `bg-card text-card-foreground`, `bg-muted text-muted-foreground`). 다크 모드 전환 시에는 컴포넌트의 클래스를 수정하지 않고 `.dark` 셀렉터 아래의 CSS 변수 값만 교체하여 대응한다.

### 역할 계층 (Semantic Color Tokens)

역할 이름은 [`src/app/globals.css`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/app/globals.css)의 `--<role>` 커스텀 프로퍼티이자 `@theme inline`을 통해 노출되는 `--color-<role>` 유틸리티 이름이다. 다크 모드는 다크 표면 위에서 경계선이 자연스럽게 블렌딩되도록 `border`와 `input`에 불투명도 알파(`oklch(1 0 0 / 10%)`, `oklch(1 0 0 / 15%)`)를 사용한다.

| 역할 토큰 | 라이트 (`:root`) | 다크 (`.dark`) | 주요 용도 |
| --- | --- | --- | --- |
| `background` | `oklch(1 0 0)` (`#FFFFFF`) | `oklch(0.145 0 0)` (`#0A0A0A`) | 페이지 최하단 기본 캔버스 배경 |
| `foreground` | `oklch(0.145 0 0)` (`#0A0A0A`) | `oklch(0.985 0 0)` (`#FAFAFA`) | 기본 본문 및 헤딩 텍스트, 주요 아이콘 |
| `card` | `oklch(1 0 0)` (`#FFFFFF`) | `oklch(0.205 0 0)` (`#171717`) | `Card` 컨테이너 표면 배경 |
| `card-foreground` | `oklch(0.145 0 0)` (`#0A0A0A`) | `oklch(0.985 0 0)` (`#FAFAFA`) | 카드 내부 기본 텍스트 |
| `popover` | `oklch(1 0 0)` (`#FFFFFF`) | `oklch(0.205 0 0)` (`#171717`) | `Dialog`, `Select`, `Popover`, `Tooltip` 플로팅 표면 |
| `popover-foreground` | `oklch(0.145 0 0)` (`#0A0A0A`) | `oklch(0.985 0 0)` (`#FAFAFA`) | 플로팅 메뉴 및 모달 내부 텍스트 |
| `primary` | `oklch(0.205 0 0)` (`#171717`) | `oklch(0.922 0 0)` (`#E5E5E5`) | 주요 CTA 버튼(`default`), 활성 스위치·체크박스·진행률 바 |
| `primary-foreground` | `oklch(0.985 0 0)` (`#FAFAFA`) | `oklch(0.205 0 0)` (`#171717`) | `primary` 표면 위의 반전 텍스트 및 아이콘 |
| `secondary` | `oklch(0.97 0 0)` (`#F5F5F5`) | `oklch(0.269 0 0)` (`#262626`) | 보조 버튼(`secondary`), 보조 배지, 태그 배경 |
| `secondary-foreground` | `oklch(0.205 0 0)` (`#171717`) | `oklch(0.985 0 0)` (`#FAFAFA`) | `secondary` 표면 위의 텍스트 |
| `muted` | `oklch(0.97 0 0)` (`#F5F5F5`) | `oklch(0.269 0 0)` (`#262626`) | 비활성 영역, `TabsList` 트랙, `CardFooter` 배경(`bg-muted/50`), 스켈레톤 |
| `muted-foreground` | `oklch(0.556 0 0)` (`#737373`) | `oklch(0.708 0 0)` (`#A3A3A3`) | 보조 설명(`CardDescription`), 캡션, 플레이스홀더, 메타데이터 |
| `accent` | `oklch(0.97 0 0)` (`#F5F5F5`) | `oklch(0.269 0 0)` (`#262626`) | 드롭다운·셀렉트·메뉴 아이템의 호버/포커스 하이라이트 표면 |
| `accent-foreground` | `oklch(0.205 0 0)` (`#171717`) | `oklch(0.985 0 0)` (`#FAFAFA`) | 호버/포커스된 아이템의 텍스트 |
| `destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | 삭제·위험 행동 버튼, `aria-invalid` 오류 보더 및 경고 텍스트 |
| `destructive-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` | 솔리드 destructive 표면 위의 텍스트 |
| `border` | `oklch(0.922 0 0)` (`#E5E5E5`) | `oklch(1 0 0 / 10%)` | 기본 구분선(`Separator`), 아웃라인 버튼, 레이아웃 경계선 |
| `input` | `oklch(0.922 0 0)` (`#E5E5E5`) | `oklch(1 0 0 / 15%)` | `Input`, `Textarea`, `SelectTrigger`, 비활성 `Switch`/`Checkbox` 보더·트랙 |
| `ring` | `oklch(0.708 0 0)` (`#A3A3A3`) | `oklch(0.556 0 0)` (`#737373`) | 키보드 포커스 링(`focus-visible:ring-ring/50`) 및 포커스 보더 |
| `chart-1` ~ `chart-5` | `oklch(0.87 0 0)` → `oklch(0.269 0 0)` | `oklch(0.87 0 0)` → `oklch(0.269 0 0)` | 차트 및 프로그레스/지표 시각화 단계별 무채색 램프 |

## Typography

기본 서체는 한글·영문 혼용 환경에 최적화된 **Pretendard Variable**을 최우선으로 두고, 영문·숫자 보조 폴백으로 **Geist Sans**를 연결한다(`--font-sans: var(--font-pretendard)`). 코드, 단축키, 인덱스 번호(`01`, `02`), 정량 지표에는 **Geist Mono**와 **JetBrains Mono**로 구성된 `--font-mono` 스택을 사용한다.

`base-nova` 프리셋은 고밀도 모던 웹 애플리케이션에 맞춰 기본 컨트롤 및 카드 본문 크기를 `14px`(`text-sm`)로 설정한다. 작은 배지·캡션은 `12px`(`text-xs`)를 사용하고, 모바일 입력창(`Input`, `Textarea`)은 iOS 자동 줌 방지를 위해 기본 `16px`(`text-base`)에서 데스크톱 `14px`(`md:text-sm`)로 반응형 전환한다.

퍼센트 수치(`85%`), 순서 번호(`01`), 통계 카운트 등 숫자가 변화하거나 나열되는 모든 요소에는 `tabular-nums`(`font-variant-numeric: tabular-nums`)를 적용해 자릿수 흔들림을 방지한다.

## Spacing

Tailwind CSS v4의 `4px`(`0.25rem`) 기본 그리드(`--spacing(N)`)를 따른다.
- **컨트롤 내부 밀도 (`base-nova`)**: 기본 버튼과 인풋 높이는 `32px`(`h-8`), 작은 컨트롤은 `24px~28px`(`h-6`~`h-7`), 큰 컨트롤은 `36px`(`h-9`)로 컴팩트한 밀도를 유지한다.
- **카드 내부 간격**: 카드는 CSS 변수 `[--card-spacing:--spacing(4)]`(`16px`)를 통해 상하좌우 패딩과 섹션 간 간격(`gap-4`)을 일관되게 제어하며, `size="sm"` 카드에서는 `--spacing(3)`(`12px`)으로 축소된다.
- **레이아웃 거터**: 모바일 화면 좌우 여백은 `16px`(`px-4`), 태블릿/데스크톱 컨테이너 여백은 `24px~32px`(`sm:px-6 lg:px-8`)을 기준으로 한다.

## Rounded

단일 기준 변수 `--radius: 0.625rem`(`10px`)에서 상대 배율로 계산되는 7단계 곡률 체계를 사용한다:
- `rounded-sm` (`calc(var(--radius) * 0.6)` = `6px`): `Checkbox`([`checkbox.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/checkbox.tsx)), 소형 툴팁 및 내부 인디케이터
- `rounded-md` (`calc(var(--radius) * 0.8)` = `8px`): 소형 버튼(`size="xs"`, `size="sm"`), 드롭다운 메뉴 아이템, 탭 트리거
- `rounded-lg` (`var(--radius)` = `10px`): 기본 `Button`, `Input`, `Textarea`, `SelectTrigger`, `TabsList`
- `rounded-xl` (`calc(var(--radius) * 1.4)` = `14px`): `Card` 컨테이너, `Dialog` 모달, `Popover` 표면
- `rounded-4xl` (`calc(var(--radius) * 2.6)` = `26px`) 및 `rounded-full`: `Badge`, `Switch`, `Progress` 트랙, `Avatar` 원형 프레임

## Elevation & Depth

시스템은 **무그림자 평면 구조(Flat & Hairline Ring)**를 기본으로 한다.
- **카드 및 컨테이너**: 무거운 드롭 섀도우 대신 `ring-1 ring-foreground/10` 또는 `1px border-border`로 표면 경계를 선명하게 구획한다.
- **포커스 및 유효성 피드백**: 키보드 포커스 시 외곽에 `3px` 두께의 반투명 링(`focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`)을 렌더링한다. 오류 상태(`aria-invalid="true"`)에서는 입력창 배경을 붉게 칠하지 않고 `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`으로 정제된 피드백을 제공한다.
- **플로팅 표면**: `Dialog`, `SelectContent`, `TooltipContent` 등 화면 위에 떠 있는 레이어에만 `shadow-md`~`shadow-lg`와 `ring-1 ring-foreground/10`을 결합해 깊이감을 부여한다.

## Shapes

Shape language는 **Nested Concentric Geometry(동심원 비례 곡률)**를 따른다. 외곽 컨테이너인 `Card`가 `rounded-xl`(`14px`)을 사용할 때, 내부에 배치되는 `Button`, `Input`, `TabsList`는 한 단계 작은 `rounded-lg`(`10px`)를 사용하여 모서리 곡률이 자연스럽게 맞물리도록 설계한다. 반면 상태 표시나 토글을 담당하는 `Badge`, `Switch`, `Avatar`, `Progress`는 완전한 캡슐형(`rounded-4xl` / `rounded-full`)으로 대비시켜 조작 및 상태 요소를 즉각 구분한다.

아이콘은 `lucide-react` 패키지의 선형 아이콘을 표준으로 사용하며, 버튼과 배지 내부에서는 `[&_svg:not([class*='size-'])]:size-4`(`16px`) 또는 `size-3`~`size-3.5`(`12px~14px`)로 자동 스케일링된다.

## Components

모든 기본 컴포넌트는 [`src/components/ui/`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui)에 위치하며, `@base-ui/react` 프리미티브와 `class-variance-authority`(`cva`), `cn` 유틸리티를 결합한 `base-nova` 아키텍처를 따른다. 각 요소는 `data-slot="<component-part>"` 속성을 노출하여 부모·형제 상태에 따른 정교한 스타일 조합(`has-data-[slot=...]`, `group-data-[...]/card`)을 지원한다.

### 패키지 컴포넌트 토큰 매핑

| 컴포넌트 / 슬롯 | 라이트 스타일 | 다크 스타일 (`.dark`) |
| --- | --- | --- |
| `Button (default)` | `bg-primary text-primary-foreground hover:bg-primary/80` | `bg-primary text-primary-foreground hover:bg-primary/80` |
| `Button (secondary)` | `bg-secondary text-secondary-foreground` | `bg-secondary text-secondary-foreground` |
| `Button (outline)` | `border-border bg-background hover:bg-muted` | `border-input bg-input/30 hover:bg-input/50` |
| `Button (ghost)` | `hover:bg-muted hover:text-foreground` | `hover:bg-muted/50 hover:text-foreground` |
| `Button (destructive)` | `bg-destructive/10 text-destructive hover:bg-destructive/20` | `bg-destructive/20 text-destructive hover:bg-destructive/30` |
| `Badge (default)` | `bg-primary text-primary-foreground rounded-4xl` | `bg-primary text-primary-foreground rounded-4xl` |
| `Badge (secondary)` | `bg-secondary text-secondary-foreground rounded-4xl` | `bg-secondary text-secondary-foreground rounded-4xl` |
| `Badge (outline)` | `border-border text-foreground rounded-4xl` | `border-border text-foreground rounded-4xl` |
| `Card` | `bg-card text-card-foreground ring-1 ring-foreground/10 rounded-xl` | `bg-card text-card-foreground ring-1 ring-foreground/10 rounded-xl` |
| `CardFooter` | `border-t bg-muted/50 rounded-b-xl` | `border-t bg-muted/50 rounded-b-xl` |
| `Input / Textarea` | `border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/50` | `border-input bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50` |
| `Switch` | 켜짐 `data-checked:bg-primary`, 꺼짐 `data-unchecked:bg-input` | 켜짐 `data-checked:bg-primary`, 꺼짐 `data-unchecked:bg-input/80` |
| `Checkbox` | 켜짐 `data-checked:bg-primary data-checked:text-primary-foreground`, 꺼짐 `border-input` | 켜짐 `data-checked:bg-primary`, 꺼짐 `border-input bg-input/30` |
| `Progress` | 트랙 `bg-muted rounded-full`, 인디케이터 `bg-primary` | 트랙 `bg-muted rounded-full`, 인디케이터 `bg-primary` |

### Button ([`src/components/ui/button.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/button.tsx))

6가지 시각 변형(`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`)과 8가지 크기(`default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`)를 제공한다. 클릭 시 미세한 눌림 피드백(`active:not-aria-[haspopup]:translate-y-px`)이 기본 내장되어 있다.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="default">저장하기</Button>
<Button variant="outline" size="sm">편집 취소</Button>
<Button variant="destructive" size="sm">삭제</Button>
```

### Badge ([`src/components/ui/badge.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/badge.tsx))

`h-5`(`20px`), `rounded-4xl` 캡슐 형태, `text-xs font-medium` 타이포그래피를 사용한다. 상태 태그, 카테고리 라벨, 스킬 칩 표현에 사용하며 `default`, `secondary`, `outline`, `destructive`, `ghost`, `link` 변형을 지원한다.

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="default">ACTIVE</Badge>
<Badge variant="secondary">Next.js & React</Badge>
<Badge variant="outline">PORTFOLIO</Badge>
```

### Card ([`src/components/ui/card.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/card.tsx))

`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`의 7개 합성 컴포넌트로 구성된다. `CardHeader` 내부에 `CardAction`을 배치하면 CSS Grid(`has-data-[slot=card-action]:grid-cols-[1fr_auto]`)가 자동으로 우측 상단에 액션 버튼이나 배지를 정렬한다. `CardFooter`가 포함되면 하단 패딩이 자동 조정되고 `bg-muted/50`과 상단 보더(`border-t`)를 가진 푸터 영역이 결합된다.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
```

### Input, Textarea & Label ([`input.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/input.tsx), [`textarea.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/textarea.tsx), [`label.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/label.tsx))

폼 컨트롤은 `rounded-lg`, `border-input` 테두리를 공유하며, 포커스 시 `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`으로 일관된 외곽 링을 그린다. 다크 모드에서는 `dark:bg-input/30` 반투명 배경으로 입력 영역을 주위 카드 표면과 자연스럽게 구분한다.

### Switch, Checkbox & Slider ([`switch.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/switch.tsx), [`checkbox.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/checkbox.tsx), [`slider.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/slider.tsx))

- **Switch**: `default`와 `sm` 크기를 지원하며, 링크 노출 ON/OFF나 테마 설정 토글에 사용한다.
- **Checkbox**: `size-4`(`16px`), `rounded-[4px]` 컨테이너에 체크 시 `bg-primary`와 체크 아이콘을 렌더링한다.
- **Slider**: 진행률(`0~100%`) 등 연속 수치 조작에 사용하며 트랙(`bg-muted`)과 채움(`bg-primary`), 원형 썸(`border-primary bg-background`)으로 구성된다.

### Avatar, Progress & Separator ([`avatar.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/avatar.tsx), [`progress.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/progress.tsx), [`separator.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/separator.tsx))

- **Avatar**: `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`를 제공하며, 이미지 로드 전이나 실패 시 이니셜 폴백(`AvatarFallback`)을 안전하게 표시한다.
- **Progress**: `Progress`, `ProgressTrack`, `ProgressIndicator`, `ProgressLabel`, `ProgressValue`로 구성되며 수치에는 `tabular-nums`가 기본 적용된다.
- **Separator**: 수평(`orientation="horizontal"`) 및 수직(`orientation="vertical"`) `1px` 구분선을 렌더링한다.

### Dialog, Select, Tabs & Tooltip ([`dialog.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/dialog.tsx), [`select.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/select.tsx), [`tabs.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/tabs.tsx), [`tooltip.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui/tooltip.tsx))

- **Dialog**: 모달 편집이나 초기화 확인 창에 사용하며 백드롭 블러/딤 처리와 키보드 트랩, 닫기 버튼을 포함한다.
- **Select**: 커스텀 팝오버 리스트와 체크 인디케이터를 제공하여 네이티브 `<select>`의 스타일 한계를 대체한다.
- **Tabs**: `default`(캡슐형 `bg-muted` 트랙)와 `line`(하단 인디케이터 보더) 두 가지 리스트 변형을 지원한다.
- **Tooltip**: 루트 레이아웃([`src/app/layout.tsx`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/app/layout.tsx))에 선언된 `TooltipProvider` 위에서 동작하며 아이콘 버튼의 보조 설명을 제공한다.

## Do's and Don'ts

### Do

- 항상 하드코딩된 색상값(`bg-neutral-900`, `text-neutral-500`) 대신 **시맨틱 토큰 유틸리티(`bg-primary text-primary-foreground`, `text-muted-foreground`, `border-border`)**를 사용하여 라이트/다크 모드가 자동 대응되도록 작성한다.
- 카드와 섹션 구획에는 무거운 그림자 대신 `Card` 컴포넌트의 기본 `ring-1 ring-foreground/10`과 `Separator`(`border-border`)를 활용한다.
- 헤더 우측 액션이나 배지는 임의의 `flex justify-between` 래퍼를 중첩하기보다 `CardHeader` 내부의 `CardAction` 슬롯을 활용한다.
- 퍼센트, 순서 번호, 통계 수치에는 반드시 `.tabular-nums` 클래스를 부여한다.
- 아이콘 단독 버튼(`size="icon"`)에는 접근성을 위해 `aria-label` 또는 `sr-only` 텍스트와 `Tooltip`을 함께 제공한다.

### Don't

- 한 화면 안에서 여러 개의 원색(`red`, `blue`, `green` 등) 솔리드 버튼을 경쟁하듯 배치하지 않는다 — 주요 행동은 `variant="default"`(`primary`), 보조 행동은 `variant="outline"` 또는 `variant="secondary"`, 위험 행동은 `variant="destructive"`로 위계를 통일한다.
- 입력 오류(`aria-invalid`) 상태에서 입력창 배경 전체를 빨간색으로 칠하지 않는다 — 보더(`border-destructive`)와 외곽 링(`ring-destructive/20`), 하단 도움말 텍스트로 전달한다.
- [`src/components/ui/`](file:///c:/Users/kimmi/Desktop/My-link-2502351/mylink/src/components/ui) 내부 프리미티브의 `data-slot` 속성을 임의로 제거하지 않는다 — 복합 컴포넌트(`Card`, `ButtonGroup`, `InputGroup` 등)의 자식 선택자 스타일링이 `data-slot`에 의존한다.
- 다크 모드를 위해 컴포넌트마다 `dark:bg-... dark:text-...`를 중복 선언하지 않는다 — `:root`와 `.dark`의 시맨틱 CSS 변수 매핑에 위임한다.

## Responsive Behavior

| Breakpoint | 기준 폭 | 레이아웃 및 컴포넌트 동작 규칙 |
| --- | --- | --- |
| **Desktop (`lg`)** | `1024px+` | 최대 너비 `max-w-6xl`, 좌우 패딩 `32px`(`lg:px-8`), 12컬럼 비대칭 그리드(`좌측 5컬럼 Sticky 프로필 카드` + `우측 7컬럼 콘텐츠 스택`), 채널 카드 2열 그리드(`sm:grid-cols-2`) |
| **Tablet (`sm`~`md`)** | `640px ~ 1023px` | 좌우 패딩 `24px`(`sm:px-6`), 단일 컬럼 세로 스택 + 채널 카드 2열 그리드 유지, 입력 폰트 크기 `14px`(`md:text-sm`) |
| **Mobile (`default`)** | `< 640px` | 좌우 패딩 `16px`(`px-4`), 전체 1열 세로 스택, 모바일 iOS 줌 방지를 위한 입력 폰트 `16px`(`text-base`), 상단바 보조 상태 배지 숨김 처리 및 핵심 액션 버튼 유지 |

## Known Gaps

- 기본 Neutral 테마는 순수 무채색으로만 구성되므로, 도메인 특성상 다채로운 카테고리 배지(예: 포트폴리오, 소셜, 코드 랩 구분)가 필요한 경우 `Badge`의 기본 변형(`default`, `secondary`, `outline`)을 우선 사용하거나, OKLCH 기반 보조 상태 토큰을 제한적으로 확장해 사용할 수 있다.
- 다크 모드 전환은 `.dark` 클래스를 `<html>` 요소에 토글하는 방식(`@custom-variant dark (&:is(.dark *))`)을 기준으로 동작하므로, 테마 토글 구현 시 `<html class="dark">` 제어를 사용해야 한다.

## References

1. https://ui.shadcn.com/ — shadcn/ui 공식 문서 및 컴포넌트 레지스트리
2. https://ui.shadcn.com/docs/theming — shadcn/ui OKLCH CSS 변수 및 테마 아키텍처 가이드
3. https://ui.shadcn.com/docs/tailwind-v4 — Tailwind CSS v4 `@theme inline` 및 `@custom-variant dark` 통합 명세
4. https://base-ui.com/ — `@base-ui/react` 헤드리스 컴포넌트 프리미티브 문서 (`base-nova` 스타일 기반)
