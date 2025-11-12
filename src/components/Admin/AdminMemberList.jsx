import React from "react";

export default function AdminMemberList({ loading, error, members }) {
  if (loading) {
    return <div className="text-center p-8">회원 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 dark:text-red-400">{error}</div>;
  }

  if (members.length === 0) {
    return <div className="text-center p-8">가입된 회원이 없습니다.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border-t border-gray-200 dark:border-zinc-700">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-3 font-semibold">아이디</th>
            <th className="px-4 py-3 font-semibold">이름</th>
            <th className="px-4 py-3 font-semibold">연락처</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.loginId} className="border-b border-gray-200 dark:border-zinc-700">
              <td className="px-4 py-3">{member.loginId}</td>
              <td className="px-4 py-3">{member.name}</td>
              <td className="px-4 py-3">{member.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}