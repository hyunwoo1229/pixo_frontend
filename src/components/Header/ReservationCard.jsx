import React from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

// D-day 계산 함수 (회의 날짜 기준)
const calculateDday = (dateStr) => {
  const today = new Date();
  const meetingDate = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  meetingDate.setHours(0, 0, 0, 0);
  const diffTime = meetingDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 날짜 형식을 YYYY.MM.DD로 변경하는 함수
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

// 시간 슬롯 포맷을 변경하는 함수 (예: "09-10" -> "09:00 - 10:00")
const formatTimeSlot = (slot) => {
  if (!slot || !slot.includes('-')) return slot;
  return slot.replace('-', ':00 - ') + ':00';
};

export default function ReservationCard({ reservation, isOpen, onToggle }) {
  const dDay = calculateDday(reservation.date);

  const renderDdayText = () => {
    if (dDay < 0) return null;
    if (dDay === 0) return <p className="rh-dday today dark:text-red-400">***오늘이 회의 날짜입니다***</p>;
    return <p className="rh-dday dark:text-yellow-300">***회의 날짜까지 {dDay}일 남았습니다***</p>;
  };

  return (
    <div className="rh-card border border-gray-200 dark:border-zinc-700 
                    bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-md">
      <button 
        className="rh-card-header w-full flex items-center justify-between px-4 py-3 text-left" 
        onClick={onToggle}
      >
        <span>{formatDate(reservation.date)}</span>
        {isOpen ? <IoChevronUp size={22} /> : <IoChevronDown size={22} />}
      </button>

      {isOpen && (
        <div className="rh-card-body border-t border-gray-200 dark:border-zinc-700 px-4 !pt-4 pb-4 space-y-2 text-sm">
          <dl>
            <dt>촬영 종류:</dt>
            <dd className="dark:text-zinc-300">{reservation.shootType}</dd>
          </dl>
          <dl>
            <dt>예약 코드:</dt>
            <dd className="dark:text-zinc-300">{reservation.reservationCode}</dd>
          </dl>
          <dl>
            <dt>회의 날짜:</dt>
            <dd className="dark:text-zinc-300">{formatDate(reservation.date)}</dd>
          </dl>
          <dl>
            <dt>회의 시간:</dt>
            <dd className="dark:text-zinc-300">{formatTimeSlot(reservation.time)}</dd>
          </dl>
          <dl>
            <dt>희망 촬영 날짜:</dt>
            <dd className="dark:text-zinc-300">{reservation.desiredShootDate || "-"}</dd>
          </dl>
          <dl>
            <dt>희망 촬영 장소:</dt>
            <dd className="dark:text-zinc-300">{reservation.location}</dd>
          </dl>
          <dl>
            <dt>기타:</dt>
            <dd className="dark:text-zinc-300">{reservation.notes || "-"}</dd>
          </dl>
          
          {renderDdayText()}

          <div className="rh-contact text-gray-600 dark:text-zinc-400 pt-2">
            <p>문의: 010-4446-5267</p>
            <p>pixo_studio@naver.com</p>
          </div>
        </div>
      )}
    </div>
  );
}