export default function SubmitRegisterButton({ onClick, disabled, isCodeSent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled} // 외부에서 전달받은 disabled 상태를 그대로 사용
      className={`py-2 rounded mt-2 w-full text-white transition-colors ${
        !disabled 
          ? "bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" 
          : "bg-gray-400 dark:bg-zinc-600 cursor-not-allowed"
      }`}
    >
      {isCodeSent ? "가입하기" : "인증 요청"}
    </button>
  );
}