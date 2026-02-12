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
    if (dDay === 0) {
      return (
        <p className="text-center font-bold text-red-500 dark:text-red-400 mt-4">
          ***오늘이 회의 날짜입니다***
        </p>
      );
    }
    return (
      <p className="text-center font-bold text-red-500 dark:text-red-400 mt-4">
        ***회의 날짜까지 {dDay}일 남았습니다***
      </p>
    );
  };

  return (
    <div className="rh-card border border-gray-200 dark:border-zinc-700 
                    bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-xl overflow-hidden mb-4">
      {/* 카드 헤더 */}
      <button 
        className="rh-card-header w-full flex items-center justify-between px-5 py-4 text-left font-semibold" 
        onClick={onToggle}
      >
        <span className="text-lg">{formatDate(reservation.date)}</span>
        {isOpen ? <IoChevronUp size={22} /> : <IoChevronDown size={22} />}
      </button>

      {isOpen && (
        <div className="rh-card-body border-t border-gray-200 dark:border-zinc-700 px-5 pt-6 pb-5 space-y-4 text-sm">
          
          <dl className="flex justify-between items-center">
            <dt className="text-gray-500 dark:text-zinc-400">촬영 종류:</dt>
            <dd className="font-medium">{reservation.shootType}</dd>
          </dl>
          
          <dl className="flex justify-between items-center">
            <dt className="text-gray-500 dark:text-zinc-400">예약 코드:</dt>
            <dd className="font-medium tracking-wider">{reservation.reservationCode}</dd>
          </dl>
          
          <dl className="flex justify-between items-center">
            <dt className="text-gray-500 dark:text-zinc-400">회의 날짜:</dt>
            <dd className="font-medium">{formatDate(reservation.date)}</dd>
          </dl>
          
          <dl className="flex justify-between items-center">
            <dt className="text-gray-500 dark:text-zinc-400">회의 시간:</dt>
            <dd className="font-medium">{formatTimeSlot(reservation.time)}</dd>
          </dl>
          
          <dl className="flex justify-between items-center">
            <dt className="text-gray-500 dark:text-zinc-400">희망 촬영 날짜:</dt>
            <dd className="font-medium">{reservation.desiredShootDate || "test"}</dd>
          </dl>
          
          <dl className="flex justify-between items-center">
            <dt className="text-gray-500 dark:text-zinc-400">희망 촬영 장소:</dt>
            <dd className="font-medium">{reservation.location || "test"}</dd>
          </dl>
          
          <dl className="flex justify-between items-center">
            <dt className="text-gray-500 dark:text-zinc-400">기타:</dt>
            <dd className="font-medium">{reservation.notes || "test"}</dd>
          </dl>
          
          {/* 구분선과 D-day */}
          <div className="pt-2 border-t border-gray-100 dark:border-zinc-700/50">
            {renderDdayText()}
          </div>

          {/* 하단 연락처 정보 */}
          <div className="rh-contact text-gray-500 dark:text-zinc-400 pt-3 text-xs space-y-1">
            <p>문의: 010-4446-5267</p>
            <p>pixo_studio@naver.com</p>
          </div>
        </div>
      )}
    </div>
  );
}