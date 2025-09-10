import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/Common/BackButton';
import ImageSlider from '../components/ImageSlider';

const CATEGORY_INFO = {
  LANDSCAPE: { label: 'Landscape', description: '풍경 촬영' },
  PRODUCT: { label: 'Product', description: '제품 촬영' },
  FOOD: { label: 'Food', description: '음식 촬영' },
  WEDDING: { label: 'Wedding', description: '웨딩 촬영' },
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
        const mainPhotoCategory = `${categoryId}_MAIN`;
        const mainPhotoRes = await axios.get('/api/photo', { params: { category: mainPhotoCategory } });
        const mainPhotos = mainPhotoRes.data || [];

        const generalPhotoRes = await axios.get('/api/photo', { params: { category: categoryId } });
        const generalPhotos = generalPhotoRes.data || [];

        const combinedPhotos = [
          ...mainPhotos,
          ...generalPhotos.filter(gp => !mainPhotos.some(mp => mp.id === gp.id))
        ];
        
        if (combinedPhotos.length === 0) {
          setAllPhotos([{ imageUrl: '/images/default-category-detail.jpg', id: 'default' }]);
        } else {
          setAllPhotos(combinedPhotos);
        }

      } catch (error) {
        console.error(`${categoryId} 카테고리 사진을 불러오는 데 실패했습니다.`, error);
        setAllPhotos([{ imageUrl: '/images/default-category-detail.jpg', id: 'default' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryPhotos();
  }, [categoryId]);

  const handleReserveClick = () => {
    // navigate(`/reserve/type`, { state: { selectedCategory: categoryId } });
    // Type 페이지를 건너뛰고 바로 Date 페이지로 이동시키기
    navigate(`/reserve/date?category=${categoryId}`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col">
      <div className="relative flex items-center justify-center p-4 border-b">
        <BackButton onClick={() => navigate(-1)} className="absolute left-4" />
        <h1 className="text-xl font-bold">{categoryInfo.label}</h1>
      </div>

      <div className="flex-grow p-4 flex flex-col">
        <p className="text-lg text-center text-gray-700 mb-4 leading-relaxed">{categoryInfo.description}</p>

        <div className="flex-grow w-full aspect-square mb-6">
          {loading ? (
            <div className="w-full h-full bg-gray-300 rounded-lg animate-pulse"></div>
          ) : (
            <ImageSlider images={allPhotos} />
          )}
        </div>

        <button
          onClick={handleReserveClick}
          className="w-full py-3 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
        >
          예약하기
        </button>
      </div>
    </div>
  );
}