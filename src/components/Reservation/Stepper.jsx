import React from "react";

export default function Stepper({ current = 1 }) {
  const steps = [
    { id: 1, label: "촬영 종류 선택" },
    { id: 2, label: "날짜 선택" },
    { id: 3, label: "예약 정보 입력" },
  ];

  return (
    <div className="stepper stepper-v">
      {steps.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <React.Fragment key={s.id}>
            <div className={`stepv ${done ? "done" : ""} ${active ? "active" : ""}`}>
              <div className="step-dot">{done ? "✓" : s.id}</div>
              <div className="step-label">{s.label}</div>
            </div>
            {i !== steps.length - 1 && (
              <div className={`bar ${current > s.id ? "bar-active" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
