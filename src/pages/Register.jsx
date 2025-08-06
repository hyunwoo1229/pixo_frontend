import React, { useState } from "react";
import axios from "axios";
import RegisterLogo from "../components/Register/RegisterLogo";
import AuthInputGroup from "../components/Register/AuthInputGroup";
import NamePhoneInputGroup from "../components/Register/NamePhoneInputGroup";
import AgreementSection from "../components/Register/AgreementSection";
import SubmitRegisterButton from "../components/Register/SubmitRegisterButton";
import IdCheckMessage from "../components/Register/IdCheckMessage";
import useCheckLoginId from "../hooks/useCheckLoginId";

export default function Register() {
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    name: "",
    phoneNumber: "",
    agreements: {
      all: false,
      over14: false,
      terms: false,
      privacy: false,
    },
  });

  const [isExpanded, setIsExpanded] = useState(true); // ✅ UX 개선: 약관은 기본적으로 펼쳐짐

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const { isIdChecked, isIdAvailable, message } = useCheckLoginId(form.loginId);

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

  const handleSubmit = async () => {
    try {
      await axios.post("/api/member/register", form);
      alert("회원가입 요청 완료");
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col space-y-4">
        <RegisterLogo />
        <AuthInputGroup form={form} handleChange={handleChange} />
        {isIdChecked && <IdCheckMessage message={message} isValid={isIdAvailable} />}
        <NamePhoneInputGroup form={form} handleChange={handleChange} />
        <AgreementSection
          form={form}
          handleChange={handleChange}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
        />
        <SubmitRegisterButton
          onClick={handleSubmit}
          phoneNumber={form.phoneNumber}
          isIdAvailable={isIdAvailable}
          isAgreementChecked={form.agreements.all}
        />
      </div>
    </div>
  );
}
