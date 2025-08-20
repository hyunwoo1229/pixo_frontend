import React from "react";

export default function LocationField({ value, onChange, disabled }) {
  return (
    <>
      <label className="label">촬영 장소</label>
      <input
        className="input"
        placeholder="ex) 경기도 수원시, 추천 장소 받기"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
      />
    </>
  );
}
