import React from "react";
import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

export default function AdminMenu() {
  return (
    <div className="px-6 py-6 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-zinc-100">관리자 페이지</h1>
      <nav className="flex flex-col border border-gray-200 dark:border-zinc-700 rounded-md overflow-hidden">
        {/* 사진 업로드 */}
        <Link 
          to="/admin/photos" 
          className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-zinc-700 
                     hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="dark:text-zinc-200">사진 업로드</span>
          <IoChevronForward className="text-gray-500 dark:text-zinc-400" />
        </Link>
        
        {/* 1:1 문의 답변 */}
        <Link 
          to="/admin/questions" 
          className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-zinc-700 
                     hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="dark:text-zinc-200">1:1 문의 답변</span>
          <IoChevronForward className="text-gray-500 dark:text-zinc-400" />
        </Link>
        
        {/* 전체 예약 관리 */}
        <Link 
          to="/admin/reservations" 
          className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-zinc-700 
                     hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="dark:text-zinc-200">전체 예약 관리</span>
          <IoChevronForward className="text-gray-500 dark:text-zinc-400" />
        </Link>

        {/* 일정 관리 */}
        <Link 
          to="/admin/schedule" 
          className="flex items-center justify-between px-4 py-4 
                     hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="dark:text-zinc-200">일정 관리</span>
          <IoChevronForward className="text-gray-500 dark:text-zinc-400" />
        </Link>
      </nav>
    </div>
  );
}