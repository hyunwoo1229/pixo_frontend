// src/pages/Admin/AdminMenu.jsx (새로운 파일)

import React from "react";
import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

export default function AdminMenu() {
  return (
    <div className="px-6 py-6 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>
      <nav className="flex flex-col border rounded-md">
        <Link 
          to="/admin/photos" 
          className="flex items-center justify-between px-4 py-4 border-b"
        >
          <span>사진 업로드</span>
          <IoChevronForward />
        </Link>
        <Link 
          to="/admin/questions" 
          className="flex items-center justify-between px-4 py-4"
        >
          <span>1:1 문의 답변</span>
          <IoChevronForward />
        </Link>
      </nav>
    </div>
  );
}