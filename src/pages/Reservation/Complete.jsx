import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/reservation.css";
import { getReservation } from "../../hooks/useReservationSession";

export default function Complete() {
  const nav = useNavigate();
  const r = getReservation();
  const result = r?.result;
  if (!result) { nav("/reserve/type"); return null; }

  return (
    <div className="reserve-page">
      <header className="reserve-header">
        <button className="back-btn" onClick={() => nav(-1)}>←</button>
        <h1 className="reserve-title">{result.categoryLabel} 예약</h1>
      </header>

      <section className="section">
        <div className="complete-card">
          <div className="logo-xl">PIXO</div>
          <p className="complete-text">
            {result.date} <span className="green">예약이 완료되었습니다!</span>
          </p>
          <p className="code">예약 코드: {result.code}</p>

          <div className="receipt">
            <dl><dt>촬영 종류:</dt><dd>{result.categoryLabel}</dd></dl>
            <dl><dt>촬영 시작 시간:</dt><dd>{result.time}</dd></dl>
            <dl><dt>촬영 장소:</dt><dd>{result.location}</dd></dl>
            <dl><dt>기타:</dt><dd>{result.note}</dd></dl>
          </div>

          <div className="btn-row">
            <Link to="/reservations/lookup" className="reserve-link">예약 조회</Link>
            <button className="primary-btn" onClick={() => nav("/")}>홈으로</button>
          </div>
        </div>
      </section>
    </div>
  );
}
