import React from "react";

const NamePhoneInputGroup = ({ form, handleChange }) => {
  return (
    <div className="rounded border border-gray-300 dark:border-zinc-600 overflow-hidden">
      <input
        type="text"
        name="name"
        placeholder="이름"
        className="w-full px-4 py-2 border-b border-gray-300 dark:border-zinc-600 outline-none
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-blue-500"
        value={form.name || ""}
        onChange={handleChange}
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="전화번호 (- 없이 숫자만 입력)"
        className="w-full px-4 py-2 outline-none
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-blue-500"
        value={form.phoneNumber || ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default NamePhoneInputGroup;