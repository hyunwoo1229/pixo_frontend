import React, { useMemo, useState } from "react";

/**
 * Props
 * - value?: Date | null
 * - onChange?: (date: Date) => void
 * - disabledDate?: (date: Date) => boolean   // 비활성화 조건(예: 과거 날짜)
 *
 * 스타일 클래스는 reservation.css 기준:
 * cal, cal-top, nav-btn, cal-title, cal-week, cal-weekday,
 * cal-grid, cal-cell, cal-day, selected
 */

function buildMonth(year, month) {
  // month: 0~11
  const first = new Date(year, month, 1);
  // 월요일 시작(0=일 → 6, 1=월 → 0)
  const firstDay = first.getDay(); // 0~6 (일~토)
  const lead = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);         // 앞 공백
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);         // 7의 배수 채우기
  return cells;
}

export default function Calendar({ value, onChange, disabledDate }) {
  const base = value ?? new Date();
  const [year, setYear] = useState(base.getFullYear());
  const [month, setMonth] = useState(base.getMonth());

  const cells = useMemo(() => buildMonth(year, month), [year, month]);
  const title = `${year}.${String(month + 1).padStart(2, "0")}`;

  function moveMonth(delta) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function isSameDay(a, b) {
    return (
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  return (
    <div className="cal">
      <div className="cal-top">
        <button className="nav-btn" onClick={() => moveMonth(-1)} aria-label="prev">‹</button>
        <div className="cal-title">{title}</div>
        <button className="nav-btn" onClick={() => moveMonth(1)} aria-label="next">›</button>
      </div>

      <div className="cal-week">
        {["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d) => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="cal-cell" />;
          const disabled = typeof disabledDate === "function" ? disabledDate(d) : false;
          const selected = isSameDay(value, d);
          return (
            <button
              key={i}
              className={`cal-cell cal-day ${selected ? "selected" : ""}`}
              disabled={disabled}
              onClick={() => !disabled && onChange?.(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
