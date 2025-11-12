import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  const BackButton = () => (
    <button
      onClick={() => navigate(-1)}
      className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full 
                 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
      aria-label="뒤로 가기"
    >
      <svg className="w-6 h-6 text-gray-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 dark:bg-zinc-900 min-h-screen">
      <div className="relative flex items-center justify-center mb-8">
        <BackButton />
        <h1 className="text-2xl font-bold text-center dark:text-zinc-100">이용약관</h1>
      </div>

      <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg 
                    border border-gray-200 dark:border-zinc-700 
                    text-gray-800 dark:text-zinc-200">
        <h3 className="text-lg font-semibold text-center mb-6 dark:text-zinc-100">PIXO 서비스 이용약관 (필수)</h3>

        <div className="space-y-6 text-sm">
          <p className="text-xs text-gray-500 dark:text-zinc-400 text-center">
            최종 수정일: 2025년 9월 11일 | 시행일: 2025년 9월 11일
          </p>
          
          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제1조 (목적)</strong>
            <p className="text-gray-700 dark:text-zinc-300">
              본 약관은 PIXO(이하 '회사')가 제공하는 PIXO 서비스(이하 '서비스')의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>
          
          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제2조 (정의)</strong>
            <ul className="list-decimal list-inside pl-4 space-y-1 text-gray-700 dark:text-zinc-300">
              <li>"서비스"라 함은 구현되는 단말기(PC, 모바일, 태블릿 PC 등의 각종 유무선 장치를 포함)와 상관없이 회원이 이용할 수 있는 PIXO 및 PIXO 관련 제반 서비스를 의미합니다.</li>
              <li>"회원"이라 함은 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
              <li>"아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.</li>
              <li>"게시물"이라 함은 회원이 서비스를 이용함에 있어 서비스상에 게시한 부호, 문자, 음성, 음향, 화상, 동영상 등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 의미합니다.</li>
            </ul>
          </div>
          
          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제3조 (약관의 게시와 개정)</strong>
            <ul className="list-decimal list-inside pl-4 space-y-1 text-gray-700 dark:text-zinc-300">
              <li>회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
              <li>회사는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 '정보통신망법')" 등 관련법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
              <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 제1항의 방식에 따라 그 개정약관의 적용일자 7일 전부터 적용일자 전일까지 공지합니다. 다만, 회원에게 불리한 약관의 개정의 경우에는 30일 전에 공지합니다.</li>
            </ul>
          </div>
          
          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제4조 (회원의 의무)</strong>
            <ul className="list-decimal list-inside pl-4 space-y-1 text-gray-700 dark:text-zinc-300">
              <li>회원은 다음 행위를 하여서는 안 됩니다.
                <ul className="list-disc list-inside ml-4">
                  <li>신청 또는 변경 시 허위 내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제5조 (서비스의 제공 등)</strong>
            <ul className="list-decimal list-inside pl-4 space-y-1 text-gray-700 dark:text-zinc-300">
              <li>회사는 회원에게 아래와 같은 서비스를 제공합니다.
                <ul className="list-disc list-inside ml-4">
                  <li>사진 촬영 예약 및 관련 상담 서비스</li>
                  <li>1:1 문의 게시판 서비스</li>
                  <li>포트폴리오(사진) 제공 서비스</li>
                  <li>기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
                </ul>
              </li>
              <li>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
            </ul>
          </div>
          
          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제6조 (예약의 성립)</strong>
            <p className="text-gray-700 dark:text-zinc-300">
              예약은 회원이 본 약관에 동의하고 회사가 정한 예약 절차를 완료한 시점에 성립됩니다. 예약 완료 시, 회사는 회원에게 예약 코드 등 예약 내용을 통지할 수 있습니다.
            </p>
          </div>

          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제7조 (예약의 취소 및 환불)</strong>
            <ul className="list-decimal list-inside pl-4 space-y-1 text-gray-700 dark:text-zinc-300">
              <li>회원이 예약을 취소하려는 경우, 1:1 문의 또는 이메일을 통해 회사에 취소 요청을 할 수 있습니다.</li>
              <li>회원의 사정으로 예약을 취소하는 경우, 다음의 기준에 따라 환불 수수료가 부과될 수 있습니다.
                <ul className="list-disc list-inside ml-4">
                  <li>촬영 날짜 기준 14일 전까지 취소: 전액 환불</li>
                  <li>촬영 날짜 기준 7일 전까지 취소: 총 결제 금액의 50% 환불</li>
                  <li>촬영 날짜 기준 6일 전 ~ 당일 취소: 환불 불가</li>
                </ul>
              </li>
              <li>회사의 귀책사유로 인해 촬영이 취소되는 경우, 회사는 총 결제 금액을 전액 환불하며, 관련 법규에 따라 회원에게 발생한 손해를 배상할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제8조 (계약해제, 해지 등)</strong>
            <p className="text-gray-700 dark:text-zinc-300">
              회원은 언제든지 서비스 내 "회원탈퇴" 기능을 통하여 이용계약 해지를 신청할 수 있으며, 회사는 관련법 등이 정하는 바에 따라 이를 즉시 처리하여야 합니다.
            </p>
          </div>
          
          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제9조 (책임제한)</strong>
            <ul className="list-decimal list-inside pl-4 space-y-1 text-gray-700 dark:text-zinc-300">
              <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
              <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
              <li>회사는 회원이 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.</li>
            </ul>
          </div>
          
          <div>
            <strong className="block font-medium text-base mb-2 dark:text-zinc-100">제10조 (준거법 및 재판관할)</strong>
            <ul className="list-decimal list-inside pl-4 space-y-1 text-gray-700 dark:text-zinc-300">
              <li>회사와 회원 간에 발생한 분쟁에 대하여는 대한민국법을 준거법으로 합니다.</li>
              <li>회사와 회원 간 발생한 분쟁에 관한 소송은 민사소송법 상의 관할법원에 제소합니다.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}