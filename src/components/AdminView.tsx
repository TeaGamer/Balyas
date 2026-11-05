"use client";

import { useRef, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import {
  ADMIN_CATEGORIES,
  BADGE_OPTIONS,
  DEFAULT_AUTHOR,
  DEFAULT_UPLOAD_IMAGE,
  formatDate,
  getAuthor,
} from "@/lib/articles";
import type { Article, ArticleDraft, Badge, Category } from "@/lib/types";

interface AdminViewProps {
  articles: Article[];
  now: number;
  onSave: (article: ArticleDraft) => Promise<boolean>;
  onDelete: (id: number) => void;
  onUploadImage: (file: File) => Promise<string | null>;
  goHome: () => void;
}

interface FormState {
  title: string;
  category: Category;
  author: string;
  badge: Badge;
  important: boolean;
  lead: string;
  imgUrl: string;
  customTime: boolean;
  scheduleDate: string;
  scheduleTime: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "культура",
  author: "",
  badge: "",
  important: false,
  lead: "",
  imgUrl: "",
  customTime: false,
  scheduleDate: "",
  scheduleTime: "",
};

const INPUT_CLASS =
  "w-full border dark:border-slate-700 bg-transparent p-2.5 rounded text-sm outline-none focus:border-navy-brand";

export default function AdminView({
  articles,
  now,
  onSave,
  onDelete,
  onUploadImage,
  goHome,
}: AdminViewProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const sorted = [...articles].sort((a, b) => b.timestamp - a.timestamp);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFileInputKey((k) => k + 1);
    if (editorRef.current) editorRef.current.innerHTML = "";
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await onUploadImage(file);
    setUploading(false);
    if (url) update("imgUrl", url);
    else setFileInputKey((k) => k + 1);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let timestamp = Date.now();
    if (form.customTime && form.scheduleDate && form.scheduleTime) {
      timestamp = new Date(`${form.scheduleDate}T${form.scheduleTime}`).getTime();
    }

    setSaving(true);
    const ok = await onSave({
      id: editingId,
      title: form.title,
      category: form.category,
      author: form.author.trim() !== "" ? form.author : DEFAULT_AUTHOR,
      badge: form.badge,
      important: form.important,
      lead: form.lead,
      content: editorRef.current?.innerHTML ?? "",
      img: form.imgUrl || DEFAULT_UPLOAD_IMAGE,
      timestamp,
    });
    setSaving(false);
    if (ok) resetForm();
  }

  function editArticle(art: Article) {
    setEditingId(art.id);
    setForm({
      ...EMPTY_FORM,
      title: art.title,
      category: art.category,
      author: art.author,
      badge: art.badge,
      important: art.important,
      lead: art.lead,
      imgUrl: art.img,
    });
    if (editorRef.current) editorRef.current.innerHTML = art.content;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteArticle(id: number) {
    if (confirm("Видалити цей матеріал?")) {
      onDelete(id);
      if (editingId === id) resetForm();
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b dark:border-slate-800 pb-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy-brand dark:text-white">
            Панель керування авторів
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Публікація, редагування, розширене форматування новин та точне планування часу
          </p>
        </div>
        <button
          onClick={goHome}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-white rounded text-sm font-semibold hover:bg-gray-300"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>Повернутися на сайт
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <h2 className="font-serif font-bold text-xl text-navy-brand dark:text-yellow-400 border-b pb-3 dark:border-slate-800">
          Форма створення / редагування матеріалу
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Заголовок новини</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Введіть заголовок..."
              className={INPUT_CLASS}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Рубрика</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value as Category)}
                className={INPUT_CLASS}
              >
                {ADMIN_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">
                Автор / Авторка (за замовч.: Команда «Баляс»)
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="Команда «Баляс»"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Тип матеріалу (Плашка)</label>
              <select
                value={form.badge}
                onChange={(e) => update("badge", e.target.value as Badge)}
                className={INPUT_CLASS}
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-1">
            <label className="flex items-center space-x-2 text-sm font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={form.important}
                onChange={(e) => update("important", e.target.checked)}
                className="rounded w-4 h-4 text-navy-brand"
              />
              <span>Позначити як &quot;Важлива новина&quot;</span>
            </label>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded border dark:border-slate-700 space-y-3">
            <label className="flex items-center space-x-2 font-bold text-xs uppercase cursor-pointer">
              <input
                type="checkbox"
                checked={form.customTime}
                onChange={(e) => update("customTime", e.target.checked)}
              />
              <span>Запланувати або опублікувати конкретною датою/часом (заднє число)</span>
            </label>
            {form.customTime && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase">Дата публікації</label>
                  <input
                    type="date"
                    value={form.scheduleDate}
                    onChange={(e) => update("scheduleDate", e.target.value)}
                    className="w-full border dark:border-slate-700 bg-transparent p-2 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase">Час публікації</label>
                  <input
                    type="time"
                    value={form.scheduleTime}
                    onChange={(e) => update("scheduleTime", e.target.value)}
                    className="w-full border dark:border-slate-700 bg-transparent p-2 rounded text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">
              Лід (короткий вступний абзац)
            </label>
            <textarea
              rows={2}
              value={form.lead}
              onChange={(e) => update("lead", e.target.value)}
              placeholder="Короткий опис новини для картки..."
              className={INPUT_CLASS}
              required
            />
          </div>

          <RichTextEditor editorRef={editorRef} />

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Зображення новини</label>
            <div className="space-y-2">
              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full border dark:border-slate-700 bg-transparent p-2 rounded text-xs text-gray-500"
              />
              <input
                type="text"
                value={form.imgUrl}
                onChange={(e) => update("imgUrl", e.target.value)}
                placeholder="Або вкажіть прямий URL зображення (https://...)"
                className="w-full border dark:border-slate-700 bg-transparent p-2 rounded text-sm"
              />
            </div>
            {uploading && <span className="text-[10px] text-gray-400 block mt-1">Завантаження зображення...</span>}
            {form.imgUrl && (
              <div className="mt-2">
                <span className="text-[10px] text-gray-400 block mb-1">Попередній перегляд зображення:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imgUrl} alt="" className="h-40 rounded border object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-slate-800">
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded text-sm">
              Очистити форму
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2.5 bg-navy-brand text-white rounded text-sm font-semibold hover:bg-navy-800 disabled:opacity-60"
            >
              {saving ? "Збереження..." : "Зберегти та опублікувати"}
            </button>
          </div>
        </form>

        <div className="mt-10 border-t dark:border-slate-800 pt-6">
          <h3 className="font-serif font-bold text-xl mb-4 text-navy-brand dark:text-white">
            Всі опубліковані матеріали
          </h3>
          <div className="space-y-3">
            {sorted.map((art) => (
              <div
                key={art.id}
                className="flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-3.5 rounded border dark:border-slate-700 text-sm"
              >
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{art.title}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    [Рубрика: {art.category} | Автор: {getAuthor(art)}]
                  </span>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold ml-2">
                    ({formatDate(art.timestamp, now)})
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => editArticle(art)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-semibold"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => deleteArticle(art.id)}
                    className="text-red-600 dark:text-red-400 hover:underline text-xs font-semibold"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
