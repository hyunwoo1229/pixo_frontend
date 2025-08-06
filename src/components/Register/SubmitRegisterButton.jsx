export default function SubmitRegisterButton({ onClick, phoneNumber, isIdAvailable, isAgreementChecked }) {
  const isValid = phoneNumber.length === 11 && isIdAvailable && isAgreementChecked;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isValid}
      className={`py-2 rounded mt-2 w-full text-white transition-colors ${
        isValid ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      인증 요청
    </button>
  );
}
