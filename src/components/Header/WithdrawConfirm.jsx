import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function WithdrawConfirm() { // ✅ 반드시 export default로 시작
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleCancel = () => navigate(-1);

  const handleWithdraw = async () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;

    try {
      setLoading(true);
      setErrMsg("");
      const token = localStorage.getItem("accessToken");

      await axios.delete("/api/member", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("name");

      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data;

      if (status === 401) setErrMsg("로그인이 필요합니다. 다시 로그인해주세요.");
      else setErrMsg(serverMsg || "회원 탈퇴 처리 중 오류가 발생했습니다.");
      console.error("회원 탈퇴 실패:", status, serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-extrabold text-center mb-6">회원 탈퇴</h2>

      <section className="mb-6">
        <h3 className="text-lg font-extrabold mb-2">회원탈퇴 유의사항</h3>
        <p className="text-gray-500 text-sm mb-4">회원탈퇴 전에 안내사항을 확인해주세요</p>

        <ul className="space-y-3 text-sm leading-6">
          <li>‘탈퇴하기’ 버튼을 누르면 회원탈퇴를 취소할 수 없습니다.</li>
          <li>회원탈퇴 시 1:1 문의글 작성, 예약하기 등 회원 전용 서비스 이용이 불가합니다.</li>
          <li>탈퇴 후 1:1 문의글은 수정·삭제가 불가합니다. 수정·삭제가 필요하다면 탈퇴 전에 진행해주세요.</li>
        </ul>
      </section>

      <h3 className="text-lg font-extrabold mb-4">정말로 탈퇴하시겠습니까?</h3>

      {errMsg && <p className="text-red-500 text-sm mb-3">{errMsg}</p>}

      <div className="flex gap-4">
        <button
          onClick={handleCancel}
          className="flex-1 border border-black py-3"
          disabled={loading}
        >
          취소
        </button>
        <button
          onClick={handleWithdraw}
          className="flex-1 bg-black text-white py-3 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "처리 중..." : "탈퇴하기"}
        </button>
      </div>
    </div>
  );
}
