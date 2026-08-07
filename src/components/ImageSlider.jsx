import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlider({
  images = [],
  autoPlay = true,
  interval = 6000,
  showCounter = true,
  className = '',
  children,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === count - 1 ? 0 : prev + 1));
  }, [count]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
  }, [count]);

  // 인덱스가 범위를 벗어나지 않도록 보정 (이미지 목록이 바뀌는 경우 대비)
  useEffect(() => {
    setCurrentIndex((prev) => (prev > count - 1 ? 0 : prev));
  }, [count]);

  useEffect(() => {
    if (!autoPlay || paused || count < 2) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, paused, count, interval, goToNext]);

  if (count === 0) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-gray-100 dark:bg-zinc-800 ${className}`}>
        <span className="text-sm tracking-widest text-gray-400 dark:text-zinc-500">NO IMAGE</span>
      </div>
    );
  }

  return (
    <div
      className={`group relative h-full w-full overflow-hidden bg-gray-100 dark:bg-black ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 이미지 레이어 (크로스 페이드 + 느린 줌) */}
      {images.map((image, index) => (
        <div
          key={image.id ?? index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== currentIndex}
        >
          <img
            src={image.imageUrl}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            className={`h-full w-full object-cover ${index === currentIndex ? 'animate-slow-zoom' : ''}`}
          />
        </div>
      ))}

      {/* 가독성을 위한 그라데이션 오버레이
          (모바일은 사진 위에 텍스트가 없으므로 옅게) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 md:from-black/70 md:via-black/25 md:to-black/40" />

      {/* 오버레이 콘텐츠 */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}

      {count > 1 && (
        <>
          {/* 좌우 화살표 (데스크톱에서 hover 시 노출) */}
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="이전 이미지"
            className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/30 p-2.5 text-white/90 backdrop-blur-sm transition hover:border-white hover:bg-white/10 md:block md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="다음 이미지"
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/30 p-2.5 text-white/90 backdrop-blur-sm transition hover:border-white hover:bg-white/10 md:block md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>

          {/* 하단 인디케이터 (얇은 바) */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-3 px-6">
            {showCounter && (
              <span className="text-[11px] font-medium tracking-[0.2em] text-white/70 tabular-nums">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              {images.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  type="button"
                  onClick={() => setCurrentIndex(slideIndex)}
                  aria-label={`${slideIndex + 1}번째 이미지 보기`}
                  className="py-2"
                >
                  <span
                    className={`block h-px transition-all duration-500 ${
                      currentIndex === slideIndex ? 'w-10 bg-white' : 'w-4 bg-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>
            {showCounter && (
              <span className="text-[11px] font-medium tracking-[0.2em] text-white/50 tabular-nums">
                {String(count).padStart(2, '0')}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
