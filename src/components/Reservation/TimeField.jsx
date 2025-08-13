import React from "react";

export default function TimeField({ value, onChange, disabled }) {
  return (
    <>
      <label className="label">촬영 시작 시간</label>
      <input
        className="input"
        placeholder="ex) 15:30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
      />
    </>
  );
}
