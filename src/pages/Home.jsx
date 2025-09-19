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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full h-auto bg-gray-200">
        {mainPhoto ? (
          <img src={mainPhoto} alt="PIXO 대표 이미지" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <span className="text-gray-500">대표 이미지가 없습니다.</span>
          </div>
        )}
      </div>

      <div className="text-center px-6 py-12 md:py-20 bg-white border-b border-gray-200">
        <p className="text-lg md:text-xl leading-relaxed text-gray-700">
          픽소를 어필하는 글, 촬영 방식, <br />
          예약 후 컨택하는 방식 등 <br />
          사용자가 예약 전 알아야 할 정보들
        </p>
      </div>

      <div className="px-4 py-4 md:px-6 md:py-10 bg-white">
        <div className="grid grid-cols-2 gap-4">
          {categoryPhotos.map((cat) => (
            <Link to={`/category/${cat.id}`} key={cat.id} className="group block">
              <div className="relative w-full overflow-hidden rounded-lg bg-gray-200" style={{paddingTop: '100%'}}>
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.label}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>
              <p className="mt-3 text-center text-base md:text-lg font-semibold text-gray-800">{cat.label}</p>
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