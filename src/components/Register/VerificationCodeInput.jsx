export default function VerificationCodeInput({ value, onChange }) {
    return (
      <div className="flex flex-col space-y-2">
        <label htmlFor="code" className="text-sm font-medium">
          인증번호 입력
        </label>
        <input
          type="text"
          name="code"
          value={value}
          onChange={onChange}
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="6자리 숫자"
        />
      </div>
    );
  }
  