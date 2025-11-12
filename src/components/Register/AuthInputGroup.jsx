import React from "react";

const AuthInputGroup = ({ form, handleChange }) => {
  return (
    <>
      <input
        type="text"
        name="loginId"
        placeholder="아이디"
        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded outline-none mb-3
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-blue-500"
        value={form.loginId}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded outline-none mb-3
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-blue-500"
        value={form.password}
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="비밀번호 확인"
        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded outline-none
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-blue-500"
        value={form.confirmPassword}
        onChange={handleChange}
      />
    </>
  );
};

export default AuthInputGroup;