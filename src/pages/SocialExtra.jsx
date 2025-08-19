// src/pages/SocialExtra.jsx
import React, { useState } from "react";
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
    name: nameParam || "",
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
  const [message, setMessage] = useState("");

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

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
      setMessage("인증번호가 전송되었습니다.");
    } catch (err) {
      console.error(err);
      setMessage("인증번호 전송 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post("/api/member/register", {
        ...form,
        skipSave: true,
      });
      setIsCodeVerified(true);
      setMessage("인증번호 확인 성공");
    } catch (err) {
      console.error(err);
      setIsCodeVerified(false);
      if (err.response?.status === 400) {
        setMessage("인증번호가 일치하지 않습니다.");
      } else {
        setMessage("인증번호 확인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/member/update-extra", form, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("name", form.name);
      localStorage.setItem("isExtraUpdated", "true");

      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setMessage("인증번호가 일치하지 않습니다.");
      } else {
        setMessage("추가 정보 업데이트 실패");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col space-y-4">
        <RegisterLogo />
        <NamePhoneInputGroup form={form} handleChange={handleChange} />

        <AgreementSection
          form={form}
          handleChange={handleChange}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
        />

        {/* ✅ 인증번호 입력칸: 버튼 바로 위로 이동 */}
        {isCodeSent && (
          <VerificationCodeInput
            value={form.code}
            onChange={handleChange}
            onVerify={handleVerifyCode}
            isVerified={isCodeVerified}
          />
        )}

        {message && <p className="text-sm text-red-500">{message}</p>}

        <SubmitRegisterButton
          onClick={isCodeSent ? handleSubmit : handleSendCode}
          phoneNumber={form.phoneNumber}
          isIdAvailable={true}
          isAgreementChecked={form.agreements.all}
          isCodeVerified={isCodeVerified}
          isCodeSent={isCodeSent}
          code={form.code}
        />
      </div>
    </div>
  );
}
