export default function SubmitRegisterButton({
  onClick,
  phoneNumber,
  isIdAvailable,
  isAgreementChecked,
  isCodeSent,
  code, // ✅ 새로 추가됨
}) {
  const isValid = isCodeSent
    ? phoneNumber.length === 11 &&
      isIdAvailable &&
      isAgreementChecked &&
      code?.length === 6 // ✅ 인증번호 6자리 입력됐는지 확인
    : phoneNumber.length === 11 &&
      isIdAvailable &&
      isAgreementChecked;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isValid}
      className={`py-2 rounded mt-2 w-full text-white transition-colors ${
        isValid ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {isCodeSent ? "가입하기" : "인증 요청"}
    </button>
  );
}
