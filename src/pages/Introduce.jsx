import React from 'react';
import RegisterLogo from '../components/Register/RegisterLogo'; 

export default function Introduce() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      
      <div className="text-center mb-8">
        <RegisterLogo />
      </div>
      
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Pixels Awaken in Motion</h2>
      </div>

      <div className="mt-12 prose prose-lg max-w-none">
        
        <p>
          PIXO는 상업 및 개인 기록 촬영을 전문으로 하는 스튜디오입니다. 
          저희의 핵심 분야는 **풍경, 제품, 음식, 웨딩** 촬영이며, 각 분야의 특성과 
          고객의 목표에 맞춰 최적화된 결과물을 제공합니다.
        </p>

        <p>
          저희는 단순히 '잘 찍는' 것을 넘어, 의뢰 목적에 맞는 결과물을 만드는 것을 최우선으로 합니다. 
          제품 촬영은 매출 증대를 위해, 음식 촬영은 메뉴의 매력을 극대화하기 위해, 
          웨딩 촬영은 그 순간의 감동을 오랫동안 보존하기 위해 기획됩니다. 
          PIXO는 이를 위한 전문 장비와 분야별 노하우를 갖추고 있습니다.
        </p>
        
        <p>
            명확하고 효율적인 촬영 진행을 위해 고객과의 충분한 사전 협의를 중요하게 생각합니다. 
            불필요한 과정을 최소화하고, 신뢰를 바탕으로 최상의 결과물을 약속드립니다.
        </p>
      </div>
    </div>
  );
}