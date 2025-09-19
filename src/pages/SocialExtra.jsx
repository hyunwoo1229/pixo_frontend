import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import RegisterLogo from "../components/Register/RegisterLogo";
import NamePhoneInputGroup from "../components/Register/NamePhoneInputGroup";
import VerificationCodeInput from "../components/Register/VerificationCodeInput";
import SubmitRegisterButton from "../components/Register/SubmitRegisterButton";
import AgreementSection from "../components/Register/AgreementSection";

export default function SocialExtra() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");
  const nameParam = decodeURIComponent(params.get("name") || "");

  const [form, setForm] = useState({
    name: nameParam === "betaName" ? "" : nameParam,
    phoneNumber: "",
    code: "",
    agreements: {
      all: false,
      over14: false,
      terms: false,
      privacy: false,
    },
  });

  const [isExpanded, setIsExpanded] = useState(true);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");

  // ▼▼▼▼▼ [수정] 전화번호 중복 및 길이 확인 로직 강화 ▼▼▼▼▼
  useEffect(() => {
    const phoneNumber = form.phoneNumber;
    
    // 입력이 없을 때는 메시지를 초기화합니다.
    if (!phoneNumber) {
      setIsPhoneAvailable(false);
      setPhoneMessage("");
      return;
    }
    
    // 길이가 11자리가 아니면, API 호출 없이 즉시 메시지를 설정하고 비활성화합니다.
    if (phoneNumber.length !== 11) {
      setIsPhoneAvailable(false);
      setPhoneMessage("휴대폰 번호 11자리를 정확히 입력해주세요.");
      return;
    }
    
    // 0.5초 디바운싱 (길이가 11자리일 때만 실행)
    const handler = setTimeout(async () => {
      try {
        await axios.get(`/api/member/check-phone?phoneNumber=${phoneNumber}`);
        setIsPhoneAvailable(true);
        setPhoneMessage("사용 가능한 전화번호입니다.");
      } catch (err) {
        setIsPhoneAvailable(false);
        if (err.response?.status === 409) {
          setPhoneMessage("이미 가입된 전화번호입니다.");
        } else {
          setPhoneMessage("전화번호 확인 중 오류가 발생했습니다.");
        }
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [form.phoneNumber]);
  // ▲▲▲▲▲ [수정] 완료 ▲▲▲▲▲

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setMessage("");
    if(name === "phoneNumber") setPhoneMessage("");

    if (name === "all") {
      const allChecked = checked;
      setForm((prev) => ({
        ...prev,
        agreements: {
          all: allChecked,
          over14: allChecked,
          terms: allChecked,
          privacy: allChecked,
        },
      }));
    } else if (name in form.agreements) {
      const updated = { ...form.agreements, [name]: checked };
      updated.all = updated.over14 && updated.terms && updated.privacy;
      setForm((prev) => ({ ...prev, agreements: updated }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSendCode = async () => {
    try {
      await axios.post("/api/member/send-code", null, {
        params: { phoneNumber: form.phoneNumber },
      });
      setIsCodeSent(true);
      setMessage("인증번호가 전송되었습니다.");
    } catch (err) {
      let errorMessage = "인증번호 전송에 실패했습니다.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setMessage(errorMessage);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/member/update-extra", form, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("name", form.name);

      alert("추가 정보 입력이 완료되었습니다.");
      navigate("/");
    } catch (err) {
      let errorMessage = "추가 정보 업데이트에 실패했습니다.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setMessage(errorMessage);
    }
  };
  
  const isButtonDisabled = () => {
    if (!isCodeSent) {
      return !form.name || !form.phoneNumber || !form.agreements.all || !isPhoneAvailable;
    } else {
      return !form.code;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col space-y-4">
        <RegisterLogo />
        <h2 className="text-xl font-bold text-center -mt-4">추가 정보 입력</h2>
        <p className="text-sm text-center text-gray-600 -mt-2">
          원활한 서비스 이용을 위해 이름과 연락처를 입력해주세요.
        </p>

        <NamePhoneInputGroup form={form} handleChange={handleChange} />
        
        {phoneMessage && (
          <p className={`text-sm px-1 ${isPhoneAvailable ? "text-green-600" : "text-red-500"}`}>
            {phoneMessage}
          </p>
        )}

        <AgreementSection
          form={form}
          handleChange={handleChange}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
        />
        {isCodeSent && (
          <VerificationCodeInput
            value={form.code}
            onChange={handleChange}
          />
        )}
        {message && <p className="text-sm text-red-500 text-center">{message}</p>}
        
        <SubmitRegisterButton
          onClick={isCodeSent ? handleSubmit : handleSendCode}
          disabled={isButtonDisabled()}
          isCodeSent={isCodeSent}
        />
      </div>
    </div>
  );
}