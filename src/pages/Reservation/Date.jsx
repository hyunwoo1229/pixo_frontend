import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Stepper from "../../components/Reservation/Stepper.jsx";
import ReservationHeader from "../../components/Reservation/ReservationHeader.jsx";
import Calendar from "../../components/Common/Calendar.jsx";
import "../../styles/reservation.css";
import { getReservation, setReservation, clearReservation } from "../../hooks/useReservationSession";

const CATEGORY_LABELS = { 
  LANDSCAPE: "Landscape",
  PRODUCT: "Product",
  FOOD: "Food",
  WEDDING: "Wedding",
  FASHION: "Fashion",
  CAR: "Car",
  DRONE_LANDSCAPE: "Drone Landscape" 
};

function parseYmd(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}

export default function DatePick() {
  const nav = useNavigate();
  const loc = useLocation();
  const [selected, setSelected] = useState(null);
  const [cat, setCat] = useState(null);

  useEffect(() => {
    const q = new URLSearchParams(loc.search);
    const categoryFromUrl = q.get("category");
    let currentSession = getReservation();

    // 1. URL에 category가 있고, 이 값이 기존 세션과 다르다면 새로운 예약 시작으로 간주하고 세션을 초기화.
    if (categoryFromUrl && categoryFromUrl !== currentSession.categoryId) {
      clearReservation();
      currentSession = {}; // 비워진 세션으로 변수 업데이트
    }

    // 2. 세션이 비어있지만 URL에 유효한 카테고리 정보가 있다면, 세션을 새로 생성.
    if (!currentSession.categoryId && categoryFromUrl && CATEGORY_LABELS[categoryFromUrl]) {
      const newSessionData = {
        categoryId: categoryFromUrl,
        categoryLabel: CATEGORY_LABELS[categoryFromUrl]
      };
      setReservation(newSessionData);
      currentSession = newSessionData;
    }

    // 3. 최종적으로 세션에 카테고리 정보가 없으면 첫 단계로 보냄.
    if (!currentSession.categoryId) {
      nav("/reservations/type");
      return;
    }

    // 4. 유효한 세션 정보를 state에 저장.
    setCat(currentSession);
    if (currentSession.date) {
      setSelected(new Date(currentSession.date));
    }
    
  }, [nav, loc.search]);

  function goNext() {
    setReservation({ date: selected.toISOString() });
    nav("/reservations/form");
  }

  if (!cat) return null;

  return (
    <div className="reserve-page">
      <ReservationHeader title={`${cat.categoryLabel} 촬영 예약`} onBack={() => nav(-1)} />
      <Stepper current={2} />
      <section className="section">
        <div className="section-title-row">
          <svg xmlns="http://www.w3.org/2000/svg" className="emoji" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h2 className="section-title">날짜를 선택해 주세요</h2>
        </div>
        <Calendar
          value={selected}
          onChange={setSelected}
          disabledDate={(d) => { const t = new Date(); t.setHours(0, 0, 0, 0); return d < t; }}
        />
        <button className="primary-btn" disabled={!selected} onClick={goNext}>다음</button>
      </section>
    </div>
  );
}