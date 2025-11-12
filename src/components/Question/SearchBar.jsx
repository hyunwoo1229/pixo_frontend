import React, { useEffect, useRef, useState } from "react";

export default function SearchBar({
  mode, onModeChange,
  value, onChange, onSearch,
  placeholder = "검색어를 입력하세요",
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const label = mode === "content" ? "내용" : "제목";
  function select(v) { onModeChange?.(v); setOpen(false); }

  return (
    <div className="flex items-center gap-2">
      <div ref={boxRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="text-sm dark:text-zinc-200">{label}</span>
          <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.126l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
          </svg>
        </button>
        {open && (
          <ul role="listbox" 
              className="absolute z-10 mt-1 w-full min-w-[110px] 
                         bg-white border border-gray-200 rounded shadow
                         dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-lg">
            <li>
              <button
                type="button"
                onClick={() => select("title")}
                className={`w-full text-left px-3 py-2 text-sm 
                            hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-zinc-200
                            ${mode==="title"?"font-semibold":""}`}
                role="option" aria-selected={mode==="title"}
              >제목</button>
            </li>
            <li className="border-t border-gray-100 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => select("content")}
                className={`w-full text-left px-3 py-2 text-sm 
                            hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-zinc-200
                            ${mode==="content"?"font-semibold":""}`}
                role="option" aria-selected={mode==="content"}
              >내용</button>
            </li>
          </ul>
        )}
      </div>

      <div className="flex-1 flex">
        <input
          className="flex-1 border border-r-0 border-gray-300 dark:border-zinc-600 px-3 py-2 rounded-l md:rounded-l-md
                     bg-white dark:bg-zinc-800 
                     focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSearch?.(); }}
        />
        <button
          type="button"
          onClick={onSearch}
          className="px-4 py-2 rounded-r md:rounded-r-md 
                     bg-black text-white border border-black
                     dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-200"
        >
          검색
        </button>
      </div>
    </div>
  );
}