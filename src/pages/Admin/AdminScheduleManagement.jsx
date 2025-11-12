import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Calendar from '../../components/Common/Calendar';
import '../../styles/reservation.css';

const TIME_SLOTS = ["09-10", "12-13", "15-16", "18-19", "21-22"];

function formatDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AdminScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState([]);
  const [adminBlockedTimes, setAdminBlockedTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTimes = useCallback(async (date) => {
    setLoading(true);
    try {
      const dateString = formatDateLocal(date);
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [bookedRes, adminBlockedRes] = await Promise.all([
        axios.get(`/api/reservation/booked-times?date=${dateString}`, config),
        axios.get(`/api/admin/reservation/blocked-times?date=${dateString}`, config)
      ]);
      
      setBookedTimes(bookedRes.data || []);
      setAdminBlockedTimes(adminBlockedRes.data || []);
    } catch (error) {
      console.error("시간 정보를 불러오는 데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimes(selectedDate);
  }, [selectedDate, fetchTimes]);

  const handleTimeSlotClick = async (slot) => {
    const isBlockedByAdmin = adminBlockedTimes.includes(slot);
    const date = formatDateLocal(selectedDate);
    const token = localStorage.getItem("accessToken");
    
    const config = { 
      headers: { Authorization: `Bearer ${token}` },
      data: { date, timeSlot: slot } 
    };

    try {
      if (isBlockedByAdmin) {
        await axios.delete('/api/admin/reservation/block-time', config);
      } else {
        await axios.post('/api/admin/reservation/block-time', { date, timeSlot: slot }, config);
      }
      fetchTimes(selectedDate);
    } catch (error) {
      alert(error.response?.data?.message || '처리 중 오류가 발생했습니다.');
    }
  };

  const dStr = `${selectedDate.getFullYear()}.${String(selectedDate.getMonth()+1).padStart(2,"0")}.${String(selectedDate.getDate()).padStart(2,"0")}`;

  return (
    <div className="reserve-page"> {/* reservation.css (이미 다크모드 적용됨) */}
      <section className="section">
        <h1 className="text-2xl font-bold mb-2 dark:text-zinc-100">일정 관리</h1>
        <p className="text-gray-600 dark:text-zinc-400 mb-6">특정 날짜의 시간을 예약 불가로 설정하거나, 다시 예약 가능으로 변경할 수 있습니다.</p>

        {/* 날짜 선택 섹션 */}
        <div className="date-section">
            {/* section-title-row 등은 reservation.css (이미 다크모드 적용됨) */}
            <div className="section-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" className="emoji" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div className="section-title">날짜 선택</div>
            </div>
            <div className="mt-4"> 
                {/* Calendar 컴포넌트 (이미 다크모드 적용됨) */}
                <Calendar value={selectedDate} onChange={setSelectedDate} className="w-full" />
            </div>
        </div>

        {/* 시간 관리 섹션 (세로로 배치) */}
        <div className="time-section mt-8">
            <div className="section-title-row">
                <svg xmlns="http://www.w3.org/2000/svg" className="emoji" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                <div className="section-title">시간 관리 ({dStr})</div>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {loading ? <div className="text-center py-10 dark:text-zinc-400">로딩 중...</div> : TIME_SLOTS.map(slot => {
                const isUserBooked = bookedTimes.includes(slot) && !adminBlockedTimes.includes(slot);
                const isAdminBlocked = adminBlockedTimes.includes(slot);
                
                let statusText = "예약 가능";
                let statusColor = "text-green-600 dark:text-green-400";
                let buttonClass = "bg-white border-gray-300 hover:border-gray-400 dark:bg-zinc-800 dark:border-zinc-600 dark:hover:border-zinc-500";
                
                if (isUserBooked) {
                  statusText = "사용자 예약";
                  statusColor = "text-red-600 dark:text-red-400";
                  buttonClass = "bg-gray-100 border-gray-200 text-gray-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-500 cursor-not-allowed";
                } else if (isAdminBlocked) {
                  statusText = "관리자 막음";
                  statusColor = "text-yellow-600 dark:text-yellow-400";
                  buttonClass = "bg-yellow-100 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:hover:bg-yellow-900/50";
                }
                
                return (
                  <button
                    key={slot}
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={isUserBooked}
                    className={`w-full flex justify-between items-center p-3 border rounded-lg transition-colors ${buttonClass}`}
                  >
                    <span className="font-mono text-lg dark:text-zinc-100">{slot.replace('-', ':00 - ')}:00</span>
                    <span className={`text-sm font-bold ${statusColor}`}>{statusText}</span>
                  </button>
                );
              })}
            </div>
        </div>
      </section>
    </div>
  );
}