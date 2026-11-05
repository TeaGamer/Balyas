"use client";

import ArticleImage from "./ArticleImage";
import { formatDate, getAuthor } from "@/lib/articles";
import type { Article, Category } from "@/lib/types";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 flex items-center space-x-2 text-sm text-navy-brand dark:text-yellow-400 font-semibold hover:underline"
    >
      <i className="fa-solid fa-arrow-left"></i>
      <span>Назад до головної</span>
    </button>
  );
}

interface ArticleViewProps {
  article: Article | undefined;
  now: number;
  goHome: () => void;
  onShare: (title: string) => void;
}

export function ArticleView({ article, now, goHome, onShare }: ArticleViewProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <BackButton onClick={goHome} />
      {article && (
        <article className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 sm:p-10 space-y-6 shadow-sm overflow-hidden">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                {article.category}
              </span>
              {article.badge && (
                <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {article.badge}
                </span>
              )}
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-4xl mt-2 mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 border-b dark:border-slate-800 pb-4">
              <span>
                <strong>Автор:</strong> {getAuthor(article)}
              </span>
              <span>•</span>
              <span>{formatDate(article.timestamp, now)}</span>
            </div>
          </div>

          {article.img && (
            <ArticleImage
              src={article.img}
              className="w-full rounded-lg h-72 sm:h-96 object-cover shadow-sm"
            />
          )}

          <div className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-100 leading-snug py-2">
            {article.lead}
          </div>

          {/* Content is authored by editors in the admin panel's rich-text editor. */}
          <div
            className="rich-content font-sans text-gray-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed space-y-4 pt-2"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={() => onShare(article.title)}
              className="bg-navy-brand text-white text-xs px-4 py-2 rounded flex items-center space-x-2 hover:bg-navy-800 transition"
            >
              <i className="fa-solid fa-share-nodes"></i>
              <span>Поділитися</span>
            </button>
          </div>
        </article>
      )}
    </main>
  );
}

interface CategoryViewProps {
  category: Category;
  visible: Article[];
  now: number;
  openArticle: (id: number) => void;
}

export function CategoryView({ category, visible, now, openArticle }: CategoryViewProps) {
  const filtered = visible.filter((a) => a.category === category);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b dark:border-slate-800 pb-4 mb-8">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl uppercase text-navy-brand dark:text-white">
          {category}
        </h1>
        <p className="text-xs text-gray-500 mt-1">Знайдено матеріалів: {filtered.length}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-500">
            У цій рубриці поки немає опублікованих матеріалів.
          </div>
        )}
        {filtered.map((item) => (
          <article
            key={item.id}
            onClick={() => openArticle(item.id)}
            className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer p-4 flex flex-col justify-between"
          >
            <div>
              {item.img && <ArticleImage src={item.img} className="w-full h-40 object-cover rounded mb-3" />}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-red-600 font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                {item.badge && (
                  <span className="bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {item.badge}
                  </span>
                )}
              </div>
              <h2 className="font-serif font-bold text-base text-gray-900 dark:text-white mt-1 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-3">{item.lead}</p>
            </div>
            <div className="mt-4 pt-2 border-t dark:border-slate-800 text-[10px] text-gray-400 flex justify-between">
              <span>{getAuthor(item)}</span>
              <span>{formatDate(item.timestamp, now)}</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export function AboutView({ goHome }: { goHome: () => void }) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <BackButton onClick={goHome} />
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 sm:p-10 space-y-6 shadow-sm">
        <h1 className="font-serif font-bold text-3xl text-navy-brand dark:text-white border-b pb-4 dark:border-slate-800">
          Про редакцію
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-serif">
          Проєкт медіа &quot;Баляс&quot; був створений з метою демонстрації незалежними
          студентами-журналістами своїх навичок у написанні новин, авторських матеріалів та організації
          роботи в команді.
        </p>
      </div>
    </main>
  );
}

export function CodeView({ goHome }: { goHome: () => void }) {
  const sections = [
    {
      title: "1. Оперативність та точність",
      text: "Ми ретельно перевіряємо факти перед опублікуванням. Будь-яке твердження базується на першоджерелах чи підтверджених даних.",
    },
    {
      title: "2. Відокремлення фактів від думок",
      text: "Авторські погляди та рефлексії чітко відокремлені від фактів. Читач завжди розуміє, де висвітлюються події, а де подано експертний чи авторський огляд.",
    },
    {
      title: "3. Маркування партнерських та рекламних матеріалів",
      text: "Медіа «Баляс» чітко маркує рекламні та партнерські тексти. Прихована реклама («джинса») категорично заборонена.",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <BackButton onClick={goHome} />
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 sm:p-10 space-y-6 shadow-sm">
        <h1 className="font-serif font-bold text-3xl text-navy-brand dark:text-white border-b pb-4 dark:border-slate-800">
          Редакційний кодекс медіа «Баляс»
        </h1>
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            Редакція медіа «Баляс» керується стандартами незалежної журналістики, забезпечуючи високу
            якість, об&apos;єктивність та неупередженість публікацій.
          </p>
          {sections.map((s) => (
            <div key={s.title} className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-navy-brand dark:text-yellow-400 mt-4">
                {s.title}
              </h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
