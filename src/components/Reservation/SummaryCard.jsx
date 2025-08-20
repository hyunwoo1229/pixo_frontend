import React from "react";
import { Link } from "react-router-dom";

function formatDateKorean(dateString) {
  if (!dateString) return "";
  const parts = dateString.split(".");
  if (parts.length !== 3) return dateString;
  return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
}

export default function SummaryCard({ result, onHome }) {
  if (!result) return null;

  return (
    <div className="summary-card">
      <div className="summary-logo">PIXO</div>
      <p className="summary-main-text">
        <span className="summary-date">{formatDateKorean(result.date)}</span>
        <br />
        예약이 완료되었습니다!
      </p>
      <p className="summary-code">예약 코드: {result.code}</p>
      <p className="summary-lookup-text">
        완료된 예약은 <Link to="/reservation-history" className="summary-link">예약 조회</Link>에서 확인할 수 있습니다.
      </p>
      <div className="summary-details">
        <dl><dt>촬영 종류:</dt><dd>{result.categoryLabel}</dd></dl>
        <dl><dt>촬영 시작 시간:</dt><dd>{result.time}</dd></dl>
        <dl><dt>촬영 장소:</dt><dd>{result.location}</dd></dl>
        <dl><dt>기타:</dt><dd>{result.note || "-"}</dd></dl>
      </div>
      <button className="summary-home-btn" onClick={onHome}>홈으로</button>
    </div>
  );
}
