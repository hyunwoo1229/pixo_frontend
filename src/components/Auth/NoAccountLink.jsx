import React from "react";

export default function NoAccountLink() {
  return (
    <p className="text-center text-xs mt-4 text-gray-600 dark:text-zinc-400">
      계정이 없으신가요?{" "}
      <a href="/register" className="underline font-medium text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white">
        회원가입
      </a>
    </p>
  );
}