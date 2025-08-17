import React from "react";
import ReservationHeader from "../components/Reservation/ReservationHeader";
import ReservationList from "../components/Header/ReservationList";
import "../styles/reservation.css";

export default function ReservationHistory() {
  return (
    <div className="reserve-page">
      {/* ▼▼▼▼▼ back 속성과 onBack 핸들러를 제거합니다. ▼▼▼▼▼ */}
      <ReservationHeader title="예약 조회" />
      
      <section className="section">
        <ReservationList />
      </section>
    </div>
  );
}
