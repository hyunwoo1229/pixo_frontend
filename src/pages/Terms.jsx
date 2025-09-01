
import React from 'react';
import BackButton from '../components/Common/BackButton';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="relative flex items-center justify-center mb-6">
        <BackButton onClick={() => navigate(-1)} className="absolute left-0" />
        <h1 className="text-2xl font-bold">이용약관</h1>
      </div>
      
      <div className="prose prose-lg">
        <h2>제1조 (목적)</h2>
        <p>
          본 약관은 PIXO 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>

        <h2>제2조 (정의)</h2>
        <p>
          본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
          <ol>
            <li>"서비스"라 함은 PIXO 웹사이트 및 관련 제반 서비스를 의미합니다.</li>
            <li>"회원"이라 함은 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
          </ol>
        </p>
        
        <p className="mt-8 p-4 bg-gray-100 rounded-lg">
          ... (이하 약관 내용) ...
        </p>
      </div>
    </div>
  );
}