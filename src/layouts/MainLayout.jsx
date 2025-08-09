// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header.jsx 안에 스페이서가 있으므로 여기선 상단 패딩 불필요 */}
      <main className="pb-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
