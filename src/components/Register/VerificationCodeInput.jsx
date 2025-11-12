export default function VerificationCodeInput({ value, onChange }) {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="code" className="text-sm font-medium dark:text-zinc-200">
        인증번호 입력
      </label>
      <input
        type="text"
        name="code"
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2
                   bg-white dark:bg-zinc-800 
                   dark:border-zinc-600 
                   focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="6자리 숫자"
      />
    </div>
  );
}