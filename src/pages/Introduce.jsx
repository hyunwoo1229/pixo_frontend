import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  { id: 'LANDSCAPE', label: 'Landscape', mainPhotoCategory: 'LANDSCAPE_MAIN' },
  { id: 'PRODUCT', label: 'Product', mainPhotoCategory: 'PRODUCT_MAIN' },
  { id: 'FOOD', label: 'Food', mainPhotoCategory: 'FOOD_MAIN' },
  { id: 'WEDDING', label: 'Wedding', mainPhotoCategory: 'WEDDING_MAIN' },
];

export default function Home() {
  const [mainPhoto, setMainPhoto] = useState(''); 
  const [categoryPhotos, setCategoryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePhotos = async () => {
      try {
        const { data } = await axios.get('/api/photo/home');

        setMainPhoto(data.REPRESENTATIVE?.imageUrl || '');

        const photos = CATEGORIES.map(cat => ({
          ...cat,
          imageUrl: data[cat.mainPhotoCategory]?.imageUrl || '',
        }));
        setCategoryPhotos(photos);

      } catch (error) {
        console.error("홈 화면 사진을 불러오는 데 실패했습니다.", error);
        setMainPhoto('');
        setCategoryPhotos(CATEGORIES.map(cat => ({ ...cat, imageUrl: '' })));
      } finally {
        setLoading(false);
      }
    };

    fetchHomePhotos();
  }, []);

  if (loading) {
    return <div className="text-center p-10">로딩 중...</div>;
  }
  
  const galleryItems = categoryPhotos.slice(0, 4); 

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
      
      <div className="py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          
          <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Pixels Awaken in Motion
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              PIXO는 움직임 속에서 발견하는 당신의 진짜 모습을 담습니다. <br/>
              **풍경, 제품, 음식, 웨딩** 각 분야의 전문성을 바탕으로, <br/>
              당신의 가장 소중하고 생동감 넘치는 순간을 기록합니다.
            </p>
            <p className="font-serif italic text-gray-500 pt-4">
              Pixles Awaken in Motion
            </p>
          </div>

          <div className="space-y-4 text-sm md:text-base">
            <h3 className="font-semibold border-b pb-2 mb-3">
              PIXO 촬영 기본 구성 (4가지 패키지 공통 기준)
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>- 사전 촬영 컨설팅 30분</li>
              <li>- 촬영 시간 2시간 (기본)</li>
              <li>- 원본 파일 전체 제공</li>
              <li>- 정밀 보정본 10장~20장 (패키지별 상이)</li>
              <li>- 온라인용 및 인쇄용 파일 제공</li>
              <li>- 고급 패키지 포장</li>
            </ul>
            
          </div>
        </div>
      </div>
      
      <div className="py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((cat, index) => (
            <Link to={`/category/${cat.id}`} key={cat.id} className="group block">
              <div className="relative w-full overflow-hidden rounded-lg bg-gray-200" style={{paddingTop: '100%'}}>
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.label}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                     <span className="text-gray-500 text-sm">No Photo</span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-center text-sm font-semibold text-gray-800">{cat.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 md:px-6 bg-white flex justify-end">
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