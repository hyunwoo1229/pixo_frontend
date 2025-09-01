
import React from 'react';
import BackButton from '../components/Common/BackButton';
import { useNavigate } from 'react-router-dom';

export default function Over14() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="relative flex items-center justify-center mb-6">
        <BackButton onClick={() => navigate(-1)} className="absolute left-0" />
        <h1 className="text-2xl font-bold">만 14세 이상 이용 안내</h1>
      </div>
      
      <div className="prose prose-lg">
        <h2>서비스 이용 연령 제한</h2>
        <p>
          PIXO 서비스는 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 따라
          만 14세 미만 아동의 개인정보를 수집하지 않으며, 회원가입 시 법정대리인의 동의가 필요한
          절차를 제공하지 않습니다.
        </p>
        <p>
          따라서 PIXO의 모든 서비스는 만 14세 이상인 사용자만 가입하고 이용할 수 있습니다.
        </p>
        
        <h2>만 14세 이상 확인 동의</h2>
        <p>
          회원가입 시 '만 14세 이상 확인 및 동의' 항목에 체크하는 것은,
          본인이 만 14세 이상임을 확인하고 이에 동의함을 의미합니다.
        </p>
        <p>
          만약 만 14세 미만 사용자가 허위 정보로 가입한 사실이 확인될 경우,
          해당 계정은 사전 통보 없이 삭제될 수 있으며, 서비스 이용에 제재를 받을 수 있습니다.
        </p>
      </div>
    </div>
  );
}