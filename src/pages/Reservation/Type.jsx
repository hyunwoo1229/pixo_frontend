import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Stepper from "../../components/Reservation/Stepper.jsx";
import CategoryGrid from "../../components/Reservation/CategoryGrid.jsx";
import ReservationHeader from "../../components/Reservation/ReservationHeader.jsx";
import "../../styles/reservation.css";
import { setReservation } from "../../hooks/useReservationSession";

const TYPES = [
  { code: "WEDDING",    label: "Wedding",   cover: "WEDDING_MAIN"    }, // 1
  { code: "FASHION", label: "Fashion", cover: "FASHION_MAIN" }, // 2
  { code: "PRODUCT",  label: "Product",   cover: "PRODUCT_MAIN"  }, // 3
  { code: "FOOD",    label: "Food",   cover: "FOOD_MAIN"    }, // 4
  { code: "CAR", label: "Car", cover: "CAR_MAIN" }, // 5
  { code: "LANDSCAPE", label: "Landscape", cover: "LANDSCAPE_MAIN" }, // 6
  { code: "DRONE_LANDSCAPE", label: "Drone Landscape", cover: "DRONE_LANDSCAPE_MAIN" }, // 7 
];

// 서버 응답에서 이미지 필드 통일
const toUrl = (row) => row?.imageUrl || row?.url || row?.image || row?.path || "";

const withOrigin = (u) => u || ""; // 상대 경로를 그대로 사용


// 대표 없으면 기본으로 폴백해서 커버 1장 가져오기
async function fetchCoverImage(code, cover) {
  try {
    const r1 = await axios.get("/api/photo", { params: { category: cover } });
    let arr = Array.isArray(r1.data) ? r1.data : [];
    if (!arr.length) {
      const r2 = await axios.get("/api/photo", { params: { category: code } });
      arr = Array.isArray(r2.data) ? r2.data : [];
    }
    return withOrigin(toUrl(arr[0]));   // 절대주소로 바꿔서 반환
  } catch {
    return "";
  }
}

export default function Type() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const items = await Promise.all(
        TYPES.map(async (t) => ({
          id: t.code,
          label: t.label,
          image: await fetchCoverImage(t.code, t.cover),
        }))
      );
      if (alive) { setCats(items); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  function handleSelect(cat) {
    setReservation({ categoryId: cat.id, categoryLabel: cat.label, date: null });
    navigate("/reservations/date");
  }

  return (
    <div className="reserve-page">
      <ReservationHeader title="예약하기" />
      <Stepper current={1} />
      <section className="section">
        {loading ? (
          <div className="cat-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="cat-card">
                <div className="cat-image w-full aspect-square rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                <div className="cat-caption h-4 mt-2 w-3/4 mx-auto rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
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