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

  const toggleMenu = () => setIsOpen((v) => !v);
  const toggleAccount = () => setAccountOpen((v) => !v);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  // 링크 클릭 시 메뉴 닫히도록(선택)
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* 상단 고정 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <div className="w-full flex items-center justify-between px-4 py-2">
          {/* 햄버거 버튼(크기 유지) */}
          <button onClick={toggleMenu} className="text-3xl focus:outline-none">
            {isOpen ? <RxCross2 /> : <HiOutlineMenu />}
          </button>

          {/* 로고(크기 유지, 라인 높이 축소) */}
          <Link
            to="/"
            onClick={closeMenu}
            className="font-bold leading-none"
            style={{ fontFamily: "var(--logo-font)", fontSize: "3.6rem" }}
          >
            PIXO
          </Link>
        </div>

        {/* 드로어: 고정 헤더 바로 아래 */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white text-black border-t shadow-md">
            <nav className="flex flex-col text-base font-medium">
              <Link to="/introduce" onClick={closeMenu} className="px-6 py-4 border-b">PIXO</Link>
              <Link to="/price" onClick={closeMenu} className="px-6 py-4 border-b">가격</Link>
              <Link to="/reserve/type" onClick={closeMenu} className="px-6 py-4 border-b">예약하기</Link>
              <Link to="/inquiry" onClick={closeMenu} className="px-6 py-4 border-b">1:1 문의</Link>

              <hr />

              {isLoggedIn ? (
                <>
                  <Logout className="" />
                  <Link to="/reservation-history" onClick={closeMenu} className="px-6 py-4 border-b">
                    예약 조회
                  </Link>

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
                        onClick={closeMenu}
                        className="h-12 flex items-center px-6 border-t border-gray-200"
                      >
                        비밀번호 변경
                      </Link>
                      <Link
                        to="/withdraw"
                        onClick={closeMenu}
                        className="h-12 flex items-center px-6 border-t border-gray-200"
                      >
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

      {/* ✅ 스페이서: 모든 페이지에서 헤더에 가리지 않도록 자동 여백 */}
      <div className="h-20" aria-hidden="true"></div>
    </>
  );
}

export default Header;
