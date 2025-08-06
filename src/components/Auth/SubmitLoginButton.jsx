import React from "react";

export default function SubmitLoginButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 mt-2 rounded text-white ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-black hover:bg-gray-800"
      }`}
    >
      로그인
    </button>
  );
}
