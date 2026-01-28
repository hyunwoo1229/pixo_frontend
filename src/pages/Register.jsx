import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import RegisterLogo from "../components/Register/RegisterLogo";
import AuthInputGroup from "../components/Register/AuthInputGroup";
import NamePhoneInputGroup from "../components/Register/NamePhoneInputGroup";
import AgreementSection from "../components/Register/AgreementSection";
import SubmitRegisterButton from "../components/Register/SubmitRegisterButton";
import IdCheckMessage from "../components/Register/IdCheckMessage";
import VerificationCodeInput from "../components/Register/VerificationCodeInput";
import useCheckLoginId from "../hooks/useCheckLoginId";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
    code: "",
    agreements: { all: false, over14: false, terms: false, privacy: false },
  });

  const [isExpanded, setIsExpanded] = useState(true);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [idLengthError, setIdLengthError] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState("");

  const { isIdChecked, isIdAvailable, message: idMessage } = useCheckLoginId(form.loginId);

  // 전화번호 중복 확인 로직 (훅 없이 직접 구현)
  const [isPhoneChecked, setIsPhoneChecked] = useState(false);
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  
  useEffect(() => {
    const phoneNumber = form.phoneNumber;
    if (!phoneNumber || phoneNumber.length !== 11) {
      setIsPhoneChecked(false);
      setIsPhoneAvailable(false);
      setPhoneMessage("");
      return;
    }
    const handler = setTimeout(async () => {
      try {
        await axios.get(`/api/members/check-phone?phoneNumber=${phoneNumber}`);
        setIsPhoneChecked(true);
        setIsPhoneAvailable(true);
      } catch (err) {
        setIsPhoneChecked(true);
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

  // 아이디 길이 검증
  useEffect(() => {
    if (form.loginId && (form.loginId.length < 4 || form.loginId.length > 20)) {
      setIdLengthError("아이디는 4~20자 사이여야 합니다.");
    } else {
      setIdLengthError("");
    }
  }, [form.loginId]);

  // 비밀번호 길이 검증
  useEffect(() => {
    if (form.password && (form.password.length < 8 || form.password.length > 16)) {
      setPasswordLengthError("비밀번호는 8~16자 사이여야 합니다.");
    } else {
      setPasswordLengthError("");
    }
  }, [form.password]);

  // 비밀번호 일치 확인
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
      setForm((prev) => ({ ...prev, agreements: { all: checked, over14: checked, terms: checked, privacy: checked } }));
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
      await axios.post("/api/members/verification-codes", null, { params: { phoneNumber: form.phoneNumber } });
      setIsCodeSent(true);
      alert("인증번호가 전송되었습니다.");
      setSubmitError("");
    } catch (err) {
      let errorMessage = "인증번호 전송에 실패했습니다.";
      if (err.response?.data?.message) { errorMessage = err.response.data.message; }
      setSubmitError(errorMessage);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/members", form);
      alert("회원가입 성공");
      navigate("/login");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };
  
  const isButtonDisabled = () => {
    if (!isCodeSent) {
      return !form.loginId || !form.password || !form.confirmPassword || !form.name || !form.phoneNumber 
             || !!idLengthError || !!passwordLengthError || !!passwordError 
             || !isIdAvailable || !isPhoneAvailable || !form.agreements.all;
    } else {
      return !form.code || !!passwordError || !!idLengthError || !!passwordLengthError;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md flex flex-col space-y-4">
        <RegisterLogo />
        <AuthInputGroup form={form} handleChange={handleChange} />
        
        {idLengthError && <IdCheckMessage message={idLengthError} isValid={false} />}
        {passwordLengthError && <IdCheckMessage message={passwordLengthError} isValid={false} />}
        {passwordError && <IdCheckMessage message={passwordError} isValid={false} />}
        {isIdChecked && !idLengthError && <IdCheckMessage message={idMessage} isValid={isIdAvailable} />}

        <NamePhoneInputGroup form={form} handleChange={handleChange} />
        {isPhoneChecked && !isPhoneAvailable && <IdCheckMessage message={phoneMessage} isValid={false} />}

        <AgreementSection form={form} handleChange={handleChange} isExpanded={isExpanded} toggleExpand={toggleExpand} />
        {isCodeSent && <VerificationCodeInput value={form.code} onChange={handleChange} />}
        {submitError && <p className="text-sm text-red-500 dark:text-red-400 text-center">{submitError}</p>}
        <SubmitRegisterButton onClick={isCodeSent ? handleSubmit : handleSendCode} disabled={isButtonDisabled()} isCodeSent={isCodeSent} />
      </div>
    </div>
  );
}