export type Category =
  | "культура"
  | "розслідування"
  | "політика"
  | "освіта"
  | "війна"
  | "суспільство"
  | "світ"
  | "економіка"
  | "технології"
  | "спецпроєкти";

export type Badge = "" | "СПЕЦПРОЄКТ" | "РЕКЛАМА" | "ПАРТНЕРСЬКИЙ МАТЕРІАЛ";

export interface Article {
  id: number;
  title: string;
  category: Category;
  author: string;
  lead: string;
  timestamp: number;
  important: boolean;
  badge: Badge;
  img: string;
  content: string;
}

export interface ArticleDraft extends Omit<Article, "id"> {
  id: number | null;
}

export type View =
  | { page: "home" }
  | { page: "article"; id: number }
  | { page: "category"; category: Category }
  | { page: "about" }
  | { page: "code" }
  | { page: "admin" };

export type FeedFilter = "all" | "important";

export interface SiteActions {
  goHome: () => void;
  openArticle: (id: number) => void;
  openCategory: (category: Category) => void;
  openPage: (page: "about" | "code") => void;
  showToast: (message: string) => void;
}
