// src/components/Header.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Logout from "./Logout";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();

  const applyAuthState = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    const roleRaw = localStorage.getItem("role") || "";
    const role = String(roleRaw).trim().toUpperCase(); // ✅ 공백/대소문자 정리
    setIsLoggedIn(!!token);
    setIsAdmin(!!role && role.includes("ADMIN")); // ✅ ADMIN / ROLE_ADMIN 모두 허용
  }, []);

  useEffect(() => {
    applyAuthState(); // 최초 + 라우트 변경 시 재평가
  }, [applyAuthState, location]);

  useEffect(() => {
    // 다른 탭/창에서 토큰/role 변경 시 반영
    const onStorage = (e) => {
      if (e.key === "accessToken" || e.key === "role") applyAuthState();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [applyAuthState]);

  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) applyAuthState(); // 메뉴 열 때 최신 권한 확인
  };
  const toggleAccount = () => setAccountOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <div className="w-full flex items-center justify-between px-4 py-2">
          <button
            onClick={toggleMenu}
            className="text-3xl focus:outline-none"
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isOpen ? <RxCross2 /> : <HiOutlineMenu />}
          </button>

          <Link
            to="/"
            onClick={closeMenu}
            className="font-bold leading-none"
            style={{ fontFamily: "var(--logo-font)", fontSize: "3.6rem" }}
          >
            PIXO
          </Link>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white text-black border-t shadow-md">
            <nav className="flex flex-col text-base font-medium">
              <Link to="/introduce" onClick={closeMenu} className="px-6 py-4 border-b">PIXO</Link>
              <Link to="/price" onClick={closeMenu} className="px-6 py-4 border-b">가격</Link>
              <Link to="/reserve/type" onClick={closeMenu} className="px-6 py-4 border-b">예약하기</Link>
              <Link to="/question" onClick={closeMenu} className="px-6 py-4 border-b">1:1 문의</Link>

              <hr />

              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={closeMenu} className="px-6 py-4 border-b">
                      관리자 페이지
                    </Link>
                  )}

                  <Logout className="" />

                  <Link to="/reservation-history" onClick={closeMenu} className="px-6 py-4 border-b">
                    예약 조회
                  </Link>

                  <button
                    onClick={toggleAccount}
                    className="flex items-center justify-between px-6 py-4 border-b text-left"
                    aria-expanded={accountOpen}
                  >
                    <span>계정 관리</span>
                    {accountOpen ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
                  </button>

                  {accountOpen && (
                    <div className="flex flex-col">
                      <Link to="/change-password" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200">
                        비밀번호 변경
                      </Link>
                      <Link to="/withdraw" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200">
                        회원 탈퇴
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" onClick={closeMenu} className="px-6 py-4 border-b">로그인</Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <div className="h-20" aria-hidden="true" />
    </>
  );
}

export default Header;
