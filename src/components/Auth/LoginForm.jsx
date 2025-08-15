// src/components/Auth/LoginForm.jsx
import axios from "../../api/axios";
import React, { useState } from "react";
import LoginInputGroup from "./LoginInputGroup";
import SubmitLoginButton from "./SubmitLoginButton";
import SocialLoginButtons from "./SocialLoginButtons";
import NoAccountLink from "./NoAccountLink";
import RegisterLogo from "../Register/RegisterLogo";

export default function LoginForm() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/auth/login", { loginId, password });
      const data = res.data || {};

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      const name = data.name;
      // ✅ 다양한 키 대응 (role / user.role / roles[0] / authorities[0].authority)
      const role =
        data.role ||
        data.user?.role ||
        (Array.isArray(data.roles) && data.roles[0]) ||
        (Array.isArray(data.authorities) && (data.authorities[0]?.authority || data.authorities[0])) ||
        "";

      if (!accessToken || !refreshToken) {
        throw new Error("토큰이 없습니다.");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      if (name) localStorage.setItem("name", name);
      if (role) localStorage.setItem("role", String(role).trim()); // ✅ 저장

      alert(`${name || "회원"}님 환영합니다!`);
      window.location.href = "/";
    } catch (err) {
      const msg = err.response?.data?.message || "로그인 실패";
      setError(msg);
    }
  };

  return (
    <div className="flex justify-center items-start pt-12 md:pt-24 lg:pt-36 min-h-screen bg-[#f8f9fa]">
      <div className="p-10 rounded-xl shadow-xl bg-white w-full max-w-md overflow-visible">
        <RegisterLogo />

        <LoginInputGroup
          loginId={loginId}
          setLoginId={setLoginId}
          password={password}
          setPassword={setPassword}
        />

        {error && (
          <p className="text-red-500 text-sm sm:text-base mt-3 break-words whitespace-pre-wrap min-h-[1.5rem] w-full">
            {error}
          </p>
        )}

        <div className="mt-6">
          <SubmitLoginButton disabled={!loginId || !password} onClick={handleSubmit} />
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <SocialLoginButtons />

        <div className="mt-6">
          <NoAccountLink />
        </div>
      </div>
    </div>
  );
}
