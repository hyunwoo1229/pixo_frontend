import React from "react";

const NamePhoneInputGroup = ({ form, handleChange }) => {
  return (
    <div className="rounded border overflow-hidden">
      <input
        type="text"
        name="name"
        placeholder="이름"
        className="w-full px-4 py-2 border-b outline-none"
        value={form.name || ""}
        onChange={handleChange}
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="전화번호 (- 없이 숫자만 입력)"
        className="w-full px-4 py-2 outline-none"
        value={form.phoneNumber || ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default NamePhoneInputGroup;
