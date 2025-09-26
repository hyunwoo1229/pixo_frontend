import googleIcon from '../../assets/icon/google.svg';
import naverIcon from '../../assets/icon/naver.png';
import kakaoIcon from '../../assets/icon/kakao.png';

export default function SocialLoginButtons() {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL|| 'http://localhost:8080';
  return (
    <div className="flex justify-center gap-16">
      {/* Google */}
      <button
        onClick={() => window.location.href = `${API_BASE_URL}/oauth2/authorization/google`}
        className="w-14 h-14 rounded flex items-center justify-center hover:scale-105 transition"
      >
        <img
          src={googleIcon}
          alt="Google"
          className="w-14 h-14"
        />
      </button>

      {/* Naver */}
      <button
        onClick={() => window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`}
        className="w-14 h-14 rounded flex items-center justify-center hover:scale-105 transition"
      >
        <img
          src={naverIcon}
          alt="Naver"
          className="w-12 h-12 object-contain"
        />
      </button>

      {/* Kakao */}
      <button
        onClick={() => window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`}
        className="w-14 h-14 rounded flex items-center justify-center hover:scale-105 transition"
      >
        <img
          src={kakaoIcon}
          alt="Kakao"
          className="w-12 h-12"
        />
      </button>
    </div>
  );
}
