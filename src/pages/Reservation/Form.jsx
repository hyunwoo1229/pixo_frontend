import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Stepper from "../../components/Reservation/Stepper";
import ReservationHeader from "../../components/Reservation/ReservationHeader.jsx";
import "../../styles/reservation.css";
import { getReservation, setReservation } from "../../hooks/useReservationSession";

const TIME_SLOTS = ["09-10", "12-13", "15-16", "18-19", "21-22"];

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

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      nav("/login");
      return; 
    }

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

    // handleSubmit 내부의 유효성 검사는 그대로 유지하여 최종 확인
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

      const { data } = await axios.post(`/api/reservation`, payload);

      const dStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
      
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

  const dStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

  const now = new Date();
  const isToday = date.getFullYear() === now.getFullYear() &&
                  date.getMonth() === now.getMonth() &&
                  date.getDate() === now.getDate();
  const currentHour = now.getHours();

  // 필수 필드 중 하나라도 비어있으면 true가 됩니다.
  const isFormInvalid = !form.time || !form.desiredShootDate || !form.location;

  return (
    <div className="reserve-page">
      <ReservationHeader title={`${cat.categoryLabel} 촬영 예약`} onBack={() => nav(-1)} />
      <Stepper current={3} />
      <section className="section">
        <form className="form" onSubmit={handleSubmit}>
          <div>
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
              <div className="text-center p-4 dark:text-zinc-400">회의 시간 정보 로딩 중...</div>
            ) : (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedTimes.includes(slot);
                  let isPast = false;
                  if (isToday) {
                    const slotStartHour = parseInt(slot.split('-')[0]);
                    if (slotStartHour <= currentHour) {
                      isPast = true;
                    }
                  }
                  const isSelected = form.time === slot;
                  
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked || isPast}
                      onClick={() => setForm(s => ({ ...s, time: slot }))}
                      className={`py-2 border rounded-lg text-sm transition-colors 
                        ${(isBooked || isPast) 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500' 
                          : ''} 
                        ${isSelected 
                          ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                          : 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500'}
                      `}
                    >
                      {slot.replace('-', ':00 - ')}:00
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="space-y-4 mt-6">
            <div>
              <label className="label block mb-1 text-sm text-gray-700 dark:text-zinc-400">희망 촬영 날짜</label>
              <input
                className="input w-full h-11 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm
                           bg-white dark:bg-zinc-800 
                           focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ex) 10월 15일, 11월 첫째 주, 12월 초"
                value={form.desiredShootDate}
                onChange={(e) => setForm(s => ({ ...s, desiredShootDate: e.target.value }))}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="label block mb-1 text-sm text-gray-700 dark:text-zinc-400">희망 촬영 장소</label>
              <input
                className="input w-full h-11 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm
                           bg-white dark:bg-zinc-800 
                           focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ex) 서울, 경기도 수원, 미정"
                value={form.location}
                onChange={(e) => setForm(s => ({ ...s, location: e.target.value }))}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="label block mb-1 text-sm text-gray-700 dark:text-zinc-400">기타</label>
              <input
                className="input w-full h-11 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm
                           bg-white dark:bg-zinc-800 
                           focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ex) 인원, 하고싶은 말 등"
                value={form.note}
                onChange={(e) => setForm(s => ({ ...s, note: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>

          <div className="helper">예약 후 회의를 위해 예약 날짜와 시간에 연락드립니다.</div>

          <button className="primary-btn" type="submit" disabled={loading || isFormInvalid}>
            {loading ? "처리 중..." : "예약 완료"}
          </button>
        </form>
      </section>
    </div>
  );
}