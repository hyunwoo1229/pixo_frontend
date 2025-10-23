import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold text-center">개인정보 처리방침</h1>
      </div>

      {/* 약관 내용을 표시하는 박스 */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-800">
        <h3 className="text-lg font-semibold text-center mb-6">개인정보 처리방침 (필수)</h3>

        <div className="space-y-6 text-sm">
          <p className="text-xs text-gray-500 text-center">
            최종 수정일: 2025년 9월 11일 | 시행일: 2025년 9월 11일
          </p>
          <p className="text-xs text-gray-600">
            PIXO(이하 '회사')는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 회사는 본 개인정보 처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          </p>

          <div>
            <strong className="block font-medium text-base mb-2">제1조 (개인정보의 수집 항목 및 이용 목적)</strong>
            <p className="mb-2">
              회사는 회원가입, 원활한 고객 상담, 각종 서비스 제공을 위해 아래와 같은 최소한의 개인정보를 수집하고 있습니다.
            </p>
            <div className="space-y-2 pl-4">
                <p><strong>1. 수집 항목</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>필수 항목:</strong> 아이디, 비밀번호(암호화 저장), 이름, 휴대폰 번호</li>
                  <li><strong>자동 수집 정보:</strong> 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                </ul>
                <p><strong>2. 이용 목적</strong></p>
                 <ul className="list-disc list-inside space-y-1">
                  <li>회원 관리: 회원제 서비스 이용에 따른 본인 식별, 가입 의사 확인, 연령 확인, 불만 처리 등 민원 처리, 고지사항 전달</li>
                  <li>서비스 제공: 사진 촬영 예약 및 관련 상담, 1:1 문의 응대 등</li>
                </ul>
            </div>
          </div>

          <div>
            <strong className="block font-medium text-base mb-2">제2조 (개인정보의 처리 및 보유 기간)</strong>
            <p className="mb-2">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
                <li>회원 탈퇴 시, 수집된 개인정보는 즉시 파기합니다.</li>
                <li>단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
                    <ul className="list-circle list-inside ml-4">
                        <li><strong>전자상거래 등에서의 소비자보호에 관한 법률</strong>
                            <ul className="list-disc list-inside ml-4">
                                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                            </ul>
                        </li>
                        <li><strong>통신비밀보호법</strong>
                            <ul className="list-disc list-inside ml-4">
                                <li>로그인 기록: 3개월</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
          </div>

          <div>
            <strong className="block font-medium text-base mb-2">제3조 (개인정보의 파기절차 및 방법)</strong>
             <ul className="list-disc list-inside space-y-1 pl-4">
              <li><strong>파기절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
              <li><strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하고, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
            </ul>
          </div>
          
          <div>
            <strong className="block font-medium text-base mb-2">제4조 (개인정보의 제3자 제공에 관한 사항)</strong>
            <p className="mb-2">
              회사는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다. 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">제공받는 자</th>
                    <th className="p-2 border">제공 목적</th>
                    <th className="p-2 border">제공 항목</th>
                    <th className="p-2 border">보유 및 이용기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">(주)누리고</td>
                    <td className="p-2 border">휴대폰 본인 인증 문자 발송</td>
                    <td className="p-2 border">휴대폰 번호</td>
                    <td className="p-2 border">인증 완료 시 즉시 파기</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <strong className="block font-medium text-base mb-2">제5조 (개인정보 처리 위탁에 관한 사항)</strong>
            <p className="mb-2">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">수탁업체</th>
                    <th className="p-2 border">위탁업무 내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">Google Cloud Platform</td>
                    <td className="p-2 border">클라우드 서버 운영 및 데이터 보관</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">(주)누리고</td>
                    <td className="p-2 border">SMS 발송 업무 대행</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">Google LLC</td>
                    <td className="p-2 border">알림 및 문의 답변 이메일 발송</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
            </p>
          </div>
            
          <div>
            <strong className="block font-medium text-base mb-2">제6조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)</strong>
            <p>
                이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입 해지를 요청할 수도 있습니다. 개인정보 조회, 수정을 위해서는 '개인정보변경'(또는 '회원정보수정' 등)을, 가입 해지(동의 철회)를 위해서는 '회원탈퇴'를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다. 혹은 개인정보 보호책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.
            </p>
          </div>

          <div>
            <strong className="block font-medium text-base mb-2">제조 (개인정보 처리방침 변경)</strong>
            <p>
              현 개인정보 처리방침 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일 전부터 홈페이지의 '공지사항'을 통해 고지할 것입니다.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}