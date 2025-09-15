import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Over14() {
  const navigate = useNavigate();

  // BackButton 컴포넌트 경로 문제를 해결하기 위해 컴포넌트를 내부에 직접 정의합니다.
  const BackButton = () => (
    <button
      onClick={() => navigate(-1)}
      className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="뒤로 가기"
    >
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="relative flex items-center justify-center mb-8">
        <BackButton />
        <h1 className="text-2xl font-bold text-center">만 14세 이상 서비스 이용 동의</h1>
      </div>
      
      {/* 약관 내용을 표시하는 박스 */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-800">
        <h3 className="text-lg font-semibold text-center mb-6">만 14세 이상 서비스 이용 동의 (필수)</h3>
        
        <div className="space-y-4 text-sm">
          <div>
            <strong className="block font-medium">제1조 (목적)</strong>
            <p className="mt-1 text-gray-700">
              본 동의는 PIXO(이하 '회사')가 제공하는 모든 서비스(이하 '서비스')의 회원가입 및 이용 자격을 확인하기 위한 목적으로 합니다.
            </p>
          </div>

          <div>
            <strong className="block font-medium">제2조 (법령 준수)</strong>
            <p className="mt-1 text-gray-700">
              회사는 「개인정보 보호법」 제22조 제6항에 따라 만 14세 미만 아동의 개인정보를 보호하기 위하여, 회원가입 시 법정대리인의 동의를 받는 절차를 별도로 운영하지 않습니다. 이에 따라 서비스는 만 14세 이상의 사용자만이 가입하여 이용할 수 있습니다.
            </p>
          </div>

          <div>
            <strong className="block font-medium">제3조 (연령 확인 및 동의)</strong>
            <ol className="list-decimal list-inside mt-1 space-y-1 text-gray-700">
              <li>본인은 회원가입 신청일 기준으로 만 14세 이상임을 확인합니다.</li>
              <li>본인은 위 연령 조건을 충족하지 않을 경우, 서비스 가입 및 이용이 불가함을 인지하고 있습니다.</li>
              <li>'동의함'을 선택하는 것은, 상기 내용에 대해 충분히 이해하고 본인의 연령이 만 14세 이상임을 자발적으로 확인하며 이에 동의함을 의미합니다.</li>
            </ol>
          </div>

          <div>
            <strong className="block font-medium">제4조 (허위 정보 제공에 대한 책임)</strong>
            <p className="mt-1 text-gray-700">
              만 14세 미만의 사용자가 허위의 정보(나이 등)를 입력하여 회원으로 가입한 사실이 확인될 경우, 회사는 사전 통지 없이 해당 이용자의 회원 자격을 박탈하거나 서비스 이용을 영구적으로 제한할 수 있습니다. 또한, 허위 정보 제공으로 인해 발생하는 모든 법적 문제 및 불이익에 대한 책임은 사용자 본인에게 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}