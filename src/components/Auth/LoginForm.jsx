import React, { useState } from "react";
import axios from "axios";
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
      const res = await axios.post("/api/auth/login", {
        loginId,
        password,
      });
      const { accessToken, refreshToken, name } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("name", name);

      alert(`${name}님 환영합니다!`);
      window.location.href = "/";
    } catch (err) {
      const msg = err.response?.data?.message || "로그인 실패";
      setError(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa]">
  <div className="p-10 rounded-xl shadow-xl bg-white w-full max-w-md">
    <RegisterLogo />

    <LoginInputGroup
      loginId={loginId}
      setLoginId={setLoginId}
      password={password}
      setPassword={setPassword}
    />

    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

    <div className="mt-6">
      <SubmitLoginButton
        disabled={!loginId || !password}
        onClick={handleSubmit}
      />
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
