import React, { useState } from "react";
import axios from "axios";
import RegisterLogo from "../components/Register/RegisterLogo";
import AuthInputGroup from "../components/Register/AuthInputGroup";
import NamePhoneInputGroup from "../components/Register/NamePhoneInputGroup";
import AgreementSection from "../components/Register/AgreementSection";
import SubmitRegisterButton from "../components/Register/SubmitRegisterButton";
import IdCheckMessage from "../components/Register/IdCheckMessage";
import VerificationCodeInput from "../components/Register/VerificationCodeInput";
import useCheckLoginId from "../hooks/useCheckLoginId";

export default function Register() {
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    name: "",
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
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const { isIdChecked, isIdAvailable, message } = useCheckLoginId(form.loginId);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "all") {
      setForm((prev) => ({
        ...prev,
        agreements: {
          all: checked,
          over14: checked,
          terms: checked,
          privacy: checked,
        },
      }));
    } else if (name in form.agreements) {
      const updated = {
        ...form.agreements,
        [name]: checked,
      };
      updated.all = updated.over14 && updated.terms && updated.privacy;
      setForm((prev) => ({ ...prev, agreements: updated }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSendCode = async () => {
    if (!form.phoneNumber || form.phoneNumber.length !== 11) {
      alert("전화번호를 정확히 입력해주세요.");
      return;
    }

    try {
      await axios.post("/api/member/send-code", null, {
        params: { phoneNumber: form.phoneNumber },
      });
      setIsCodeSent(true);
      alert("인증번호가 전송되었습니다.");
    } catch (err) {
      console.error("전송 오류:", err.response?.data || err.message);
      alert("인증번호 전송 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post("/api/member/register", { ...form, skipSave: true }); // 백엔드에서 분기 처리 필요
      setIsCodeVerified(true);
      alert("인증번호 확인 성공");
    } catch (err) {
      console.error(err);
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/member/register", form);
      alert("회원가입 성공");
    } catch (err) {
      console.error(err);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col space-y-4">
        <RegisterLogo />
        <AuthInputGroup form={form} handleChange={handleChange} />
        {isIdChecked && (
          <IdCheckMessage message={message} isValid={isIdAvailable} />
        )}
        <NamePhoneInputGroup form={form} handleChange={handleChange} />
        <AgreementSection
          form={form}
          handleChange={handleChange}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
        />
        {/* ✅ 인증번호 입력란을 가입 버튼 바로 위로 이동 */}
        {isCodeSent && (
          <VerificationCodeInput
            value={form.code}
            onChange={handleChange}
            onVerify={handleVerifyCode}
            isVerified={isCodeVerified}
          />
        )}
        <SubmitRegisterButton
          onClick={isCodeSent ? handleSubmit : handleSendCode}
          phoneNumber={form.phoneNumber}
          isIdAvailable={isIdAvailable}
          isAgreementChecked={form.agreements.all}
          isCodeVerified={isCodeVerified}
          isCodeSent={isCodeSent}
          code={form.code}
        />
      </div>
    </div>
  );
}
