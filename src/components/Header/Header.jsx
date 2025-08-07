// src/components/Header/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Logout from "./Logout";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAccount = () => setAccountOpen(!accountOpen);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="relative w-full flex items-center justify-between px-4 py-4 bg-white shadow z-50">
      {/* 햄버거 메뉴: 왼쪽 */}
      <button onClick={toggleMenu} className="text-3xl focus:outline-none">
        {isOpen ? <RxCross2 /> : <HiOutlineMenu />}
      </button>

      {/* 로고: 오른쪽 + 크게 */}
      <Link
        to="/"
        className="text-[3.6rem] font-bold"
        style={{ fontFamily: "var(--logo-font)" }}
      >
        PIXO
      </Link>

      {/* 드로어 메뉴 */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white text-black border-t shadow-md z-40 animate-fadeIn">
          <nav className="flex flex-col text-base font-medium">
            <Link to="/" className="px-6 py-4 border-b">PIXO</Link>
            <Link to="/price" className="px-6 py-4 border-b">가격</Link>
            <Link to="/reserve" className="px-6 py-4 border-b">예약하기</Link>
            <Link to="/inquiry" className="px-6 py-4 border-b">1:1 문의</Link>

            <hr />

            {isLoggedIn ? (
              <>
                 <Logout />
                <Link to="/reservation-history" className="px-6 py-4 border-b">예약 조회</Link>

                {/* 계정 관리 드롭다운 */}
                <button
                  onClick={toggleAccount}
                  className="flex items-center justify-between px-6 py-4 border-b text-left"
                >
                  <span>계정 관리</span>
                  {accountOpen ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
                </button>

                {accountOpen && (
  <div className="flex flex-col">
    <Link
      to="/change-password"
      className="h-12 flex items-center px-6 border-t border-gray-200"
    >
      비밀번호 변경
    </Link>
    <Link
      to="/withdraw"
      className="h-12 flex items-center px-6 border-t border-gray-200"
    >
      회원 탈퇴
    </Link>
  </div>
)}
              </>
            ) : (
              <Link to="/login" className="px-6 py-4 border-b">로그인</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
