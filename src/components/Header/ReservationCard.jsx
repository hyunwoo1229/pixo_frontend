import React from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const shootTypeMap = {
  PROMOTION: "홍보용 촬영",
  PORTRAIT: "인물 촬영",
  OBJECT: "사물 촬영",
  // 필요하다면 다른 종류도 추가
};

// D-day 계산 함수
const calculateDday = (dateStr) => {
  const today = new Date();
  const shootDate = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  shootDate.setHours(0, 0, 0, 0);
  const diffTime = shootDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 날짜 형식을 YYYY.MM.DD로 변경하는 함수
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

export default function ReservationCard({ reservation, isOpen, onToggle }) {
  const dDay = calculateDday(reservation.date);

  // ▼▼▼▼▼ D-day 텍스트를 조건에 따라 생성하는 함수 ▼▼▼▼▼
  const renderDdayText = () => {
    if (dDay < 0) {
      return null; // 예약일이 지났으면 아무것도 표시하지 않음
    }
    if (dDay === 0) {
      return <p className="rh-dday today">***오늘이 촬영일입니다***</p>;
    }
    return (
      <p className="rh-dday">
        ***예약일까지 {dDay}일 남았습니다***
      </p>
    );
  };

  // DB 값(e.g., "PROMOTION")을 한글(e.g., "홍보용 촬영")로 변환
  const koreanShootType = shootTypeMap[reservation.shootType] || reservation.shootType;

  return (
    <div className="rh-card">
      <button className="rh-card-header" onClick={onToggle}>
        <span>{formatDate(reservation.date)}</span>
        {isOpen ? <IoChevronUp size={22} /> : <IoChevronDown size={22} />}
      </button>
      {isOpen && (
        <div className="rh-card-body">
          <dl>
            <dt>촬영 종류:</dt>
            {/* ▼▼▼▼▼ 한글로 변환된 값을 사용합니다. ▼▼▼▼▼ */}
            <dd>{koreanShootType}</dd>
          </dl>
          <dl>
            <dt>예약 코드:</dt>
            <dd>{reservation.reservationCode}</dd>
          </dl>
          <dl>
            <dt>촬영 시작 시간:</dt>
            <dd>{reservation.time}</dd>
          </dl>
          <dl>
            <dt>촬영 장소:</dt>
            <dd>{reservation.location}</dd>
          </dl>
          <dl>
            <dt>기타:</dt>
            <dd>{reservation.notes || "-"}</dd>
          </dl>
          
          {renderDdayText()}

          <div className="rh-contact">
            <p>문의: 010-XXXX-XXXX</p>
            <p>XXXX@XXXX.com</p>
          </div>
        </div>
      )}
    </div>
  );
}
