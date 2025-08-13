import React from "react";
import { Link } from "react-router-dom";

export default function SummaryCard({ result, onHome }) {
  if (!result) return null;
  return (
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
        <button className="primary-btn" onClick={onHome}>홈으로</button>
      </div>
    </div>
  );
}
