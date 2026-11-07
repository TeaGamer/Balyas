"use client";

import { useEffect, useRef, useState } from "react";
import AdminView from "./AdminView";
import { Footer, MobileNav, NavBar, SiteHeader, Toast, UrgentTicker, UtilityBar } from "./Chrome";
import HomeView from "./HomeView";
import { AdminLoginModal, SearchModal, SupportModal } from "./Modals";
import { AboutView, ArticleView, CategoryView, CodeView } from "./PageViews";
import {
  ApiError,
  deleteArticle as apiDeleteArticle,
  fetchArticles,
  fetchSpecialProjects,
  saveArticle as apiSaveArticle,
  uploadImage,
} from "@/lib/api";
import { getVisibleArticles } from "@/lib/articles";
import type { Article, ArticleDraft, Category, SiteActions, View } from "@/lib/types";

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
  const [articles, setArticles] = useState<Article[]>([]);
  const [specialProjects, setSpecialProjects] = useState<Article[]>([]);
  const [token, setToken] = useState<string | null>(null);
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

  // Refetch after login so the admin also receives scheduled articles.
  useEffect(() => {
    let cancelled = false;
    fetchArticles(token)
      .then((list) => {
        if (!cancelled) setArticles(list);
      })
      .catch(() => {
        if (!cancelled) showToast("Не вдалося завантажити матеріали. Спробуйте оновити сторінку.");
      });
    fetchSpecialProjects(token)
      .then((list) => {
        if (!cancelled) setSpecialProjects(list);
      })
      .catch(() => {
        // The main articles request already reports connectivity problems.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (now === null) return null;

  const visible = getVisibleArticles(articles, now);
  const specials = getVisibleArticles(specialProjects, now).slice(0, 2);
  const urgent = visible.find((a) => a.important);

  function navigate(next: View) {
    setView(next);
  }

  function openFeed() {
    const scrollToFeed = () =>
      document.getElementById("news-feed")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (view.page === "home") {
      scrollToFeed();
    } else {
      navigate({ page: "home" });
      setTimeout(scrollToFeed, 100);
    }
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

  function handleAuthError(e: unknown, fallback: string) {
    if (e instanceof ApiError && e.status === 401) {
      setToken(null);
      setView({ page: "home" });
      showToast("Сесія завершилась. Увійдіть знову.");
    } else {
      showToast(e instanceof Error ? e.message : fallback);
    }
  }

  async function saveArticle(draft: ArticleDraft): Promise<boolean> {
    if (!token) return false;
    try {
      const saved = await apiSaveArticle(draft, token);
      setArticles((prev) =>
        prev.some((a) => a.id === saved.id)
          ? prev.map((a) => (a.id === saved.id ? saved : a))
          : [...prev, saved],
      );
      setSpecialProjects((prev) => {
        const rest = prev.filter((a) => a.id !== saved.id);
        return saved.badge === "СПЕЦПРОЄКТ" ? [...rest, saved] : rest;
      });
      showToast("Матеріал збережено!");
      return true;
    } catch (e) {
      handleAuthError(e, "Не вдалося зберегти матеріал.");
      return false;
    }
  }

  async function deleteArticle(id: number) {
    if (!token) return;
    try {
      await apiDeleteArticle(id, token);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setSpecialProjects((prev) => prev.filter((a) => a.id !== id));
      showToast("Матеріал видалено.");
    } catch (e) {
      handleAuthError(e, "Не вдалося видалити матеріал.");
    }
  }

  async function uploadArticleImage(file: File): Promise<string | null> {
    if (!token) return null;
    try {
      return await uploadImage(file, token);
    } catch (e) {
      handleAuthError(e, "Не вдалося завантажити зображення.");
      return null;
    }
  }

  function renderView() {
    switch (view.page) {
      case "home":
        return <HomeView visible={visible} specials={specials} now={now!} openArticle={actions.openArticle} />;
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
            onUploadImage={uploadArticleImage}
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
        onOpenFeed={openFeed}
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
          onSuccess={(newToken) => {
            setModal(null);
            setToken(newToken);
            navigate({ page: "admin" });
          }}
        />
      )}
    </>
  );
}
