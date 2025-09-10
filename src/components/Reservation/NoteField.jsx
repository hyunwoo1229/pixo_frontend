import React from "react";

export default function NoteField({ value, onChange, disabled }) {
  return (
    <>
      <label className="label">기타</label>
      <input
        className="input"
        placeholder="ex) 인원, 하고싶은 말 등"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </>
  );
}
