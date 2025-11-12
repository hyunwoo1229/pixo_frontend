import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Logout({ className = "" }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.post("/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("name");
      localStorage.removeItem("role");

      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("로그아웃 실패");
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className={`w-full text-left px-6 py-4 border-b border-gray-200 dark:border-zinc-700 
                  hover:bg-gray-100 dark:hover:bg-zinc-800 ${className}`}
    >
      로그아웃
    </button>
  );
}