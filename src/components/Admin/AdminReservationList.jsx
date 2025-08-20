
import React, { useState } from "react";
import AdminReservationCard from "./AdminReservationCard";

export default function AdminReservationList({ loading, error, reservations }) {
  const [openCardId, setOpenCardId] = useState(null);

  const handleToggle = (id) => {
    setOpenCardId(openCardId === id ? null : id);
  };

  if (loading) {
    return <div className="text-center p-8">예약 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (reservations.length === 0) {
    return <div className="text-center p-8">검색 결과가 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {reservations.map((res) => (
        <AdminReservationCard
          key={res.id}
          reservation={res}
          isOpen={openCardId === res.id}
          onToggle={() => handleToggle(res.id)}
        />
      ))}
    </div>
  );
}