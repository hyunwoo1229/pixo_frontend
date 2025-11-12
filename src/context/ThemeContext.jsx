import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Context 생성
const ThemeContext = createContext();

// 2. Context를 제공하는 Provider 컴포넌트 생성
export const ThemeProvider = ({ children }) => {
  // 로컬 스토리지에서 'theme' 값을 읽어오거나, 없으면 'light'를 기본값으로 설정
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // theme 상태가 변경될 때마다 실행되는 효과
  useEffect(() => {
    const root = window.document.documentElement; // <html> 태그를 의미

    // <html> 태그에서 'dark' 클래스를 추가하거나 제거
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 사용자의 테마 선택을 로컬 스토리지에 저장 (다음에 방문할 때 기억하도록)
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 테마를 토글(전환)하는 함수
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 자식 컴포넌트들에게 { theme, toggleTheme } 값을 제공
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. 다른 컴포넌트에서 쉽게 Context 값을 사용할 수 있도록 Hook 생성
export const useTheme = () => useContext(ThemeContext);