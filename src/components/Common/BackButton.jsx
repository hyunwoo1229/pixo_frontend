// src/components/common/BackButton.jsx
import React from "react";

/**
 * 공통 뒤로가기 버튼 (SVG 기반)
 * - 기본 크기 24px 아이콘, .back-btn (reservation.css)과 함께 쓰면 44x44 터치영역
 * - 필요 시 className으로 추가 커스텀 가능
 */
export default function BackButton({
  onClick,
  className = "",          // "absolute left-2 top-1/2 -translate-y-1/2" 등 위치 제어용
  size = 24,                // SVG 아이콘 크기
  strokeWidth = 2.5,        // 선 굵기
  ariaLabel = "뒤로가기",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`back-btn ${className}`}
    >
      {/* chevron-left SVG (폰트 의존성 없음) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M15 19L8 12L15 5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
