import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header"; // Header 경로 확인
import Footer from "../components/Footer/Footer"; // Footer 경로 확인

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* 이 Outlet 부분에 App.jsx에서 정의한 자식 페이지들이 렌더링됩니다. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
