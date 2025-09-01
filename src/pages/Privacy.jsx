import React from 'react';
import BackButton from '../components/Common/BackButton';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="relative flex items-center justify-center mb-6">
        <BackButton onClick={() => navigate(-1)} className="absolute left-0" />
        <h1 className="text-2xl font-bold">개인정보 처리방침</h1>
      </div>
      
      <div className="prose prose-lg">
        <h2>1. 수집하는 개인정보의 항목</h2>
        <p>
          회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 최초 회원가입 당시 아래와 같은 개인정보를 수집하고 있습니다.
        </p>
        <ul>
            <li>필수항목: 아이디, 비밀번호, 이름, 휴대폰 번호</li>
        </ul>

        <h2>2. 개인정보의 수집 및 이용 목적</h2>
        <p>
          회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
            <ul>
                <li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금 정산</li>
                <li>회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별</li>
            </ul>
        </p>

        <p className="mt-8 p-4 bg-gray-100 rounded-lg">
          ... (이하 개인정보 처리방침 내용) ...
        </p>
      </div>
    </div>
  );
}