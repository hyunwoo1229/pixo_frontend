import React, { useState, useEffect } from "react"; 
import axios from 'axios';
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
    confirmPassword: "",
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
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 에러 메시지 state 추가
  const [submitError, setSubmitError] = useState("");

  const { isIdChecked, isIdAvailable, message } = useCheckLoginId(form.loginId);

  // 비밀번호와 비밀번호 확인이 일치하는지 감시하는 로직
  useEffect(() => {
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  }, [form.password, form.confirmPassword]);


  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleChange = (e) => {
    setSubmitError("");
    const { name, value, checked } = e.target;

    if (name === "all") {
      setForm((prev) => ({
        ...prev,
        agreements: { all: checked, over14: checked, terms: checked, privacy: checked },
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
    if (!form.phoneNumber || form.phoneNumber.length !== 11) {
      alert("전화번호를 정확히 입력해주세요.");
      return;
    }
    try {
      await axios.post("/api/member/send-code", null, { params: { phoneNumber: form.phoneNumber } });
      setIsCodeSent(true);
      alert("인증번호가 전송되었습니다.");
      setSubmitError("");
    } catch (err) {
      let errorMessage = "인증번호 전송에 실패했습니다.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setSubmitError(errorMessage);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/member/register", form);
      alert("회원가입 성공");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };
  
  // 버튼 활성화/비활성화 로직
  const isButtonDisabled = () => {
    if (!isCodeSent) { // 인증번호 받기 전
      return !form.loginId || !form.password || !form.confirmPassword || !form.name || !form.phoneNumber || !!passwordError || !isIdAvailable || !form.agreements.all;
    } else { // 인증번호 받은 후
      return !form.code || !!passwordError;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col space-y-4">
        <RegisterLogo />
        <AuthInputGroup form={form} handleChange={handleChange} />
        {/* 비밀번호 에러 메시지 표시 */}
        {passwordError && <IdCheckMessage message={passwordError} isValid={false} />}
        
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
        {isCodeSent && (
          <VerificationCodeInput
            value={form.code}
            onChange={handleChange}
          />
        )}
        {submitError && (
          <p className="text-sm text-red-500 text-center">{submitError}</p>
        )}
        {/* SubmitRegisterButton에 disabled 상태 직접 전달 */}
        <SubmitRegisterButton
          onClick={isCodeSent ? handleSubmit : handleSendCode}
          disabled={isButtonDisabled()}
          isCodeSent={isCodeSent}
        />
      </div>
    </div>
  );
}