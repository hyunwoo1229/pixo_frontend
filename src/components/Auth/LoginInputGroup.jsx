import React from "react";

export default function LoginInputGroup({
  loginId,
  setLoginId,
  password,
  setPassword,
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="아이디"
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />
    </div>
  );
}
