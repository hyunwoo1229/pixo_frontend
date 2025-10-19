import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

const pricePackagesData = [ 
  {
    name: 'Landscape',
    description: '자연의 아름다움을 담아내는 풍경 촬영 패키지입니다.',
    price: '500,000',
    features: ['2시간 촬영', '원본 사진 200컷 이상', '정밀 보정 10컷', '전용 앨범 1권'],
    link: '/reserve/date', 
    category: 'LANDSCAPE',
    mainPhotoCategory: 'LANDSCAPE_MAIN',
  },
  {
    name: 'Product',
    description: '제품의 가치를 극대화하여 매출을 증대시키는 전문적인 제품 촬영입니다.',
    price: '400,000',
    features: ['제품 10종 이하', '배경/소품 컨셉 협의', '정밀 보정 20컷', '온라인용/인쇄용 파일 제공'],
    link: '/reserve/date',
    category: 'PRODUCT',
    mainPhotoCategory: 'PRODUCT_MAIN',
  },
  {
    name: 'Food',
    description: '메뉴판, 광고 등 모든 상업적 목적에 부합하는 음식 촬영 패키지입니다.',
    price: '400,000',
    features: ['메뉴 5종 촬영', '푸드 스타일링 포함', '정밀 보정 15컷', '촬영 컨셉 협의'],
    link: '/reserve/date',
    category: 'FOOD',
    mainPhotoCategory: 'FOOD_MAIN',
  },
  {
    name: 'Wedding',
    description: '웨딩 촬영 패키지입니다.',
    price: '600,000',
    features: ['총 5시간 밀착 촬영', '고급 미니 앨범 (50p)', '감성 필터/색감 보정본 100컷', '작가 지정 하이라이트 영상 클립 제공'],
    link: '/reserve/date',
    category: 'WEDDING',
    mainPhotoCategory: 'WEDDING_MAIN',
  },
];

export default function Price() {
  const [pricePackages, setPricePackages] = useState(pricePackagesData);
  const [loading, setLoading] = useState(true);

  // Home 컴포넌트와 동일하게 사진 URL을 불러오는 로직 추가
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await axios.get('/api/photo/home');
        
        const updatedPackages = pricePackagesData.map(pkg => ({
          ...pkg,
          imageUrl: data[pkg.mainPhotoCategory]?.imageUrl || null, // 해당 카테고리 이미지 URL 추가
        }));
        
        setPricePackages(updatedPackages);

      } catch (error) {
        console.error("가격 패키지 사진을 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);
  
  if (loading) {
    // 로딩 중이거나 데이터가 로드되지 않은 경우 로딩 메시지 표시
    return <div className="text-center p-10">가격 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Price</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pricePackages.map((pkg) => (
          // flex-col 추가: 사진, 내용, 버튼이 세로로 정렬되도록
          <div key={pkg.name} className="border rounded-lg p-6 flex flex-col"> 
            
            {/* 사진 표시 섹션 추가 */}
            <div className="w-full h-48 bg-gray-200 overflow-hidden rounded-lg mb-4">
              {pkg.imageUrl ? (
                <img 
                  src={pkg.imageUrl} 
                  alt={`${pkg.name} 대표 이미지`} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">이미지 준비 중</span>
                </div>
              )}
            </div>
            
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