// src/components/Reservation/DesiredShootDateField.jsx

import React from "react";

export default function DesiredShootDateField({ value, onChange, disabled }) {
  return (
    <>
      <label className="label">희망 촬영 날짜</label>
      <input
        className="input"
        placeholder="ex) 10월 15일 또는 11월 첫째 주"
        value={value}
        onChange={onChange} // onChange 이벤트는 그대로 전달
        required
        disabled={disabled}
      />
    </>
  );
}