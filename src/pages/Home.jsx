import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageSlider from '../components/ImageSlider'; 

const CATEGORIES = [
  { id: 'WEDDING', label: 'Wedding', mainPhotoCategory: 'WEDDING_MAIN' },
  { id: 'FASHION', label: 'Fashion', mainPhotoCategory: 'FASHION_MAIN' },
  { id: 'PRODUCT', label: 'Product', mainPhotoCategory: 'PRODUCT_MAIN' },
  { id: 'FOOD', label: 'Food', mainPhotoCategory: 'FOOD_MAIN' },
  { id: 'CAR', label: 'Car', mainPhotoCategory: 'CAR_MAIN' },
  { id: 'LANDSCAPE', label: 'Landscape', mainPhotoCategory: 'LANDSCAPE_MAIN' },
  { id: 'DRONE_LANDSCAPE', label: 'Drone Landscape', mainPhotoCategory: 'DRONE_LANDSCAPE_MAIN' },
];

export default function Home() {
  const [representativePhotos, setRepresentativePhotos] = useState([]); // 상단 슬라이더용
  const [categoryPhotos, setCategoryPhotos] = useState([]); // 하단 그리드용
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePhotos = async () => {
      try {
        const [homeDataRes, repPhotosRes] = await Promise.all([
          axios.get('/api/photo/home'), 
          axios.get('/api/photo?category=REPRESENTATIVE') 
        ]);

        setRepresentativePhotos(repPhotosRes.data || []);

        const homeData = homeDataRes.data || {};
        const photos = CATEGORIES.map(cat => ({
          ...cat,
          imageUrl: homeData[cat.mainPhotoCategory]?.imageUrl || '',
        }));
        setCategoryPhotos(photos);

      } catch (error) {
        console.error("홈 화면 사진을 불러오는 데 실패했습니다.", error);
        setRepresentativePhotos([]);
        setCategoryPhotos(CATEGORIES.map(cat => ({ ...cat, imageUrl: '' })));
      } finally {
        setLoading(false);
      }
    };

    fetchHomePhotos();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* 슬라이더 영역 스켈레톤 */}
        <div className="w-full h-[50vh] bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg mb-10" />
        
        {/* 그리드 영역 스켈레톤 */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="space-y-3">
              <div className="w-full pt-[100%] bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full h-auto bg-gray-200 dark:bg-zinc-800">
        {representativePhotos.length > 0 ? (
          <ImageSlider images={representativePhotos} />
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <span className="text-gray-500 dark:text-zinc-400">대표 이미지가 없습니다.</span>
          </div>
        )}
      </div>

      <div className="text-center px-6 py-12 md:py-20 border-b border-gray-200 dark:border-zinc-700">
  <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-gray-700 dark:text-zinc-300 break-keep">
    PIXO는 웨딩, 패션, 제품, 음식, 차, 풍경, 드론 풍경 각 분야의 목적에 최적화된 결과물을 제공하는 전문 스튜디오입니다.
    <br /><br />
    예약 전, 각 패키지의 상세 구성을 확인하시고 궁금한 점이 있다면 1:1 문의에 문의해주세요.
    <br /><br />
    예약 확정 후, 1:1 맞춤 컨설팅을 통해 촬영 장소와 컨셉, 목표를 협의합니다.
  </p>
</div>

      <div className="px-4 py-4 md:px-6 md:py-10">
        <div className="grid grid-cols-2 gap-4">
          {categoryPhotos.map((cat) => (
            <Link to={`/category/${cat.id}`} key={cat.id} className="group block">
              <div className="relative w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-zinc-800" style={{paddingTop: '100%'}}>
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.label}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>
              <p className="mt-3 text-center text-base md:text-lg font-semibold text-gray-800 dark:text-zinc-200">{cat.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 md:px-6 flex justify-end items-center gap-3">
        <a
          href="https://www.instagram.com/studio.pixo?igsh=dTRsaGQ1cmw5b3ls"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm md:text-base font-semibold text-white rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 transition-all duration-300 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>
          Instagram
        </a>
      </div>
    </div>
  );
}