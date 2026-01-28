import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReservationCard from "./ReservationCard";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCardId, setOpenCardId] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`/api/reservations/me`);
        
        const sortedData = response.data.sort((a, b) => {

          return new Date(b.date) - new Date(a.date);
        });
        
        setReservations(sortedData);

      } catch (err) {
        if (err.response?.status === 401) {
            setError("로그인이 필요합니다. 로그인 후 이용해주세요.");
        } else {
            setError("예약 정보를 불러오는 데 실패했습니다.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleToggle = (id) => {
    setOpenCardId(openCardId === id ? null : id);
  };

  if (loading) {
    return <div className="text-center p-8 dark:text-zinc-400">예약 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 dark:text-red-400">{error}</div>;
  }

  if (reservations.length === 0) {
    return <div className="text-center p-8 dark:text-zinc-400">예약 내역이 없습니다.</div>;
  }

  return (

    <div className="rh-list space-y-4">
      {reservations.map((res) => (
        <ReservationCard
          key={res.id}
          reservation={res}
          isOpen={openCardId === res.id}
          onToggle={() => handleToggle(res.id)}
        />
      ))}
    </div>
  );
}