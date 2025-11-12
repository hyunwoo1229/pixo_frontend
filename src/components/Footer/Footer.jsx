import React from "react";

export default function Footer() {
  return (
    <footer
      className="w-full bg-gray-50 text-gray-900 dark:bg-black dark:text-white"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 2rem)" }}
    >
      <div className="px-5 pt-10 md:pt-12 md:pb-10 md:px-8 md:max-w-screen-sm md:mx-auto md:bg-gray-50 dark:md:bg-black md:rounded-2xl md:my-8">
        {/* 로고 */}
        <h1
          className="text-6xl font-bold"
          style={{ fontFamily: "var(--logo-font)" }}
        >
          PIXO
        </h1>

        {/* 본문 */}
        <div className="mt-8 space-y-4 text-sm leading-6">
          <p className="font-semibold">사업자 정보</p>

          <p>
            상호명: 픽소(PIXO) <span className="opacity-40 mx-2">|</span> 대표자: 강성호
          </p>

          <p>
            사업자 등록 번호: 408-50-00951
          </p>

          <p>주소: 경기도 성남시 중원구 광명로347번길 5, 3층 303호(금광동)</p>

          <p>
            Tel. 010‑4446‑5267 <span className="opacity-40 mx-2">|</span> E‑Mail:
            studio_pixo@naver.com
          </p>

          <div className="pt-2">
            <p className="font-semibold">이메일 무단 수집 거부</p>
            <p className="text-gray-600 dark:text-gray-300">
              본 사이트에 게시된 이메일 주소는 무단 수집을 금지합니다.
            </p>
          </div>

          <div className="pt-2">
            <a href="/terms" className="underline underline-offset-2 mr-3">
              [이용약관]
            </a>
            <a href="/privacy" className="underline underline-offset-2">
              [개인정보 처리방침]
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}