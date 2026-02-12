import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function MyInfo() {
  const [memberInfo, setMemberInfo] = useState({
    loginId: "", 
    name: "",     
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }
        const response = await axios.get("/api/member/me");

        console.log("백엔드 응답 데이터:", response.data);

        const { loginId, name } = response.data; 

        setMemberInfo({
          loginId: loginId || '정보 없음',
          name: name || '정보 없음',
        });
      } catch (err) {
        console.error("회원 정보 조회 실패:", err);
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || "회원 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md space-y-4 text-center py-8">
        <p className="dark:text-zinc-400">정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md space-y-4 text-center py-8">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <p className="text-xs text-gray-400 mt-2">상세 에러: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="border-b border-gray-200 dark:border-zinc-700 pb-4">
        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mb-1">로그인 ID</p>
        <p className="text-lg font-semibold dark:text-zinc-100">{memberInfo.loginId}</p>
      </div>

      <div className="border-b border-gray-200 dark:border-zinc-700 pb-4">
        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mb-1">이름</p>
        <p className="text-lg font-semibold dark:text-zinc-100">{memberInfo.name}</p>
      </div>
    </div>
  );
}