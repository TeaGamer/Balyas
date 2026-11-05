"use client";

import { NAV_CATEGORIES } from "@/lib/articles";
import type { Article, SiteActions } from "@/lib/types";

interface UtilityBarProps {
  dateText: string;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export function UtilityBar({ dateText, onToggleTheme, onOpenSearch }: UtilityBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-gray-600 dark:text-gray-300">
        <div>{dateText}</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleTheme}
            className="hover:text-navy-brand dark:hover:text-yellow-400 flex items-center space-x-1"
          >
            <span className="dark:hidden">
              <i className="fa-solid fa-moon"></i>
            </span>
            <span className="hidden dark:inline text-yellow-400">
              <i className="fa-solid fa-sun"></i>
            </span>
            <span className="hidden sm:inline">Тема</span>
          </button>
          <button
            onClick={onOpenSearch}
            className="hover:text-navy-brand dark:hover:text-white flex items-center space-x-1"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Пошук</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader({
  goHome,
  onOpenSupport,
}: {
  goHome: () => void;
  onOpenSupport: () => void;
}) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
          className="group flex flex-col items-center sm:items-start"
        >
          <div className="flex items-baseline space-x-1">
            <span className="font-serif font-black text-4xl sm:text-5xl tracking-tight text-navy-brand dark:text-white uppercase">
              БАЛЯС
            </span>
            <span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span>
          </div>
          <span className="text-[10px] tracking-[0.2em] text-gray-500 dark:text-gray-400 font-bold uppercase mt-1">
            НЕЗАЛЕЖНЕ УКРАЇНСЬКЕ МЕДІА
          </span>
        </a>

        <div className="border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3 rounded-lg flex items-center space-x-4 max-w-md">
          <div className="text-navy-brand dark:text-yellow-400 text-2xl pl-1">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div className="text-xs">
            <div className="font-bold text-gray-900 dark:text-white">Фонд підтримки редакції</div>
            <div className="text-gray-500 dark:text-gray-400 text-[11px]">
              Долучіться до розслідувань команди «Баляс». Кожна гривня важлива.
            </div>
          </div>
          <button
            onClick={onOpenSupport}
            className="bg-navy-brand dark:bg-blue-600 hover:bg-navy-800 text-white text-xs font-semibold px-3 py-2 rounded shrink-0 transition-colors"
          >
            Підтримати
          </button>
        </div>
      </div>
    </header>
  );
}

export function NavBar({ goHome, openCategory }: Pick<SiteActions, "goHome" | "openCategory">) {
  return (
    <nav className="bg-navy-brand text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 flex items-center space-x-1 whitespace-nowrap"
          >
            <i className="fa-solid fa-house"></i>
            <span>Головна</span>
          </a>
          {NAV_CATEGORIES.map(({ value, label }) => (
            <a
              key={value}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openCategory(value);
              }}
              className={
                value === "спецпроєкти"
                  ? "px-3 py-1.5 whitespace-nowrap text-yellow-400 hover:text-yellow-300"
                  : "px-3 py-1.5 whitespace-nowrap hover:text-blue-300"
              }
            >
              {value === "спецпроєкти" ? `${label} ★` : label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function UrgentTicker({
  article,
  time,
  onOpen,
}: {
  article: Article;
  time: string;
  onOpen: () => void;
}) {
  return (
    <div className="bg-red-600 text-white py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center space-x-3 text-xs sm:text-sm">
        <span className="bg-black/30 font-bold px-2 py-0.5 rounded flex items-center space-x-1 shrink-0">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span>ВАЖЛИВО</span>
        </span>
        <div className="truncate cursor-pointer hover:underline" onClick={onOpen}>
          <span className="font-bold opacity-80">{time}</span> — {article.title}
        </div>
      </div>
    </div>
  );
}

const SOCIALS = [
  { name: "Telegram", icon: "fa-telegram", href: "https://t.me/balyas_media" },
  { name: "Facebook", icon: "fa-facebook-f", href: "" },
  { name: "Instagram", icon: "fa-instagram", href: "" },
  { name: "YouTube", icon: "fa-youtube", href: "" },
];

interface FooterProps extends Pick<SiteActions, "openCategory" | "openPage" | "showToast"> {
  onOpenAdminLogin: () => void;
}

export function Footer({ openCategory, openPage, showToast, onOpenAdminLogin }: FooterProps) {
  return (
    <footer className="bg-[#050C1A] text-white mt-16 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-baseline space-x-1">
              <span className="font-serif font-black text-3xl tracking-tight text-white uppercase">
                БАЛЯС
              </span>
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block"></span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              Незалежне суспільно-політичне інтернет-видання. Ми висвітлюємо правду, аналізуємо події
              та створюємо якісну журналістику для свідомого суспільства.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-300 mb-3">Розділи</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              {NAV_CATEGORIES.map(({ value, label }) => (
                <li key={value}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openCategory(value);
                    }}
                    className="hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-300 mb-3">Про проєкт</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openPage("about");
                  }}
                  className="hover:text-white"
                >
                  Про редакцію
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openPage("code");
                  }}
                  className="hover:text-white"
                >
                  Редакційний кодекс
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/PanShakal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Реклама на сайті
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/PanShakal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Контакти & Прес-центр
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-300 mb-3">
              Слідкуйте за нами
            </h4>
            <div className="flex space-x-2 mb-4">
              {SOCIALS.map(({ name, icon, href }) => (
                href.trim() ? (
                  <a
                    key={name}
                    href="https://t.me/balyas_media"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-sm"
                  >
                    <i className={`fa-brands ${icon}`}></i>
                  </a>
                ) : (
                  <button
                    key={name}
                    aria-label={name}
                    onClick={() => showToast("У медіа «Баляс» поки немає цієї платформи.")}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-sm"
                  >
                    <i className={`fa-brands ${icon}`}></i>
                  </button>
                )
              ))}
            </div>
            <p className="text-[10px] text-gray-500">© 2026 ТОВ «Баляс Медіа Group». Всі права захищені.</p>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-6 text-[11px] text-gray-500 space-y-1">
          <p>
            Передрук усіх матеріалів, включно з текстовими та графічними, дозволяється за умови
            гіперпосилання на «Баляс».
          </p>
          <p>
            Матеріали з позначкою «Реклама», «Спецпроєкт» або «Партнерський матеріал» публікуються на
            правах реклами.
          </p>
        </div>

        <div className="mt-8 pt-4 text-center">
          <button
            onClick={onOpenAdminLogin}
            className="text-[11px] text-gray-700 hover:text-gray-400 transition-colors"
          >
            Вхід для авторів
          </button>
        </div>
      </div>
    </footer>
  );
}

export function MobileNav({
  goHome,
  onOpenFeed,
  onOpenSearch,
}: {
  goHome: () => void;
  onOpenFeed: () => void;
  onOpenSearch: () => void;
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navy-brand border-t border-navy-800 text-white z-50 flex justify-around py-2">
      <button onClick={goHome} className="flex flex-col items-center text-xs text-yellow-400">
        <i className="fa-solid fa-newspaper text-base"></i>
        <span>Головна</span>
      </button>
      <button onClick={onOpenFeed} className="flex flex-col items-center text-xs text-gray-300 hover:text-white">
        <i className="fa-solid fa-bolt text-base"></i>
        <span>Стрічка</span>
      </button>
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center text-xs text-gray-300 hover:text-white"
      >
        <i className="fa-solid fa-magnifying-glass text-base"></i>
        <span>Пошук</span>
      </button>
    </nav>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (message === null) return null;
  return (
    <div className="fixed top-5 right-5 bg-navy-brand text-white text-sm px-4 py-3 rounded shadow-xl z-50 transition-all duration-300">
      <span>{message}</span>
    </div>
  );
}
