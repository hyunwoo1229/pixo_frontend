import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Stepper from "../../components/Reservation/Stepper";
import ReservationHeader from "../../components/Reservation/ReservationHeader.jsx";
import TimeField from "../../components/Reservation/TimeField.jsx";
import LocationField from "../../components/Reservation/LocationField.jsx";
import NoteField from "../../components/Reservation/NoteField.jsx";
import "../../styles/reservation.css";
import { getReservation, setReservation } from "../../hooks/useReservationSession";

function formatDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Form() {
  const nav = useNavigate();
  const [cat, setCat] = useState(null);
  const [date, setDate] = useState(null);
  const [form, setForm] = useState({ time: "", location: "", note: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const r = getReservation();
    if (!r.categoryId || !r.date) { nav("/reserve/type"); return; }
    setCat(r); setDate(new Date(r.date));
  }, [nav]);

  if (!cat || !date) return null;

  const dStr = `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,"0")}.${String(date.getDate()).padStart(2,"0")}`;

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const token = localStorage.getItem("accessToken");
    if (!token) { 
      alert("로그인이 필요합니다."); 
      nav("/login", { state: { from: "/reserve/form" }, replace: true }); 
      return; 
    }

    if (!form.location.trim()) { alert("촬영 장소를 입력해 주세요."); return; }

    setLoading(true);
    try {
      const payload = {
        shootType: cat.categoryId,
        date: formatDateLocal(date),
        time: form.time,
        location: form.location.trim(),
        notes: form.note.trim(),
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`/api/reservation`, payload, config);
      const code = data.reservationCode || data.code || data.id || "UNKNOWN";
      
      setReservation({
        result: {
          code,
          categoryLabel: cat.categoryLabel,
          date: dStr,
          time: form.time,
          location: form.location.trim(),
          note: form.note.trim() || "-",
        },
      });
      nav("/reserve/complete");
    } catch (err) {
      let errorMessage = "예약 중 오류가 발생했습니다.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      alert(errorMessage);

      if (err.response?.status === 401) {
        nav("/login", { replace: true });
      }
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <div className="reserve-page">
      <ReservationHeader title={`${cat.categoryLabel} 예약`} back onBack={() => nav(-1)} />
      <Stepper current={3} />
      <section className="section">
        <div className="date-chip">
          <svg xmlns="http://www.w3.org/2000/svg" className="emoji" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={{ marginRight: 4 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {dStr}
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <TimeField value={form.time} onChange={(v) => setForm(s => ({ ...s, time: v }))} disabled={loading}/>
          <LocationField value={form.location} onChange={(v) => setForm(s => ({ ...s, location: v }))} disabled={loading}/>
          <NoteField value={form.note} onChange={(v) => setForm(s => ({ ...s, note: v }))} disabled={loading}/>
          <div className="helper">예약 후 상세 협의를 위해 입력한 번호로 연락드립니다.</div>
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "처리 중..." : "예약 완료"}
          </button>
        </form>
      </section>
    </div>
  );
}