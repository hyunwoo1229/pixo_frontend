// src/components/Account/ChangePasswordForm.jsx
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
  const [error, setError] = useState(""); // 🔸에러 문구 표시

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError(""); // 입력 바꾸면 에러 초기화
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

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");

      await axios.put(
        "/api/member/profile/password",
        { oldPassword, newPassword }, // ✅ DTO 키 일치
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("비밀번호가 변경되었습니다.");
      navigate("/");
    } catch (err) {
      // ✅ 서버 응답 기반으로 문구 분기
      const status = err.response?.status;
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data;

      if (status === 400) {
        // 보편적으로 '현재 비밀번호 불일치'는 400으로 내려줌
        // 백엔드가 메시지를 주면 그대로, 없으면 기본 문구
        const msgText =
          typeof serverMsg === "string" ? serverMsg : "";
        if (
          /old|current|비밀번호.*일치|mis|wrong/i.test(msgText)
        ) {
          setError(msgText);
        } else {
          setError("현재 비밀번호가 올바르지 않습니다.");
        }
      } else if (status === 401) {
        setError("로그인이 필요합니다. 다시 로그인 해주세요.");
      } else {
        setError(serverMsg || "비밀번호 변경에 실패했습니다.");
      }
      console.error("비밀번호 변경 실패:", status, serverMsg);
    } finally {
      setSubmitting(false);
    }
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
