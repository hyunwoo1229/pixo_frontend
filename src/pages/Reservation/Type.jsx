// src/pages/Reservation/Type.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Stepper from "../../components/Reservation/Stepper.jsx";
import CategoryGrid from "../../components/Reservation/CategoryGrid.jsx";
import "../../styles/reservation.css";
import { setReservation } from "../../hooks/useReservationSession";

// 예약 선택용 enum 3종 + 커버용 enum 매핑
const TYPES = [
  { code: "PROMOTION", label: "홍보용 촬영", cover: "PROMOTION_MAIN" },
  { code: "PORTRAIT",  label: "인물 촬영",   cover: "PORTRAIT_MAIN"  },
  { code: "OBJECT",    label: "사물 촬영",   cover: "OBJECT_MAIN"    },
];

// 서버에 커버 요청: 대표 카테고리(*_MAIN) 목록의 첫 번째 이미지를 커버로 사용
async function fetchCover(coverEnum) {
  try {
    const { data } = await axios.get("/api/photo/", {
      params: { category: coverEnum }, // 예: PROMOTION_MAIN
    });
    const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return first?.imageUrl || first?.url || first?.image || null;
  } catch {
    return null;
  }
}

export default function Type() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const withCovers = await Promise.all(
        TYPES.map(async (t) => ({
          id: t.code,
          label: t.label,
          image: await fetchCover(t.cover), // 실패 시 null → placeholder
        }))
      );
      if (alive) {
        setCats(withCovers);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  function handleSelect(cat) {
    // 세션에 enum 문자열을 저장(=백엔드로 그대로 보냄)
    setReservation({ categoryId: cat.id, categoryLabel: cat.label, date: null });
    navigate("/reserve/date");
  }

  return (

    <div className="reserve-page">
      <header className="reserve-header">
        <h1 className="reserve-title">예약하기</h1>
      </header>

      <Stepper current={1} />

      <section className="section">
        <h2 className="section-title">촬영 종류 선택</h2>

        {loading ? (
          <div className="cat-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="cat-card">
                <div className="cat-image skeleton" />
                <div className="cat-caption skeleton-text" />
              </div>
            ))}
          </div>
        ) : (
          <CategoryGrid items={cats} onSelect={handleSelect} />
        )}
      </section>
    </div>
  );
}
