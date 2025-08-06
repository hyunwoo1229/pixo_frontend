import React from "react";

export default function NoAccountLink() {
  return (
    <p className="text-center text-xs mt-4">
      계정이 없으신가요?{" "}
      <a href="/register" className="underline font-medium">
        회원가입
      </a>
    </p>
  );
}
