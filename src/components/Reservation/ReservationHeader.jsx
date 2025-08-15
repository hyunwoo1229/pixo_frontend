import React from "react";
import BackButton from "../../components/Common/BackButton.jsx";


export default function ReservationHeader({
  title,
  onBack,
  children = null, // 제목 아래 영역(스텝퍼 등)
}) {
  return (
    <header className="reserve-header">
      {/* 제목 라인: 가운데 제목 + 좌측 Back */}
      <div className="relative w-full flex items-center justify-center">
        {onBack && (
          <BackButton
            onClick={onBack}
            className="absolute left-2 top-1/2 -translate-y-1/2"
          />
        )}
        <h1 className="reserve-title text-center">{title}</h1>
      </div>

      {/* 제목 아래: 스텝퍼 중앙 고정 (폭 제한 포함) */}
      {children && (
        <div className="mt-2 w-full flex justify-center">
          <div className="stepper-wrap w-full max-w-[380px] flex justify-center">
            {children}
          </div>
        </div>
      )}
    </header>
  );
}