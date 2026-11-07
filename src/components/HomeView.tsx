"use client";

import { useState } from "react";
import ArticleImage from "./ArticleImage";
import { formatDate, getAuthor } from "@/lib/articles";
import type { Article, FeedFilter } from "@/lib/types";

interface HomeViewProps {
  visible: Article[];
  specials: Article[];
  now: number;
  openArticle: (id: number) => void;
}

function CategoryBadgeRow({ item }: { item: Article }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-red-600 font-bold uppercase tracking-wider">{item.category}</span>
      {item.badge && (
        <span className="bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
          {item.badge}
        </span>
      )}
    </div>
  );
}

export default function HomeView({ visible, specials, now, openArticle }: HomeViewProps) {
  const [filter, setFilter] = useState<FeedFilter>("all");

  const hero = visible[0];
  const secondary = visible.slice(1, 5);
  const feed = filter === "important" ? visible.filter((a) => a.important) : visible;

  const tabClass = (active: boolean) =>
    active
      ? "px-2.5 py-1 rounded bg-navy-brand text-white font-semibold"
      : "px-2.5 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300";

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {hero && (
            <article
              onClick={() => openArticle(hero.id)}
              className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="relative">
                <ArticleImage src={hero.img} className="w-full h-64 sm:h-96 object-cover" />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="bg-navy-brand text-white text-xs font-bold px-2.5 py-1 rounded uppercase">
                    Головна тема
                  </span>
                  {hero.badge && (
                    <span className="bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded uppercase">
                      {hero.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs uppercase font-bold text-red-600 tracking-wider">
                  {hero.category}
                </span>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white mt-1 mb-3 leading-tight">
                  {hero.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {hero.lead}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Автор: {getAuthor(hero)}</span>
                  <span>{formatDate(hero.timestamp, now)}</span>
                </div>
              </div>
            </article>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {secondary.map((item) => (
              <article
                key={item.id}
                onClick={() => openArticle(item.id)}
                className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition cursor-pointer"
              >
                <div>
                  <ArticleImage src={item.img} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <CategoryBadgeRow item={item} />
                    <h2 className="font-serif font-bold text-base text-gray-900 dark:text-white mt-1 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2">{item.lead}</p>
                  </div>
                </div>
                <div className="p-4 pt-0 text-xs text-gray-400 flex justify-between">
                  <span>{getAuthor(item)}</span>
                  <span>{formatDate(item.timestamp, now)}</span>
                </div>
              </article>
            ))}
          </div>

          <section className="bg-navy-brand text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b border-navy-800 pb-3">
              <h2 className="font-serif font-bold text-xl text-yellow-400 uppercase">Спецпроєкти ★</h2>
              <span className="text-xs text-gray-400">Особливі матеріали</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specials.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openArticle(item.id)}
                  className="bg-navy-800 p-4 rounded border border-gray-700 hover:border-yellow-400 transition cursor-pointer"
                >
                  <span className="text-xs text-yellow-400 font-bold uppercase block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif font-bold text-base mb-1 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-xs">{item.lead}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside id="news-feed" className="lg:col-span-4 scroll-mt-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5 sticky top-20 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-4 border-b dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
                <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white uppercase">
                  Стрічка новин
                </h2>
              </div>
              <div className="flex space-x-1 text-xs">
                <button onClick={() => setFilter("all")} className={tabClass(filter === "all")}>
                  Усі
                </button>
                <button
                  onClick={() => setFilter("important")}
                  className={tabClass(filter === "important")}
                >
                  Важливе
                </button>
              </div>
            </div>
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {feed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openArticle(item.id)}
                  className="border-b border-gray-100 dark:border-slate-800 pb-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 p-2 rounded transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2 text-xs mb-1">
                    <span className="font-bold text-navy-brand dark:text-yellow-400">
                      {formatDate(item.timestamp, now)}
                    </span>
                    {item.important && (
                      <span className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Важливо
                      </span>
                    )}
                    <span className="text-gray-400">•</span>
                    <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                      {item.category}
                    </span>
                  </div>
                  <div className="font-sans font-medium text-sm text-gray-900 dark:text-gray-100 hover:text-navy-accent leading-snug">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
