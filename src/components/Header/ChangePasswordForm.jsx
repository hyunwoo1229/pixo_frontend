import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError(""); 
  };

  const handleSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = form;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새로운 비밀번호가 일치하지 않습니다.");
      return;
    }

    // ▼▼▼▼▼ [수정] try...catch 블록 로직 개선 ▼▼▼▼▼
    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");

      const response = await axios.put(
        "/api/member/profile/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 성공 시, 백엔드가 보내주는 성공 메시지를 사용
      alert(response.data.message || "비밀번호가 변경되었습니다.");
      navigate("/");

    } catch (err) {
      const status = err.response?.status;
      const serverMsg =
        err.response?.data?.message ||
        "알 수 없는 오류가 발생했습니다.";

      // 오류 처리 로직 단순화
      if (status === 400) { // 400 Bad Request (잘못된 요청)
        setError(serverMsg); // 서버가 주는 메시지를 그대로 표시 (길이 오류, 불일치 오류 등)
      } else if (status === 401) { // 401 Unauthorized (인증 실패)
        setError("로그인이 필요합니다. 다시 로그인 해주세요.");
      } else { // 기타 500 서버 에러 등
        setError("비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
      console.error("비밀번호 변경 실패:", status, serverMsg);
      
    } finally {
      setSubmitting(false);
    }
    // ▲▲▲▲▲ [수정] 완료 ▲▲▲▲▲
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="text-sm font-medium">현재 비밀번호</label>
        <input
          type="password"
          name="oldPassword"
          value={form.oldPassword}
          onChange={handleChange}
          className="mt-1 w-full border px-4 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm font-medium">새로운 비밀번호</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          className="mt-1 w-full border px-4 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm font-medium">새로운 비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          className="mt-1 w-full border px-4 py-2 rounded"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      <div className="flex justify-between mt-6">
        <button
          className="w-1/2 border border-black py-2 mr-2"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          취소
        </button>
        <button
          className="w-1/2 bg-black text-white py-2 ml-2 disabled:opacity-60"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "처리 중..." : "등록"}
        </button>
      </div>
    </div>
  );
}