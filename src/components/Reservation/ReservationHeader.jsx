import React from "react";

export default function ReservationHeader({ title, back, onBack }) {
  return (
    <header className="reserve-header">
      {back ? <button className="back-btn" onClick={onBack}>←</button> : null}
      <h1 className="reserve-title">{title}</h1>
    </header>
  );
}
