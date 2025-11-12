import React, { useState, useEffect } from "react";

export default function QuestionForm({
  initialValues = { title: "", content: "" },
  onSubmit,
  onCancel,
  submitting = false,
  ui = {},
}) {
  const [form, setForm] = useState(initialValues);
  const [err, setErr] = useState("");

  useEffect(() => { setForm(initialValues); }, [initialValues]);

  function change(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErr("");
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setErr("제목을 입력해 주세요.");
    if (!form.content.trim()) return setErr("내용을 입력해 주세요.");
    onSubmit?.({ title: form.title.trim(), content: form.content.trim() });
  }

  const inputClass = ui.inputClass || "";
  const textareaClass = ui.textareaClass || "";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <input
          name="title"
          value={form.title}
          onChange={change}
          placeholder="제목을 입력하세요"
          disabled={submitting}
          maxLength={200}
          className={`w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 
                     bg-white dark:bg-zinc-800 
                     focus:ring-2 focus:ring-blue-500 outline-none ${inputClass}`}
        />
      </div>

      <div>
        <textarea
          name="content"
          value={form.content}
          onChange={change}
          placeholder="문의하실 내용을 입력하세요"
          disabled={submitting}
          className={`w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 
                     bg-white dark:bg-zinc-800 
                     focus:ring-2 focus:ring-blue-500 outline-none ${textareaClass}`}
        />
      </div>

      {err && <p className="text-red-500 dark:text-red-400 text-sm">{err}</p>}

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 border border-black dark:border-zinc-500 py-3 rounded disabled:opacity-60
                     hover:bg-gray-100 dark:hover:bg-zinc-800`}
          disabled={submitting}
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 bg-black text-white py-3 rounded disabled:opacity-60
                     dark:bg-white dark:text-black dark:hover:bg-gray-200"
          disabled={submitting}
        >
          {submitting ? "처리 중..." : "등록"}
        </button>
      </div>
    </form>
  );
}