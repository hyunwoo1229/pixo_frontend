// src/components/Auth/SocialLoginButtons.jsx
export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <a href="http://localhost:8080/oauth2/authorization/google">
        <button className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
          Google로 로그인
        </button>
      </a>
      <a href="http://localhost:8080/oauth2/authorization/naver">
        <button className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Naver로 로그인
        </button>
      </a>
      <a href="http://localhost:8080/oauth2/authorization/kakao">
        <button className="w-full py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500">
          Kakao로 로그인
        </button>
      </a>
    </div>
  );
}
