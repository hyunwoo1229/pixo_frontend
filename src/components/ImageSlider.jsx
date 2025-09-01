
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  
  if (!images || images.length === 0) {
    return <div className="aspect-square w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">이미지가 없습니다.</div>;
  }

  const showLeftArrow = images.length > 1 && currentIndex !== 0; // 이미지가 1개보다 많고, 첫 번째가 아닐 때
  const showRightArrow = images.length > 1 && currentIndex !== images.length - 1; // 이미지가 1개보다 많고, 마지막이 아닐 때

  return (
    <div className="relative h-full w-full">
      {/* 이미지 컨테이너 */}
      <div className="w-full h-full rounded-lg overflow-hidden">
        <div
          className="w-full h-full flex transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img key={index} src={image.imageUrl} alt={`Slide ${index}`} className="w-full h-full object-cover flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* 좌우 화살표 버튼 (조건부 렌더링) */}
      {showLeftArrow && (
        <button onClick={goToPrevious} className="absolute top-1/2 left-3 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full focus:outline-none">
          <ChevronLeft size={24} />
        </button>
      )}
      {showRightArrow && (
        <button onClick={goToNext} className="absolute top-1/2 right-3 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full focus:outline-none">
          <ChevronRight size={24} />
        </button>
      )}

      {/* 하단 점 인디케이터 (이미지가 1개 이상일 때만 표시) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                currentIndex === slideIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}