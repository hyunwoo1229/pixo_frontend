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

        // 수정 포인트: 백엔드 @GetMapping("/me")에 맞춰 경로를 /api/member/me로 변경
        // setupAxios.js에서 헤더를 자동으로 넣어주므로 두 번째 인자인 headers 옵션은 생략 가능합니다.
        const response = await axios.get("/api/member/me");

        const { loginId, name } = response.data; 

        setMemberInfo({
          loginId: loginId || '정보 없음',
          name: name || '정보 없음',
        });
      } catch (err) {
        console.error("회원 정보 조회 실패:", err);
        // 백엔드에서 401(UNAUTHORIZED)이나 404(NOT_FOUND)를 던질 때의 에러 메시지 처리
        const message = err.response?.data?.message || "회원 정보를 불러오는 데 실패했습니다.";
        setError(message);
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