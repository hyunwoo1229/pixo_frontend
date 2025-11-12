import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OAuthRedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL의 쿼리 파라미터에서 토큰과 사용자 정보를 추출
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken'); 
    const name = searchParams.get('name');
    const role = searchParams.get('role'); 

    if (accessToken) {
      // 받아온 토큰과 정보를 localStorage에 저장.
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken); 
      }
      if (name) {
        localStorage.setItem('name', name);
      }
      if (role) {
        localStorage.setItem('role', role);
      }
      
      // 저장이 완료되면 메인 페이지로 이동
      navigate('/');
    } else {
      // 토큰이 없는 경우 로그인 페이지로 이동
      alert("로그인에 실패했습니다.");
      navigate('/login');
    }
  }, [location, navigate]);

  // 로딩 중임을 표시하는 간단한 UI
  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-900">
      <p className="dark:text-zinc-200">로그인 중입니다...</p>
    </div>
  );
}