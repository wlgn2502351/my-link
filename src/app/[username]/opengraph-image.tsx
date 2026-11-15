import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "@vercel/og";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { findUserByUsername } from "@/lib/profile";

export const alt = "마이링크 사용자 프로필";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadNotoSansKR(
  text: string,
  weight: 500 | 700
): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(
      text
    )}`;
    const cssResponse = await fetch(cssUrl, {
      headers: {
        // Satori(@vercel/og)는 woff2를 지원하지 않으므로 ttf를 반환하도록 구형 브라우저 UA 사용
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    });

    if (!cssResponse.ok) return null;

    const css = await cssResponse.text();
    const match = css.match(
      /src:\s*url\(([^)]+)\)\s*format\(['"]?(?:truetype|opentype)['"]?\)/
    );
    const fontUrl = match?.[1] ?? css.match(/src:\s*url\(([^)]+)\)/)?.[1];

    if (!fontUrl) return null;

    const fontResponse = await fetch(fontUrl);
    if (!fontResponse.ok) return null;

    return await fontResponse.arrayBuffer();
  } catch {
    return null;
  }
}

async function loadAvatarDataUrl(): Promise<string | null> {
  try {
    const avatarPath = join(process.cwd(), "public", "images", "avatar.jpg");
    const buffer = await readFile(avatarPath);
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function truncateText(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1)}…`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).replace(/^@/, "");

  let displayName = decodedUsername;
  let bio = "나만의 링크를 하나의 페이지에 모아 공유합니다.";
  let linkCount = 0;

  try {
    const found = await findUserByUsername(decodedUsername);
    if (found) {
      displayName = found.profile.displayName || decodedUsername;
      if (found.profile.bio?.trim()) {
        bio = truncateText(found.profile.bio, 76);
      }
      try {
        const linksRef = collection(db, "users", found.userId, "links");
        const countSnap = await getCountFromServer(linksRef);
        linkCount = countSnap.data().count;
      } catch {
        linkCount = 0;
      }
    }
  } catch {
    // Firestore 조회 실패 시 기본값 사용
  }

  const linkBadgeText = `${linkCount}개의 링크`;
  const handleText = `@${decodedUsername}`;
  const urlText = `mylink.app/${decodedUsername}`;
  const allText = Array.from(
    new Set(
      `마이링크MLMyLink${displayName}${bio}${linkBadgeText}${handleText}${urlText}`.split(
        ""
      )
    )
  ).join("");

  const [boldFont, regularFont, avatarDataUrl] = await Promise.all([
    loadNotoSansKR(allText, 700),
    loadNotoSansKR(allText, 500),
    loadAvatarDataUrl(),
  ]);

  const fonts: Array<{
    name: string;
    data: ArrayBuffer;
    style: "normal";
    weight: 500 | 700;
  }> = [];
  if (boldFont) {
    fonts.push({
      name: "Noto Sans KR",
      data: boldFont,
      style: "normal",
      weight: 700,
    });
  }
  if (regularFont) {
    fonts.push({
      name: "Noto Sans KR",
      data: regularFont,
      style: "normal",
      weight: 500,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#5B5FC7",
          padding: "56px 72px",
          fontFamily:
            fonts.length > 0 ? '"Noto Sans KR", sans-serif' : "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: "absolute",
            top: -130,
            right: -110,
            width: 440,
            height: 440,
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -170,
            left: -90,
            width: 380,
            height: 380,
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            display: "flex",
          }}
        />

        {/* 상단: 마이링크 로고 + 링크 개수 배지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 16,
                backgroundColor: "#FFFFFF",
                color: "#5B5FC7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              ML
            </div>
            <span
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              마이링크
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              border: "1.5px solid rgba(255, 255, 255, 0.32)",
              padding: "10px 24px",
              fontSize: 22,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            {linkBadgeText}
          </div>
        </div>

        {/* 중앙: 둥근 원형 프로필 이미지 + 이름 + 소개글 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            width: "100%",
          }}
        >
          {avatarDataUrl ? (
            <img
              src={avatarDataUrl}
              alt={displayName}
              width={156}
              height={156}
              style={{
                width: 156,
                height: 156,
                borderRadius: "9999px",
                objectFit: "cover",
                border: "5px solid rgba(255, 255, 255, 0.92)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 156,
                height: 156,
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "5px solid rgba(255, 255, 255, 0.92)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 60,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontSize: 62,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                {displayName}
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {handleText}
              </span>
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.45,
              }}
            >
              {bio}
            </div>
          </div>
        </div>

        {/* 하단: 브랜딩 URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.24)",
            paddingTop: "22px",
            fontSize: 22,
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.86)",
          }}
        >
          <span>{urlText}</span>
          <span>MyLink</span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  );
}
