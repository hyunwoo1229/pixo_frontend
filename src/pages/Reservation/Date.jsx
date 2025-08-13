import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // [DEEPLINK-START] URL 읽기 위해 useLocation 사용 [DEEPLINK-END]
import Stepper from "../../components/Reservation/Stepper.jsx";
import Calendar from "../../components/Common/Calendar.jsx";
import "../../styles/reservation.css";
import { getReservation, setReservation } from "../../hooks/useReservationSession";

// [DEEPLINK-START] URL 딥링크용 헬퍼
const labelMap = { PROMOTION: "홍보용 촬영", PORTRAIT: "인물 촬영", OBJECT: "사물 촬영" };
function parseYmd(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}
// [DEEPLINK-END]

export default function DatePick() {
  const nav = useNavigate();
  const loc = useLocation(); // [DEEPLINK-START] URL 쿼리 사용 [DEEPLINK-END]
  const [selected, setSelected] = useState(null);
  const [cat, setCat] = useState(null);

  useEffect(() => {
    let r = getReservation();

    // [DEEPLINK-START] URL로 category 전달 시 세션에 주입
    const q = new URLSearchParams(loc.search);
    if (!r.categoryId) {
      const c = q.get("category"); // PROMOTION | PORTRAIT | OBJECT
      if (c && labelMap[c]) {
        setReservation({ categoryId: c, categoryLabel: labelMap[c] });
        r = getReservation();
      }
    }
    // [DEEPLINK-END]

    if (!r.categoryId) { nav("/reserve/type"); return; }

    // [DEEPLINK-START] 날짜도 URL로 오면 선택값으로 반영
    const dParam = q.get("date"); // YYYY-MM-DD
    if (dParam) {
      const d = parseYmd(dParam);
      if (d) setSelected(d);
    } else if (r.date) {
      setSelected(new Date(r.date));
    }
    // [DEEPLINK-END]

    setCat(r);
  }, [nav, loc.search]); // [DEEPLINK-START] URL 변경에도 반응하도록 의존성 추가 [DEEPLINK-END]

  function goNext() {
    setReservation({ date: selected.toISOString() });
    nav("/reserve/form");
  }

  if (!cat) return null;

  return (
    <div className="reserve-page">
      <header className="reserve-header">
        <button className="back-btn" onClick={() => nav(-1)}>&lt;</button>
        <h1 className="reserve-title">{cat.categoryLabel} 예약</h1>
      </header>

      <Stepper current={2} />

      <section className="section">
        <div className="section-title-row">
          {/* 📅 이모지 대신 Tabler 스타일 캘린더 SVG */}
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
          >
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
          disabledDate={(d) => {
            const t = new Date(); t.setHours(0, 0, 0, 0);
            return d < t;
          }}
        />

        <button className="primary-btn" disabled={!selected} onClick={goNext}>
          다음
        </button>
      </section>
    </div>
  );
}
