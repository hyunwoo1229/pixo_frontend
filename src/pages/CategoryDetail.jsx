import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/Common/BackButton';

const CATEGORY_INFO = {
  LANDSCAPE: { label: 'Landscape', description: '풍경 촬영' },
  PRODUCT: { label: 'Product', description: '제품 촬영' },
  FOOD: { label: 'Food', description: '음식 촬영' },
  WEDDING: { label: 'Wedding', description: '웨딩 촬영' },
  FASHION: { label: 'Fashion', description: '패션 화보 촬영' },
  CAR: { label: 'Car', description: '차량 촬영' },
  DRONE_LANDSCAPE: { label: 'Drone Landscape', description: '드론 풍경 촬영' },
};

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [mainPhotos, setMainPhotos] = useState([]);
  const [generalPhotos, setGeneralPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryInfo = CATEGORY_INFO[categoryId] || { label: '카테고리', description: '카테고리 설명' };

  useEffect(() => {
    const fetchCategoryPhotos = async () => {
      if (!categoryId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/photo/category-detail/${categoryId}`);
        
        if (data) {
          setMainPhotos(data.mainPhotos || []);
          setGeneralPhotos(data.generalPhotos || []);
        } else {
          setMainPhotos([]);
          setGeneralPhotos([]);
        }

      } catch (error) {
        console.error(`${categoryId} 카테고리 사진을 불러오는 데 실패했습니다.`, error);
        setMainPhotos([]);
        setGeneralPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryPhotos();
  }, [categoryId]);

  const handleReserveClick = () => {
    navigate(`/reserve/date?category=${categoryId}`);
  };

  const hasNoPhotos = !loading && mainPhotos.length === 0 && generalPhotos.length === 0;

  const representativePhoto = mainPhotos.length > 0 ? mainPhotos[0] : null;

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col">
      {/* 1. 헤더 */}
      <div className="relative flex items-center justify-center p-4 border-b">
        <BackButton onClick={() => navigate(-1)} className="absolute left-4" />
        <h1 className="text-xl font-bold">{categoryInfo.label}</h1>
      </div>

      {/* 2. 컨텐츠 영역 */}
      <div className="flex-grow flex flex-col">
        {/* 상단 설명 */}
        <p className="text-lg text-center text-gray-700 p-4 leading-relaxed">
          {categoryInfo.description}
        </p>

        {loading ? (
          // 로딩 중 스켈레톤
          <div className="p-4 space-y-4">
            <div className="w-full aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-300 animate-pulse" />
              ))}
            </div>
          </div>
        ) : hasNoPhotos ? (
          // 사진이 아예 없을 때
          <div className="flex-grow flex items-center justify-center min-h-[300px] bg-gray-100">
            <p className="text-gray-500">등록된 사진이 없습니다.</p>
          </div>
        ) : (
          // 사진이 있을 때
          <div className="flex-grow flex flex-col">
            
            {/* 2-1. 대표 사진 */}
            {representativePhoto && (
              <div className="w-full aspect-square mb-4 p-4">
                <img
                  src={representativePhoto.imageUrl}
                  alt={`${categoryInfo.label} 대표 사진`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            
            {/* 2-2. 예약하기 버튼 */}
            <div className="p-4 pt-0">
              <button
                onClick={handleReserveClick}
                className="w-full py-3 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
              >
                예약하기
              </button>
            </div>

            {/* 2-3. 일반 사진 그리드 */}
            {generalPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-1 flex-grow mb-4">
                {generalPhotos.map((photo) => (
                  <div key={photo.id} className="aspect-square bg-gray-200">
                    <img
                      src={photo.imageUrl}
                      alt={`photo-${photo.id}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}