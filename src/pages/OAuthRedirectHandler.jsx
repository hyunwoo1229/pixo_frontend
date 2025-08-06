// src/pages/OAuthRedirectHandler.jsx
import React, { useEffect } from "react";

export default function OAuthRedirectHandler() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    const name = urlParams.get("name"); // null or empty string이면 처리 필요

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (name && name !== "null" && name.trim() !== "") {
        localStorage.setItem("name", name);
        alert(`${name}님 소셜로그인으로 환영합니다!`);
        window.location.href = "/";
      } else {
        // name이 없으면 추가 정보 페이지로 이동
        window.location.href = "/social-extra";
      }
    } else {
      alert("소셜 로그인 실패: 토큰 정보가 없습니다.");
      window.location.href = "/login";
    }
  }, []);

  return <p>소셜 로그인 처리 중입니다...</p>;
}
