import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/reservation.css";
import ReservationHeader from "../../components/Reservation/ReservationHeader.jsx";
import SummaryCard from "../../components/Reservation/SummaryCard.jsx";
import Stepper from "../../components/Reservation/Stepper.jsx";
import { getReservation } from "../../hooks/useReservationSession";

export default function Complete() {
  const nav = useNavigate();
  const r = getReservation();
  const result = r?.result;

  if (!result) {
    nav("/reservations/type");
    return null;
  }

  return (
    <div className="reserve-page">
      <ReservationHeader title={`${result.categoryLabel} 예약`} />
      <Stepper current={4} />
      
      <section className="section">
        <SummaryCard result={result} onHome={() => nav("/")} />
      </section>
    </div>
  );
}
