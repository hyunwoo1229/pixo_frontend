import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import RegisterLogo from "../../components/Register/RegisterLogo";
import QuestionForm from "../../components/Question/QuestionForm";
import "../../styles/reservation.css";
import BackButton from "../../components/Common/BackButton.jsx";

export default function QuestionFormPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const token = localStorage.getItem("accessToken");

  const editing = useMemo(() => !!id, [id]);
  const [submitting, setSubmitting] = useState(false);

  const initial =
    editing && state?.item
      ? { title: state.item.title || "", content: state.item.content || "" }
      : { title: "", content: "" };

  async function handleSubmit(values) {
    try {
      if (!token) { alert("로그인이 필요합니다."); nav("/login"); return; }
      setSubmitting(true);
      if (editing) {
        await axios.patch(`/api/questions/${id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("문의가 수정되었습니다.");
      } else {
        await axios.post("/api/questions", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("문의가 등록되었습니다.");
      }
      // 작성 완료 후 이동 경로 수정
      nav("/questions", { replace: true });
    } catch (err) {
      let errorMessage = "요청 처리 중 오류가 발생했습니다.";

      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      alert(errorMessage);
    } finally { 
      setSubmitting(false); 
    }
  }

  return (
    <div className="reserve-page min-h-screen">
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <div className="relative max-w-md mx-auto px-4 py-3">
          <BackButton
            onClick={() => nav(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2"
            size={26}          
            strokeWidth={2.5}
          />
          <h2 className="text-lg font-extrabold text-center dark:text-zinc-100">
            1:1 문의 {editing ? "수정하기" : "작성하기"}
          </h2>
        </div>
      </div>
      <div className="px-6 pt-6 max-w-md mx-auto">
        <RegisterLogo />
        <div className="mt-6">
          <QuestionForm
            initialValues={initial}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => nav("/questions")}
            ui={{ inputClass: "h-12", textareaClass: "min-h-[220px]" }}
          />
        </div>
      </div>
    </div>
  );
}