import React from "react";

export default function DesiredShootDateField({ value, onChange, disabled }) {
  return (
    <>
      <label className="label text-sm text-gray-700 dark:text-zinc-400">희망 촬영 날짜</label>
      <input
        className="input w-full h-11 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="ex) 10월 15일 또는 11월 첫째 주"
        value={value}
        onChange={onChange} // onChange 이벤트는 그대로 전달
        required
        disabled={disabled}
      />
    </>
  );
}