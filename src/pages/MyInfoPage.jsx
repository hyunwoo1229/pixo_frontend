import React from "react";
import Header from "../components/Header/Header";
import RegisterLogo from "../components/Register/RegisterLogo";
import MyInfo from "../components/Header/MyInfo"; 

export default function MyInfoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="px-6 pt-4 flex flex-col items-center">
        <RegisterLogo />
        <h2 className="text-xl font-bold mb-6">내 정보 보기</h2>
        <MyInfo /> 
      </div>
    </div>
  );
}