import React from "react";
import axios from "axios";

// onRoleUpdate: 부모 컴포넌트에서 목록을 다시 불러오거나 상태를 업데이트하는 함수
export default function AdminMemberList({ loading, error, members, onRoleUpdate }) {
  
  // 권한 변경 핸들러
  const handleRoleChange = async (memberId, newRole) => {
    // 본인을 Admin에서 User로 내리는 것 방지용 확인
    if (!window.confirm(`해당 회원의 권한을 ${newRole}(으)로 변경하시겠습니까?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken"); // 토큰 가져오기
      await axios.patch(
        `/api/admin/members/${memberId}/role`, 
        null, // body 없음
        {
          params: { role: newRole }, // 쿼리 파라미터로 전송
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert("권한이 변경되었습니다.");
      // 변경 후 목록 갱신을 위해 부모 함수 호출
      if (onRoleUpdate) {
        onRoleUpdate();
      }
    } catch (err) {
      console.error(err);
      alert("권한 변경에 실패했습니다.");
    }
  };

  if (loading) return <div className="text-center p-8">회원 정보를 불러오는 중...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!members || members.length === 0) return <div className="text-center p-8">가입된 회원이 없습니다.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border-t border-gray-200 dark:border-zinc-700">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-3 font-semibold">아이디</th>
            <th className="px-4 py-3 font-semibold">이름</th>
            <th className="px-4 py-3 font-semibold">연락처</th>
            <th className="px-4 py-3 font-semibold">권한 관리</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-3">{member.loginId}</td>
              <td className="px-4 py-3">{member.name}</td>
              <td className="px-4 py-3">{member.phoneNumber}</td>
              
              {/* 권한 변경 셀 */}
              <td className="px-4 py-3">
                <select
                  value={member.role} // 현재 역할 (USER or ADMIN)
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  className={`border rounded px-2 py-1 outline-none text-xs font-bold cursor-pointer
                    ${member.role === 'ADMIN' 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}