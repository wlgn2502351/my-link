import { doc, increment, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type PillTone = "red" | "teal" | "green" | "blue" | "neutral";

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  favicon: string;
  isFavorite: boolean;
  clickCount: number;
  createdAt: string;
}

export const pillStyles: Record<PillTone, string> = {
  red: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/50",
  teal: "bg-sky-50 text-sky-900 ring-1 ring-inset ring-sky-200/70 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800/50",
  green:
    "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/50",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/70 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800/50",
  neutral:
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200/70 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/50",
};

export const categoryToneMap: Record<string, PillTone> = {
  개발: "green",
  문서: "blue",
  디자인: "red",
  커뮤니티: "teal",
  생산성: "neutral",
};

export const categories = Object.keys(categoryToneMap);

export function formatDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toUpperCase();
  } catch {
    return url.toUpperCase();
  }
}

export function formatDate(isoDate: string) {
  return isoDate.slice(0, 10).replace(/-/g, ".");
}

export function normalizeUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidWebUrl(rawUrl: string) {
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

export function getDefaultFavicon(url: string) {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch {
    return "/globe.svg";
  }
}

export function parseCreatedAt(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date(0).toISOString();
}

export function mapDocsToLinks(
  docs: Array<{ id: string; data: () => Record<string, unknown> }>
): LinkItem[] {
  const items: LinkItem[] = docs.map((docSnap) => {
    const data = docSnap.data();
    const rawUrl = typeof data.url === "string" ? data.url : "";
    const rawFavicon = typeof data.favicon === "string" ? data.favicon : "";

    return {
      id: docSnap.id,
      title: typeof data.title === "string" ? data.title : "",
      url: rawUrl,
      description: typeof data.description === "string" ? data.description : "",
      category: typeof data.category === "string" ? data.category : "개발",
      tags: Array.isArray(data.tags)
        ? data.tags.filter((tag): tag is string => typeof tag === "string")
        : [],
      favicon: rawFavicon || getDefaultFavicon(rawUrl),
      isFavorite: Boolean(data.isFavorite),
      clickCount:
        typeof data.clickCount === "number" && Number.isFinite(data.clickCount)
          ? data.clickCount
          : 0,
      createdAt: parseCreatedAt(data.createdAt),
    };
  });

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Atomically increments the `clickCount` field on `users/{userId}/links/{linkId}` in Firestore.
 */
export async function incrementLinkClickCount(
  userId: string,
  linkId: string
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("링크 클릭 카운트를 저장하려면 로그인이 필요합니다.");
    return;
  }

  if (currentUser.uid !== userId) {
    return;
  }

  try {
    const linkDocRef = doc(db, "users", userId, "links", linkId);
    await updateDoc(linkDocRef, {
      clickCount: increment(1),
    });
  } catch (error) {
    console.error("Failed to increment link click count in Firestore:", error);
  }
}
