import React from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const shootTypeMap = {
  PROMOTION: "홍보용 촬영",
  PORTRAIT: "인물 촬영",
  OBJECT: "사물 촬영",
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

export default function AdminReservationCard({ reservation, isOpen, onToggle }) {
  const koreanShootType = shootTypeMap[reservation.shootType] || reservation.shootType;

  return (
    <div className="border rounded-md">
      <button 
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={onToggle}
      >
        {/* ▼▼▼▼▼ 이 부분이 수정되었습니다 ▼▼▼▼▼ */}
        <div className="font-semibold flex items-center gap-2 flex-wrap">
          <span>{formatDate(reservation.date)}</span>
          <span className="opacity-60">|</span>
          <span>{reservation.memberName}</span>
          <span className="opacity-60">|</span>
          <span className="font-normal text-gray-500">{reservation.reservationCode}</span>
        </div>
        {/* ▲▲▲▲▲ 이 부분이 수정되었습니다 ▲▲▲▲▲ */}

        {isOpen ? <IoChevronUp size={22} /> : <IoChevronDown size={22} />}
      </button>

      {isOpen && (
        <div className="border-t px-4 py-4 space-y-2 text-sm">
          <dl className="flex">
            <dt className="w-24 font-semibold shrink-0">예약 코드:</dt>
            <dd className="text-gray-700">{reservation.reservationCode}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-24 font-semibold shrink-0">촬영 종류:</dt>
            <dd className="text-gray-700">{koreanShootType}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-24 font-semibold shrink-0">시작 시간:</dt>
            <dd className="text-gray-700">{reservation.time}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-24 font-semibold shrink-0">촬영 장소:</dt>
            <dd className="text-gray-700">{reservation.location}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-24 font-semibold shrink-0">기타:</dt>
            <dd className="text-gray-700">{reservation.notes || "-"}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}