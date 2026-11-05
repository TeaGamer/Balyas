import type { Article, ArticleDraft } from "./types";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (typeof init.body === "string") headers.set("Content-Type", "application/json");

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    let detail = `Помилка сервера (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // Non-JSON error body.
    }
    throw new ApiError(detail, res.status);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export function fetchArticles(token?: string | null): Promise<Article[]> {
  return request<Article[]>("/api/articles?limit=200", {}, token);
}

export async function login(user: string, password: string): Promise<string | null> {
  try {
    const data = await request<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ user, password }),
    });
    return data.access_token;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
}

export function saveArticle(draft: ArticleDraft, token: string): Promise<Article> {
  const { id, ...body } = draft;
  return request<Article>(
    id === null ? "/api/articles" : `/api/articles/${id}`,
    { method: id === null ? "POST" : "PUT", body: JSON.stringify(body) },
    token,
  );
}

export function deleteArticle(id: number, token: string): Promise<void> {
  return request<void>(`/api/articles/${id}`, { method: "DELETE" }, token);
}

export async function uploadImage(file: File, token: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const data = await request<{ url: string }>("/api/images", { method: "POST", body: form }, token);
  return data.url;
}
