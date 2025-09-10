import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Stepper from "../../components/Reservation/Stepper";
import ReservationHeader from "../../components/Reservation/ReservationHeader.jsx";
import LocationField from "../../components/Reservation/LocationField.jsx";
import NoteField from "../../components/Reservation/NoteField.jsx";
import DesiredShootDateField from "../../components/Reservation/DesiredShootDateField.jsx";
import "../../styles/reservation.css";
import { getReservation, setReservation } from "../../hooks/useReservationSession";

const TIME_SLOTS = ["09:00 - 10:00", "12:00 - 13:00", "15:00 - 16:00", "18:00 - 19:00", "21:00 - 22:00"];

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
  const [form, setForm] = useState({
    time: "",
    desiredShootDate: "",
    location: "",
    note: ""
  });
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeLoading, setTimeLoading] = useState(true);

  useEffect(() => {
    const r = getReservation();
    if (!r.categoryId || !r.date) { nav("/reserve/type"); return; }

    const meetingDate = new Date(r.date);
    setCat(r);
    setDate(meetingDate);

    const fetchBookedTimes = async () => {
      try {
        const dateString = formatDateLocal(meetingDate);
        const response = await axios.get(`/api/reservation/booked-times?date=${dateString}`);
        setBookedTimes(response.data);
      } catch (error) {
        console.error("예약된 회의 시간 정보를 불러오는 데 실패했습니다.", error);
      } finally {
        setTimeLoading(false);
      }
    };
    fetchBookedTimes();
  }, [nav]);

  if (!cat || !date) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!form.desiredShootDate) { alert("희망 촬영 날짜를 입력해 주세요."); return; }
    if (!form.time) { alert("회의 시간을 선택해 주세요."); return; }
    if (!form.location) { alert("촬영 장소를 입력해 주세요."); return; }

    setLoading(true);
    try {
      const payload = {
        shootType: cat.categoryId,
        date: formatDateLocal(date),
        time: form.time,
        desiredShootDate: form.desiredShootDate,
        location: form.location,
        notes: form.note,
      };

      const { data } = await axios.post(`/api/reservation`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });

      const dStr = `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,"0")}.${String(date.getDate()).padStart(2,"0")}`;
      
      setReservation({
        result: {
          code: data.reservationCode || "UNKNOWN",
          categoryLabel: cat.categoryLabel,
          desiredShootDate: form.desiredShootDate,
          date: dStr,
          time: form.time,
          location: form.location,
          note: form.note || "-",
        },
      });
      nav("/reserve/complete");
    } catch (err) {
      let errorMessage = "예약 중 오류가 발생했습니다.";
      if (err.response?.data?.message) {
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

  const dStr = `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,"0")}.${String(date.getDate()).padStart(2,"0")}`;

  return (
    <div className="reserve-page">
      <ReservationHeader title={`${cat.categoryLabel} 촬영 예약`} back onBack={() => nav(-1)} />
      <Stepper current={3} />
      <section className="section">
        <form className="form" onSubmit={handleSubmit}>
          <div className="section-title-row">
            <svg xmlns="http://www.w3.org/2000/svg" className="emoji" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div className="section-title">{dStr}</div>
          </div>

          {timeLoading ? (
            <div className="text-center p-4">회의 시간 정보 로딩 중...</div>
          ) : (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {TIME_SLOTS.map((slot) => {
                const slotValue = slot.substring(0, 5);
                const isBooked = bookedTimes.includes(slotValue);
                const isSelected = form.time === slotValue;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setForm(s => ({ ...s, time: slotValue }))}
                    className={`py-2 border rounded-lg text-sm transition-colors ${isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''} ${isSelected ? 'bg-black text-white border-black' : 'hover:border-gray-400'}`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
          
          {/* ▼▼▼▼▼ [ ✨ 이 부분에 빈 div를 추가하여 간격을 만듭니다 ] ▼▼▼▼▼ */}
          <div className="h-2" /> 
          
          <DesiredShootDateField 
            value={form.desiredShootDate} 
            onChange={(e) => setForm(s => ({ ...s, desiredShootDate: e.target.value }))}
            disabled={loading}
          />
          <LocationField 
            value={form.location} 
            onChange={(e) => setForm(s => ({ ...s, location: e.target.value }))}
            disabled={loading}
          />
          <NoteField 
            value={form.note} 
            onChange={(e) => setForm(s => ({ ...s, note: e.target.value }))}
            disabled={loading}
          />

          <div className="helper">예약 후 상세 협의를 위해 입력한 번호로 연락드립니다.</div>
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "처리 중..." : "예약 완료"}
          </button>
        </form>
      </section>
    </div>
  );
}