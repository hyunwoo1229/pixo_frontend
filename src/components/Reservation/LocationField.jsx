import React from "react";

export default function LocationField({ value, onChange, disabled }) {
  return (
    <>
      <label className="label text-sm text-gray-700 dark:text-zinc-400">희망 촬영 장소</label>
      <input
        className="input w-full h-11 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="ex) 경기도 수원시, 추천 장소 받기"
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
      />
    </>
  );
}