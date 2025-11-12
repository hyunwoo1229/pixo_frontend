import React from "react";
import Header from "../components/Header/Header";
import ChangePasswordForm from "../components/Header/ChangePasswordForm";
import RegisterLogo from "../components/Register/RegisterLogo";

export default function ChangePassword() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-6 pt-4 flex flex-col items-center">
        <RegisterLogo />
        <h2 className="text-xl font-bold mb-6 dark:text-zinc-100">비밀번호 변경</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}