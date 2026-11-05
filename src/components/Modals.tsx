"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { formatDate, getAuthor } from "@/lib/articles";
import type { Article } from "@/lib/types";

function Backdrop({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "center" | "top";
}) {
  return (
    <div
      className={
        align === "center"
          ? "fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          : "fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-20 px-4"
      }
    >
      {children}
    </div>
  );
}

export function SupportModal({ onClose, onDonate }: { onClose: () => void; onDonate: () => void }) {
  return (
    <Backdrop>
      <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white w-full max-w-md rounded-lg p-6 relative">
        <button
          onClick={onClose}
          aria-label="Закрити"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        <h3 className="font-serif font-bold text-xl text-navy-brand dark:text-yellow-400 mb-2">
          Підтримка медіа «Баляс»
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
          Ваша підтримка допомагає нам створювати незалежні матеріали та розслідування.
        </p>
        <div className="space-y-3">
          {["Одноразовий внесок (100 ₴)", "Щомісячна підписка (200 ₴/міс)"].map((label) => (
            <button
              key={label}
              onClick={onDonate}
              className="w-full border dark:border-slate-700 p-3 rounded text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 flex justify-between items-center"
            >
              <span>{label}</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          ))}
        </div>
      </div>
    </Backdrop>
  );
}

interface SearchModalProps {
  visible: Article[];
  now: number;
  onClose: () => void;
  onSelect: (id: number) => void;
}

export function SearchModal({ visible, now, onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const results = q
    ? visible.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.lead.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q),
      )
    : [];

  return (
    <Backdrop align="top">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-lg shadow-xl p-4">
        <div className="flex items-center space-x-3 border-b dark:border-slate-800 pb-3">
          <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук за заголовком, автором або змістом..."
            className="w-full text-lg outline-none bg-transparent text-gray-900 dark:text-white"
          />
          <button onClick={onClose} aria-label="Закрити" className="text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {q && results.length === 0 && (
            <div className="text-xs text-gray-500 py-2">Нічого не знайдено за запитом &quot;{q}&quot;</div>
          )}
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded cursor-pointer border-b dark:border-slate-800 text-sm"
            >
              <div className="flex items-center space-x-2 text-xs mb-0.5">
                <span className="text-red-600 uppercase font-bold">{item.category}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">Автор: {getAuthor(item)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{formatDate(item.timestamp, now)}</span>
              </div>
              <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.lead}</div>
            </div>
          ))}
        </div>
      </div>
    </Backdrop>
  );
}

export function AdminLoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (token: string) => void;
}) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const token = await login(user, pass);
      if (token) onSuccess(token);
      else setError("Невірний логін або пароль.");
    } catch {
      setError("Сервер недоступний. Якщо він «спав», зачекайте хвилину та повторіть.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Backdrop>
      <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white w-full max-w-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif font-bold text-xl">Вхід в систему «Баляс»</h3>
          <button onClick={onClose} aria-label="Закрити" className="text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Логін</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border dark:border-slate-700 bg-transparent p-2 rounded text-sm outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Пароль</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full border dark:border-slate-700 bg-transparent p-2 rounded text-sm outline-none"
              required
            />
          </div>
          {error && <div className="text-red-600 text-xs">{error}</div>}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-navy-brand text-white py-2 rounded text-sm font-semibold hover:bg-navy-800 disabled:opacity-60"
          >
            Увійти
          </button>
        </form>
      </div>
    </Backdrop>
  );
}
