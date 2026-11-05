"use client";

import type { ClipboardEvent, RefObject } from "react";

function toElement(node: Node | null): Element | null {
  if (!node) return null;
  return node instanceof Element ? node : node.parentElement;
}

export default function RichTextEditor({ editorRef }: { editorRef: RefObject<HTMLDivElement | null> }) {
  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  function changeBlock(tag: string) {
    if (tag) exec("formatBlock", tag);
  }

  function toggleQuote() {
    const editor = editorRef.current;
    const sel = window.getSelection();
    if (!editor || !sel || sel.rangeCount === 0) return;

    const start = toElement(sel.anchorNode);
    if (!start || !editor.contains(start)) return;

    const existingQuote = start.closest(".quote-block, blockquote");
    if (existingQuote && existingQuote.parentNode) {
      const p = document.createElement("p");
      p.innerHTML = existingQuote.innerHTML;
      existingQuote.parentNode.replaceChild(p, existingQuote);
      return;
    }

    document.execCommand("formatBlock", false, "p");
    const current = toElement(sel.anchorNode);
    const targetP = current?.closest("p") ?? current;

    const quote = document.createElement("div");
    quote.className = "quote-block";
    quote.innerHTML = targetP?.innerHTML || "Текст цитати...";

    if (targetP && targetP !== editor && editor.contains(targetP) && targetP.parentNode) {
      targetP.parentNode.replaceChild(quote, targetP);
    } else {
      editor.appendChild(quote);
    }
  }

  function insertLink() {
    const url = prompt("Введіть URL посилання або джерела:");
    if (url) exec("createLink", url);
  }

  // Strip foreign HTML/styles on paste
  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
  }

  return (
    <div>
      <label className="block text-xs font-semibold uppercase mb-1">
        Текст статті (з можливістю форматування)
      </label>
      <div className="flex flex-wrap gap-2 mb-2 bg-gray-100 dark:bg-slate-800 p-2 rounded border dark:border-slate-700 items-center">
        <button type="button" onClick={() => exec("bold")} className="editor-btn" title="Жирний">
          <b>B</b>
        </button>
        <button type="button" onClick={() => exec("italic")} className="editor-btn" title="Курсив">
          <i>I</i>
        </button>

        <select
          value=""
          onChange={(e) => changeBlock(e.target.value)}
          className="editor-btn font-normal text-xs outline-none cursor-pointer"
        >
          <option value="">Розмір шрифту</option>
          <option value="p">Звичайний</option>
          <option value="h3">Великий (Заголовок 3)</option>
          <option value="h2">Дуже великий (Заголовок 2)</option>
        </select>

        <button type="button" onClick={toggleQuote} className="editor-btn" title="Цитата">
          <i className="fa-solid fa-quote-left"></i> Цитата
        </button>
        <button type="button" onClick={insertLink} className="editor-btn" title="Гіперпосилання">
          <i className="fa-solid fa-link"></i> Лінк на джерело
        </button>
        <button
          type="button"
          onClick={() => exec("unlink")}
          className="editor-btn"
          title="Прибрати посилання"
        >
          <i className="fa-solid fa-link-slash"></i>
        </button>
        <button
          type="button"
          onClick={() => exec("removeFormat")}
          className="editor-btn"
          title="Очистити стилі"
        >
          <i className="fa-solid fa-eraser"></i>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onPaste={handlePaste}
        className="rich-content w-full border dark:border-slate-700 p-4 rounded min-h-[220px] bg-white dark:bg-slate-800 text-sm outline-none focus:border-navy-brand"
      />
    </div>
  );
}
