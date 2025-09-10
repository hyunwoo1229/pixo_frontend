import React from "react";
import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

export default function AdminMenu() {
  return (
    <div className="px-6 py-6 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>
      <nav className="flex flex-col border rounded-md overflow-hidden">
        {/* 사진 업로드 */}
        <Link 
          to="/admin/photos" 
          className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
        >
          <span>사진 업로드</span>
          <IoChevronForward />
        </Link>
        
        {/* 1:1 문의 답변 */}
        <Link 
          to="/admin/questions" 
          className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
        >
          <span>1:1 문의 답변</span>
          <IoChevronForward />
        </Link>
        
        {/* 전체 예약 관리 */}
        <Link 
          to="/admin/reservations" 
          className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
        >
          <span>전체 예약 관리</span>
          <IoChevronForward />
        </Link>

        {/* 일정 관리 */}
        <Link 
          to="/admin/schedule" 
          className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
        >
          <span>일정 관리</span>
          <IoChevronForward />
        </Link>
      </nav>
    </div>
  );
}