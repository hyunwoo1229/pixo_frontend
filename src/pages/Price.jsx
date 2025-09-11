
import React from 'react';
import { Link } from 'react-router-dom';

const pricePackages = [
  {
    name: 'Landscape',
    description: '자연의 광활함과 아름다움을 담아내는 풍경 촬영 패키지입니다.',
    price: '500,000',
    features: ['2시간 촬영', '원본 사진 200컷 이상', '정밀 보정 10컷', '전용 앨범 1권'],
    link: '/reserve/date', 
    category: 'LANDSCAPE',
  },
  {
    name: 'Product',
    description: '제품의 가치를 극대화하여 매출을 증대시키는 전문적인 제품 촬영입니다.',
    price: '450,000',
    features: ['제품 10종 이하', '배경/소품 컨셉 협의', '정밀 보정 20컷', '온라인용/인쇄용 파일 제공'],
    link: '/reserve/date',
    category: 'PRODUCT',
  },
  {
    name: 'Food',
    description: '메뉴판, 광고 등 모든 상업적 목적에 부합하는 음식 촬영 패키지입니다.',
    price: '600,000',
    features: ['메뉴 5종 촬영', '푸드 스타일링 포함', '정밀 보정 15컷', '촬영 컨셉 협의'],
    link: '/reserve/date',
    category: 'FOOD',
  },
];

// ▼▼▼▼▼ [ ✨ export default를 추가했습니다 ] ▼▼▼▼▼
export default function Price() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Price</h1>
        <p className="text-lg text-gray-600">PIXO의 촬영 상품과 가격을 안내합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricePackages.map((pkg) => (
          <div key={pkg.name} className="border rounded-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold">{pkg.name}</h2>
            <p className="text-gray-500 mt-2 flex-grow">{pkg.description}</p>
            <p className="text-4xl font-bold my-6">
              ₩{pkg.price}<span className="text-lg font-medium">~</span>
            </p>
            <ul className="space-y-2 text-gray-600">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link 
              to={`${pkg.link}?category=${pkg.category}`}
              className="mt-8 w-full block text-center bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              예약하기
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}