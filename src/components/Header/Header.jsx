import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Logout from "./Logout";
import { useTheme } from '../../context/ThemeContext'; 
import { MdDarkMode, MdLightMode } from 'react-icons/md'; 

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false); 
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); 

  const applyAuthState = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    const roleRaw = localStorage.getItem("role") || "";
    const role = String(roleRaw).trim().toUpperCase();
    setIsLoggedIn(!!token);
    setIsAdmin(!!role && role.includes("ADMIN"));
  }, []);

  useEffect(() => {
    applyAuthState();
  }, [applyAuthState, location]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "accessToken" || e.key === "role") applyAuthState();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [applyAuthState]);

  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) applyAuthState();
  };
  const toggleAccount = () => setAccountOpen((v) => !v);
  const toggleAdmin = () => setAdminOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  // 스위치 핸들 크기 및 배경 너비
  const switchWidth = "w-14"; 
  const switchHeight = "h-7";
  const handleSize = "w-6 h-6";
  
  // 1. 위치 로직 반전:
  // dark (달) -> translate-x-0
  // light (해) -> translate-x-6 (24px)로 수정하여 중앙 정렬 시도
  const handleTranslateX = theme === 'dark' ? 'translate-x-0' : 'translate-x-6'; 

  // 2. 핸들 색상 로직
  // dark -> bg-gray-200 (밝게)
  // light -> bg-zinc-600 (어둡게)
  const handleColor = theme === 'dark' ? 'bg-gray-200' : 'bg-zinc-600';


  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow
                   dark:bg-zinc-900 dark:border-b dark:border-zinc-700 dark:shadow-none"
      >
        <div className="w-full flex items-center justify-between px-4 py-2">
          
          <div className="flex items-center space-x-2"> 
            <button
              onClick={toggleMenu}
              className="text-3xl focus:outline-none text-gray-800 dark:text-white"
              aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {isOpen ? <RxCross2 /> : <HiOutlineMenu />}
            </button>
            
            {/* 다크 모드 스위치 버튼 스타일 적용 */}
            <div 
              className={`relative ${switchWidth} ${switchHeight} flex items-center justify-between rounded-full p-1 cursor-pointer 
                          ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'} transition-colors duration-300`} 
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {/* 스위치 핸들 (translate-x-6으로 수정) */}
              <div 
                className={`absolute ${handleSize} rounded-full shadow-md transform transition-transform duration-300 
                            ${handleTranslateX} ${handleColor}`} 
              ></div>

              {/* 다크 모드 아이콘 (달) */}
              <MdDarkMode 
                className={`z-10 ${handleSize} p-1 transition-colors duration-300
                            ${theme === 'dark' ? 'text-zinc-900' : 'text-gray-500'}`} 
              />
              {/* 라이트 모드 아이콘 (해) */}
              <MdLightMode 
                className={`z-10 ${handleSize} p-1 transition-colors duration-300
                            ${theme === 'dark' ? 'text-gray-200' : 'text-zinc-900'}`} 
              />
            </div>
            {/* ------------------------------------- */}
          </div>
          

          <Link
            to="/"
            onClick={closeMenu}
            className="font-bold leading-none text-gray-800 dark:text-white"
            style={{ fontFamily: "var(--logo-font)", fontSize: "3.6rem" }}
          >
            PIXO
          </Link>
        </div>

        {isOpen && (
          <div 
            className="absolute top-full left-0 w-full bg-white text-black border-t border-gray-200 shadow-md
                       dark:bg-zinc-900 dark:text-white dark:border-t dark:border-zinc-700"
          >
            <nav className="flex flex-col text-base font-medium">
              <Link to="/introduce" onClick={closeMenu} className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">PIXO</Link>
              <Link to="/price" onClick={closeMenu} className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">가격</Link>
              <Link to="/reservation/type" onClick={closeMenu} className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">예약하기</Link>
              <Link to="/question" onClick={closeMenu} className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">1:1 문의</Link>

              <hr className="border-gray-200 dark:border-zinc-700" />

              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <>
                      <button
                        onClick={toggleAdmin}
                        className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700 text-left w-full hover:bg-gray-50 dark:hover:bg-zinc-800"
                        aria-expanded={adminOpen}
                      >
                        <span>관리자 페이지</span>
                        {adminOpen ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
                      </button>
                      {adminOpen && (
                        <div className="flex flex-col">
                          <Link to="/admin/photos" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 pl-10">
                            사진 관리
                          </Link>
                          <Link to="/admin/questions" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 pl-10">
                            1:1 문의 답변
                          </Link>
                          <Link to="/admin/reservations" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 pl-10">
                            전체 예약 관리
                          </Link>
                          <Link to="/admin/members" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 pl-10">
                            전체 회원 관리
                          </Link>
                          <Link to="/admin/schedule" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 pl-10">
                            일정 관리
                          </Link>
                        </div>
                      )}
                    </>
                  )}

                  <Logout className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 w-full text-left" /> 

                  <Link to="/reservations/history" onClick={closeMenu} className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">
                    예약 조회
                  </Link>

                  <button
                    onClick={toggleAccount}
                    className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700 text-left w-full hover:bg-gray-50 dark:hover:bg-zinc-800"
                    aria-expanded={accountOpen}
                  >
                    <span>계정 관리</span>
                    {accountOpen ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
                  </button>

                  {accountOpen && (
                    <div className="flex flex-col">
                      <Link to="/my-info" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 pl-10">
                        내 정보 보기
                      </Link>
                      <Link to="/change-password" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 pl-10">
                        비밀번호 변경
                      </Link>
                      <Link to="/withdraw" onClick={closeMenu} className="h-12 flex items-center px-6 border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 pl-10">
                        회원 탈퇴
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" onClick={closeMenu} className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">로그인</Link>
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