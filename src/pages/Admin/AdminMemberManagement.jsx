
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMemberList from "../../components/Admin/AdminMemberList";

export default function AdminMemberManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // 백엔드 API 호출
        const { data } = await axios.get("/api/admin/member");
        setMembers(data);
      } catch (err) {
        const msg = err.response?.data?.message || "회원 정보를 불러오는 데 실패했습니다.";
        setError(msg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="px-6 py-6 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-2">전체 회원 조회</h1>
      <p className="text-sm text-gray-600 mb-8">가입된 모든 회원의 정보를 확인합니다.</p>
      
      <AdminMemberList 
        loading={loading}
        error={error}
        members={members}
      />
    </div>
  );
}