
import React from 'react';

export default function Introduce() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About PIXO</h1>
        <p className="text-lg text-gray-600">Find Another in Motion</p>
      </div>

      <div className="mt-12">
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">스튜디오 소개 이미지가 들어갈 공간입니다.</p>
        </div>
        <div className="mt-8 prose prose-lg max-w-none">
          <h2>우리의 이야기</h2>
          <p>
            PIXO는 움직임 속에서 또 다른 당신을 발견하는 것을 목표로 합니다.
            우리는 정적인 사진을 넘어, 당신의 가장 자연스럽고 생동감 넘치는 순간을 포착합니다.
          </p>
          <h2>우리의 철학</h2>
          <p>
            최고의 장비와 전문적인 기술, 그리고 무엇보다 피사체와의 교감을 통해
            단순한 기록이 아닌 하나의 작품을 만들어냅니다.
          </p>
        </div>
      </div>
    </div>
  );
}