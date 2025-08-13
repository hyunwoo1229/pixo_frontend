// src/pages/Reservation/Form.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Stepper from "../../components/Reservation/Stepper";
import "../../styles/reservation.css";
import { getReservation, setReservation } from "../../hooks/useReservationSession";

/** 로컬 타임존 기준 YYYY-MM-DD */
function formatDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
/** HH:mm */
function isValidTime(t) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(t);
}

/** JWT에서 memberId 후보 키를 찾아 추출 */
function getMemberIdFromToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    const obj = JSON.parse(atob(payload));
    const cand = obj.memberId ?? obj.id ?? obj.userId ?? obj.sub;
    const num = Number(cand);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

/** 백엔드 DTO 필드명 매핑 */
const FIELDS = {
  category: "photoCategory",
  date: "date",
  time: "startTime",
  location: "location",
  note: "note",
};

export default function Form() {
  const nav = useNavigate();
  const [cat, setCat] = useState(null);
  const [date, setDate] = useState(null);
  const [form, setForm] = useState({ time: "", location: "", note: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const r = getReservation();
    if (!r.categoryId || !r.date) { nav("/reserve/type"); return; }
    setCat(r);
    setDate(new Date(r.date));
  }, [nav]);

  if (!cat || !date) return null;

  const dStr = `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,"0")}.${String(date.getDate()).padStart(2,"0")}`;

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    // 1) 토큰/로그인 체크 (UX 가드)
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다");
      nav("/login", { state: { from: "/reserve/form" }, replace: true });
      return;
    }

    // 2) JWT에서 memberId 추출 (백엔드가 /{memberId} 요구)
    const memberId = getMemberIdFromToken();
    if (!memberId) {
      alert("세션 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
      nav("/login", { replace: true });
      return;
    }

    // 3) 간단 검증
    if (!isValidTime(form.time)) {
      alert("시간 형식은 HH:MM 입니다. 예) 15:30");
      return;
    }
    if (!form.location.trim()) {
      alert("촬영 장소를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        [FIELDS.category]: cat.categoryId,           // 예: "PORTRAIT"
        [FIELDS.date]: formatDateLocal(date),        // 예: "2025-08-20"
        [FIELDS.time]: form.time,                    // 예: "15:30"
        [FIELDS.location]: form.location.trim(),
        [FIELDS.note]: form.note?.trim() || "",
      };

      // ✅ 백엔드 스펙에 맞춰 경로변수로 memberId 전송
      const { data } = await axios.post(`/api/reservation/${memberId}`, payload);
      const code = data.code || data.reservationCode || data.id || "UNKNOWN";

      setReservation({
        result: {
          code,
          categoryLabel: cat.categoryLabel,
          date: dStr,
          time: form.time,
          location: form.location,
          note: form.note || "-",
        },
      });
      nav("/reserve/complete");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "예약 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="reserve-page">
      <header className="reserve-header">
        <button className="back-btn" onClick={() => nav(-1)}>&lt;</button>
        <h1 className="reserve-title">{cat.categoryLabel} 예약</h1>
      </header>

      <Stepper current={3} />

      <section className="section">
        <div className="date-chip">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="emoji"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            style={{ marginRight: 4 }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {dStr}
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">촬영 시작 시간</label>
          <input
  className="input"
  placeholder="ex) 15:30"
  value={form.time}
  onChange={(e)=>setForm(s=>({ ...s, time: e.target.value }))}
  required
  disabled={loading}
/>

          <label className="label">촬영 장소</label>
          <input
            className="input"
            placeholder="ex) 경기도 수원시, 추천 장소 받기"
            value={form.location}
            onChange={(e)=>setForm(s=>({ ...s, location: e.target.value }))}
            required
            disabled={loading}
          />

          <label className="label">기타</label>
          <input
            className="input"
            placeholder="ex) 인원, 하고싶은 말 등"
            value={form.note}
            onChange={(e)=>setForm(s=>({ ...s, note: e.target.value }))}
            disabled={loading}
          />

          <div className="helper">
            예약 후 상세 협의를 위해 입력한 번호로 연락드립니다.
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "처리 중..." : "예약 완료"}
          </button>
        </form>
      </section>
    </div>
  );
}
