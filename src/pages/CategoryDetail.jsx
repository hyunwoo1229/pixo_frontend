import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/Common/BackButton';

const CATEGORY_INFO = {
  LANDSCAPE: { label: 'Landscape', description: '풍경 촬영' },
  PRODUCT: { label: 'Product', description: '제품 촬영' },
  FOOD: { label: 'Food', description: '음식 촬영' },
  WEDDING: { label: 'Wedding', description: '웨딩 촬영' },
  FASHION: { label: 'Fashion', description: '패션 화보' },
  CAR: { label: 'Car', description: '차량 촬영' },
  DRONE_LANDSCAPE: { label: 'Drone', description: '드론 풍경' },
};

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [allPhotos, setAllPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryInfo = CATEGORY_INFO[categoryId] || { label: '카테고리', description: '카테고리 설명' };

  useEffect(() => {
    const fetchCategoryPhotos = async () => {
      if (!categoryId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/photo/category-detail/${categoryId}`);
        
        // 데이터가 배열이고, 0개 이상일 경우(빈 배열 포함)를 정상 처리
        if (Array.isArray(data)) {
          setAllPhotos(data);
        } else {
          // 예기치 않은 응답일 경우 빈 배열로 처리
          setAllPhotos([]);
        }

      } catch (error) {
        console.error(`${categoryId} 카테고리 사진을 불러오는 데 실패했습니다.`, error);
        // 에러 발생 시에도 빈 배열로 설정
        setAllPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryPhotos();
  }, [categoryId]);

  const handleReserveClick = () => {
    navigate(`/reserve/date?category=${categoryId}`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col">
      <div className="relative flex items-center justify-center p-4 border-b">
        <BackButton onClick={() => navigate(-1)} className="absolute left-4" />
        <h1 className="text-xl font-bold">{categoryInfo.label}</h1>
      </div>

      <div className="flex-grow flex flex-col">
        
        {/* 1. 상단 설명 */}
        <p className="text-lg text-center text-gray-700 p-4 leading-relaxed">
          {categoryInfo.description}
        </p>

        {/* 2. 사진 그리드 (이 영역이 남은 공간을 모두 차지) */}
        <div className="flex-grow">
          {loading ? (
            // 로딩 중: 스켈레톤 그리드
            <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-300 animate-pulse" />
              ))}
            </div>
          ) : allPhotos.length > 0 ? (
            // 사진 있음: 포토 그리드
            <div className="grid grid-cols-3 gap-1">
              {allPhotos.map((photo) => (
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
          ) : (
            // 사진 없음: 안내 메시지
            <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-100">
              <p className="text-gray-500">등록된 사진이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 3. 하단 예약하기 버튼  */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleReserveClick}
            className="w-full py-3 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}