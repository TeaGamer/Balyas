"use client";

import { useEffect, useRef, useState } from "react";
import AdminView from "./AdminView";
import { Footer, MobileNav, NavBar, SiteHeader, Toast, UrgentTicker, UtilityBar } from "./Chrome";
import HomeView from "./HomeView";
import { AdminLoginModal, SearchModal, SupportModal } from "./Modals";
import { AboutView, ArticleView, CategoryView, CodeView } from "./PageViews";
import { INITIAL_ARTICLES, getVisibleArticles } from "@/lib/articles";
import type { Article, Category, SiteActions, View } from "@/lib/types";

type Modal = "support" | "search" | "login" | null;

const TICK_MS = 5000;
const TOAST_MS = 3500;

function formatLongDate(now: number): string {
  const text = new Date(now).toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function formatClock(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function SiteApp() {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [view, setView] = useState<View>({ page: "home" });
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState<string | null>(null);
  // Null until mounted: relative dates depend on the client's clock/timezone.
  const [now, setNow] = useState<number | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  if (now === null) return null;

  const visible = getVisibleArticles(articles, now);
  const urgent = visible.find((a) => a.important);

  function navigate(next: View) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }

  const actions: SiteActions = {
    goHome: () => navigate({ page: "home" }),
    openArticle: (id) => navigate({ page: "article", id }),
    openCategory: (category: Category) => navigate({ page: "category", category }),
    openPage: (page) => navigate({ page }),
    showToast,
  };

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
  }

  async function shareArticle(title: string) {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch {
        // User dismissed the share sheet.
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Посилання на новину скопійовано у буфер!");
    }
  }

  function saveArticle(article: Article) {
    setArticles((prev) =>
      prev.some((a) => a.id === article.id)
        ? prev.map((a) => (a.id === article.id ? article : a))
        : [...prev, article],
    );
    showToast("Матеріал збережено!");
  }

  function deleteArticle(id: number) {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast("Матеріал видалено.");
  }

  function renderView() {
    switch (view.page) {
      case "home":
        return <HomeView visible={visible} now={now!} openArticle={actions.openArticle} />;
      case "article":
        return (
          <ArticleView
            article={articles.find((a) => a.id === view.id)}
            now={now!}
            goHome={actions.goHome}
            onShare={shareArticle}
          />
        );
      case "category":
        return (
          <CategoryView
            category={view.category}
            visible={visible}
            now={now!}
            openArticle={actions.openArticle}
          />
        );
      case "about":
        return <AboutView goHome={actions.goHome} />;
      case "code":
        return <CodeView goHome={actions.goHome} />;
      case "admin":
        return (
          <AdminView
            articles={articles}
            now={now!}
            onSave={saveArticle}
            onDelete={deleteArticle}
            goHome={actions.goHome}
          />
        );
    }
  }

  return (
    <>
      <Toast message={toast} />
      <UtilityBar
        dateText={formatLongDate(now)}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setModal("search")}
      />
      <SiteHeader goHome={actions.goHome} onOpenSupport={() => setModal("support")} />
      <NavBar goHome={actions.goHome} openCategory={actions.openCategory} />
      {urgent && (
        <UrgentTicker
          article={urgent}
          time={formatClock(urgent.timestamp)}
          onOpen={() => actions.openArticle(urgent.id)}
        />
      )}

      {renderView()}

      <Footer
        openCategory={actions.openCategory}
        openPage={actions.openPage}
        showToast={showToast}
        onOpenAdminLogin={() => setModal("login")}
      />
      <MobileNav
        goHome={actions.goHome}
        onOpenSearch={() => setModal("search")}
        onToggleTheme={toggleTheme}
      />

      {modal === "support" && (
        <SupportModal
          onClose={() => setModal(null)}
          onDonate={() => {
            setModal(null);
            showToast("Дякую! Але ми поки не беремо грошей.");
          }}
        />
      )}
      {modal === "search" && (
        <SearchModal
          visible={visible}
          now={now}
          onClose={() => setModal(null)}
          onSelect={(id) => {
            setModal(null);
            actions.openArticle(id);
          }}
        />
      )}
      {modal === "login" && (
        <AdminLoginModal
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            navigate({ page: "admin" });
          }}
        />
      )}
    </>
  );
}
