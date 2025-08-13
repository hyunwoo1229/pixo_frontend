import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Stepper from "../../components/Reservation/Stepper.jsx";
import ReservationHeader from "../../components/Reservation/ReservationHeader.jsx";
import Calendar from "../../components/Common/Calendar.jsx";
import "../../styles/reservation.css";
import { getReservation, setReservation } from "../../hooks/useReservationSession";

const labelMap = { PROMOTION: "홍보용 촬영", PORTRAIT: "인물 촬영", OBJECT: "사물 촬영" };
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
    let r = getReservation();

    // URL category → 세션 주입
    const q = new URLSearchParams(loc.search);
    if (!r.categoryId) {
      const c = q.get("category");
      if (c && labelMap[c]) { setReservation({ categoryId: c, categoryLabel: labelMap[c] }); r = getReservation(); }
    }
    if (!r.categoryId) { nav("/reserve/type"); return; }

    // URL date → 선택 반영
    const dParam = q.get("date");
    if (dParam) {
      const d = parseYmd(dParam);
      if (d) setSelected(d);
    } else if (r.date) {
      setSelected(new Date(r.date));
    }
    setCat(r);
  }, [nav, loc.search]);

  function goNext() {
    setReservation({ date: selected.toISOString() });
    nav("/reserve/form");
  }

  if (!cat) return null;

  return (
    <div className="reserve-page">
      <ReservationHeader title={`${cat.categoryLabel} 예약`} back onBack={() => nav(-1)} />
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
