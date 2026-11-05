import type { Article, Badge, Category } from "./types";

export const DEFAULT_AUTHOR = "Команда «Баляс»";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

export const DEFAULT_UPLOAD_IMAGE =
  "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80";

export const NAV_CATEGORIES: { value: Category; label: string }[] = [
  { value: "політика", label: "Політика" },
  { value: "освіта", label: "Освіта" },
  { value: "війна", label: "Війна" },
  { value: "суспільство", label: "Суспільство" },
  { value: "світ", label: "Світ" },
  { value: "економіка", label: "Економіка" },
  { value: "культура", label: "Культура" },
  { value: "технології", label: "Технології" },
  { value: "спецпроєкти", label: "Спецпроєкти" },
];

export const ADMIN_CATEGORIES: { value: Category; label: string }[] = [
  { value: "культура", label: "Культура" },
  { value: "розслідування", label: "Розслідування" },
  { value: "політика", label: "Політика" },
  { value: "освіта", label: "Освіта" },
  { value: "війна", label: "Війна" },
  { value: "суспільство", label: "Суспільство" },
  { value: "світ", label: "Світ" },
  { value: "економіка", label: "Економіка" },
  { value: "технології", label: "Технології" },
  { value: "спецпроєкти", label: "Спецпроєкти" },
];

export const BADGE_OPTIONS: { value: Badge; label: string }[] = [
  { value: "", label: "Звичайна новина" },
  { value: "СПЕЦПРОЄКТ", label: "Спецпроєкт" },
  { value: "РЕКЛАМА", label: "Реклама" },
  { value: "ПАРТНЕРСЬКИЙ МАТЕРІАЛ", label: "Партнерський матеріал" },
];

const MONTHS = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

export function formatDate(timestamp: number, now: number): string {
  const d = new Date(timestamp);
  const today = new Date(now);
  const timeStr = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;

  if (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  ) {
    return `Сьогодні, ${timeStr}`;
  }
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${timeStr}`;
}

export function getAuthor(article: Pick<Article, "author">): string {
  return article.author.trim() !== "" ? article.author : DEFAULT_AUTHOR;
}

export function getVisibleArticles(articles: Article[], now: number): Article[] {
  return articles
    .filter((a) => a.timestamp <= now)
    .sort((a, b) => b.timestamp - a.timestamp);
}
