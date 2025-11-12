import React from "react";

export default function NoteField({ value, onChange, disabled }) {
  return (
    <>
      <label className="label text-sm text-gray-700 dark:text-zinc-400">기타</label>
      <input
        className="input w-full h-11 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="ex) 인원, 하고싶은 말 등"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </>
  );
}