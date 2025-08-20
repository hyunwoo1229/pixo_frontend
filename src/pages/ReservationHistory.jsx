import React from "react";
import ReservationHeader from "../components/Reservation/ReservationHeader";
import ReservationList from "../components/Header/ReservationList";
import "../styles/reservation.css";

export default function ReservationHistory() {
  return (
    <div className="reserve-page">
      <ReservationHeader title="예약 조회" />
      
      <section className="section">
        <ReservationList />
      </section>
    </div>
  );
}
