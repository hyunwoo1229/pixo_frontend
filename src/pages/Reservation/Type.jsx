import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Stepper from "../../components/Reservation/Stepper.jsx";
import CategoryGrid from "../../components/Reservation/CategoryGrid.jsx";
import ReservationHeader from "../../components/Reservation/ReservationHeader.jsx";
import "../../styles/reservation.css";
import { setReservation } from "../../hooks/useReservationSession";

// 예약 enum + 커버 매핑
const TYPES = [
  { code: "PROMOTION", label: "홍보용 촬영", cover: "PROMOTION_MAIN" },
  { code: "PORTRAIT",  label: "인물 촬영",   cover: "PORTRAIT_MAIN"  },
  { code: "OBJECT",    label: "사물 촬영",   cover: "OBJECT_MAIN"    },
];

async function fetchCover(coverEnum) {
  try {
    const { data } = await axios.get("/api/photo/", { params: { category: coverEnum } });
    const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return first?.imageUrl || first?.url || first?.image || null;
  } catch { return null; }
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
          image: await fetchCover(t.cover),
        }))
      );
      if (alive) { setCats(withCovers); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  function handleSelect(cat) {
    setReservation({ categoryId: cat.id, categoryLabel: cat.label, date: null });
    navigate("/reserve/date");
  }

  return (
    <div className="reserve-page">
      <ReservationHeader title="예약하기" />
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
