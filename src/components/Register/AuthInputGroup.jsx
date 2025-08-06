import React from "react";

const AuthInputGroup = ({ form, handleChange }) => {
  return (
    <div className="rounded border overflow-hidden">
  <input
    type="text"
    name="loginId"
    placeholder="아이디"
    className="w-full px-4 py-2 border-b outline-none"
    value={form.loginId}
    onChange={handleChange}
  />
  <input
    type="password"
    name="password"
    placeholder="비밀번호"
    className="w-full px-4 py-2 outline-none"
    value={form.password}
    onChange={handleChange}
  />
</div>
  );
};

export default AuthInputGroup;
