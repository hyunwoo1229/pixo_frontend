import React from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

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

export default function AdminReservationCard({ reservation, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 dark:border-zinc-700 rounded-md">
      <button 
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={onToggle}
      >
        <div className="font-semibold flex items-center gap-2 flex-wrap">
          <span>{formatDate(reservation.date)}</span>
          <span className="opacity-60 dark:opacity-40">|</span>
          <span>{reservation.memberName}</span>
          <span className="opacity-60 dark:opacity-40">|</span>
          <span className="font-normal text-gray-500 dark:text-zinc-400">{reservation.reservationCode}</span>
        </div>
        {isOpen ? <IoChevronUp size={22} /> : <IoChevronDown size={22} />}
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 dark:border-zinc-700 px-4 py-4 space-y-2 text-sm">
          <dl className="flex">
            <dt className="w-28 font-semibold shrink-0">예약 코드:</dt>
            <dd className="text-gray-700 dark:text-zinc-300">{reservation.reservationCode}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-28 font-semibold shrink-0">촬영 종류:</dt>
            <dd className="text-gray-700 dark:text-zinc-300">{reservation.shootType}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-28 font-semibold shrink-0">회의 날짜:</dt>
            <dd className="text-gray-700 dark:text-zinc-300">{formatDate(reservation.date)}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-28 font-semibold shrink-0">회의 시간:</dt>
            <dd className="text-gray-700 dark:text-zinc-300">{formatTimeSlot(reservation.time)}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-28 font-semibold shrink-0">희망 촬영 날짜:</dt>
            <dd className="text-gray-700 dark:text-zinc-300">{reservation.desiredShootDate || "-"}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-28 font-semibold shrink-0">희망 촬영 장소:</dt>
            <dd className="text-gray-700 dark:text-zinc-300">{reservation.location}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-28 font-semibold shrink-0">기타:</dt>
            <dd className="text-gray-700 dark:text-zinc-300">{reservation.notes || "-"}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}