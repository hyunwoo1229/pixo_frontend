import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OAuthRedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL의 쿼리 파라미터에서 토큰과 사용자 정보를 추출합니다.
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken'); // ▼▼▼▼▼ refreshToken을 가져옵니다. ▼▼▼▼▼
    const name = searchParams.get('name');
    const role = searchParams.get('role'); // role 정보도 함께 받을 수 있습니다.

    if (accessToken) {
      // 받아온 토큰과 정보를 localStorage에 저장합니다.
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken); // ▼▼▼▼▼ refreshToken을 저장합니다. ▼▼▼▼▼
      }
      if (name) {
        localStorage.setItem('name', name);
      }
      if (role) {
        localStorage.setItem('role', role);
      }
      
      // 저장이 완료되면 메인 페이지로 이동합니다.
      navigate('/');
    } else {
      // 토큰이 없는 경우 로그인 페이지로 이동시킵니다.
      alert("로그인에 실패했습니다.");
      navigate('/login');
    }
  }, [location, navigate]);

  // 로딩 중임을 표시하는 간단한 UI
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>로그인 중입니다...</p>
    </div>
  );
}
