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

const article1Text = `
<p class="mb-4">Фінальні титри – не завжди кінець історії. Іноді після них хочеться комусь зателефонувати, придбати квитки на найближчий потяг, переглянути старі фотографії або просто посидіти кілька хвилин, перш ніж повертатися до звичних справ. Стрічка вже закінчилася, але думки, які вона залишила, ще нікуди не зникли.</p>

<h3 class="font-serif font-bold text-xl mt-6 mb-2">Таємне життя Волтера Мітті (The Secret Life of Walter Mitty, 2013)</h3>
<p class="text-xs text-gray-500 mb-2">Режисер: Бен Стіллер</p>
<p class="mb-4">Волтер Мітті коректор фотожурналу «Life». Він живе досить передбачуваним життям і часто подумки опиняється в пригодах, на які в реальності не наважується. Та коли головний кадр для останнього паперового випуску журналу зникає, Волтер вирушає на пошуки фотографа.</p>

<h3 class="font-serif font-bold text-xl mt-6 mb-2">Елізабеттаун (Elizabethtown, 2005)</h3>
<p class="text-xs text-gray-500 mb-2">Режисер: Кемерон Кроу</p>
<p class="mb-4">Для Дрю Бейлора все складається не найкращим чином: невдалий проєкт спортивного взуття коштує йому роботи, а невдовзі він дізнається про смерть батька. Герой вирушає до рідного Елізабеттауна в Кентуккі.</p>
`;

const article2Text = `
<p class="mb-4">Доля – цікава річ. Ти ніколи не дізнаєшся, які у неї plans. Вона хитра та амбітна, тому завжди досягне своєї мети, як би палко ти не опирався цьому.</p>

<h3 class="font-serif font-bold text-xl mt-6 mb-2">«Один день» (2011)</h3>
<p class="mb-4">Уявіть, що ви випадково перетнулись на випускному в університеті, неймовірно провели ніч, але уранці вирішили розійтися.</p>

<h3 class="font-serif font-bold text-xl mt-6 mb-2">«Будинок біля озера» (2006)</h3>
<p class="mb-4">Через кілька днів листування герої розуміють, що проживають у різних годах: він у 2004, а вона у 2006.</p>
`;

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Фільми, які не закінчуються разом із титрами",
    category: "культура",
    author: "Олександра Баранова",
    lead: "Фінальні титри – не завжди кінець історії. Іноді після них хочеться комусь зателефонувати або вирушити у подорож.",
    timestamp: new Date("2026-11-04T14:45:00").getTime(),
    important: true,
    badge: "СПЕЦПРОЄКТ",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    content: article1Text,
  },
  {
    id: 2,
    title: "5 фільмів, які змусять вас повірити в долю",
    category: "спецпроєкти",
    author: "Балич Орися",
    lead: "Герої намагаються прокласти свій шлях самостійно, але якщо доля вирішила взятись за когось – тікати нікуди.",
    timestamp: new Date("2026-11-04T13:15:00").getTime(),
    important: false,
    badge: "СПЕЦПРОЄКТ",
    img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    content: article2Text,
  },
  {
    id: 3,
    title: "Реформа вищої освіти: ключові зміни для студентів",
    category: "освіта",
    author: "Команда «Баляс»",
    lead: "Презентовано нову концепцію розвитку университетських програм та студентського самоврядування.",
    timestamp: new Date("2026-11-03T12:00:00").getTime(),
    important: false,
    badge: "",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
    content: "<p>Повний текст статті про вищу освіту...</p>",
  },
];
