export default function SubmitLoginButton({ onClick, disabled, type="button" }) { 
  return (
    <button
      // type 속성 사용
      type={type} 
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 mt-2 rounded text-white ${
        disabled
          ? "bg-gray-400 dark:bg-zinc-600 cursor-not-allowed"
          : "bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      }`}
    >
      로그인
    </button>
  );
}