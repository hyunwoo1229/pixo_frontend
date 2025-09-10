
import React from "react";
import { Link } from "react-router-dom";

function formatTimeSlot(slot) {
  if (!slot || !slot.includes('-')) return slot;
  return slot.replace('-', ':00 - ') + ':00';
}

export default function SummaryCard({ result, onHome }) {
  if (!result) return null;

  return (
    <div className="summary-card">
      <div className="summary-logo">PIXO</div>
      <p className="summary-main-text">
        회의 예약이 완료되었습니다!
      </p>
      <p className="summary-code">예약 코드: {result.code}</p>
      <p className="summary-lookup-text">
        완료된 예약은 <Link to="/reservation-history" className="summary-link">예약 조회</Link>에서 확인할 수 있습니다.
      </p>
      <div className="summary-details">
        <dl><dt>촬영 종류:</dt><dd>{result.categoryLabel}</dd></dl>
        <dl><dt>회의 날짜:</dt><dd>{result.date}</dd></dl>
        <dl><dt>회의 시간:</dt><dd>{formatTimeSlot(result.time)}</dd></dl>
        <dl><dt>희망 촬영 날짜:</dt><dd>{result.desiredShootDate}</dd></dl>
        <dl><dt>희망 촬영 장소:</dt><dd>{result.location}</dd></dl>
        <dl><dt>기타:</dt><dd>{result.note || "-"}</dd></dl>
      </div>
      <button className="summary-home-btn" onClick={onHome}>홈으로</button>
    </div>
  );
}