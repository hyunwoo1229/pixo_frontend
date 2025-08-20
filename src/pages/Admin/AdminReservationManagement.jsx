
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminReservationList from "../../components/Admin/AdminReservationList";

export default function AdminReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  // API 호출 함수
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    let url = "/api/admin/reservation";
    const params = {};

    if (searchTerm) {
      if (searchType === "name") {
        url = "/api/admin/reservation/search/name"; //
        params.name = searchTerm;
      } else { // code
        url = "/api/admin/reservation/search/code"; //
        params.code = searchTerm;
      }
    }

    try {
      const { data } = await axios.get(url, { params });
      // 최신순으로 정렬
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReservations(sorted);
    } catch (err) {
      const msg = err.response?.data?.message || "예약 정보를 불러오는 데 실패했습니다.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchType, searchTerm]);

  // 컴포넌트 첫 로드 시 전체 목록 조회
  useEffect(() => {
    fetchReservations();
  }, []); // 의도적으로 빈 배열 사용

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReservations();
  };

  return (
    <div className="px-6 py-6 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-2">전체 예약 조회</h1>
      <p className="text-sm text-gray-600 mb-6">전체 회원의 예약 내역을 조회하고 검색합니다.</p>

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="name">이름</option>
          <option value="code">예약번호</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchType === 'name' ? '예약자 이름으로 검색' : '예약번호로 검색'}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "조회중" : "검색"}
        </button>
      </form>

      {/* 예약 목록 */}
      <AdminReservationList 
        loading={loading}
        error={error}
        reservations={reservations}
      />
    </div>
  );
}