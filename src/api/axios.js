import axios from "axios";

// Axios 기본 인스턴스 생성
const instance = axios.create({
  // 백엔드 API의 기본 URL을 설정할 수 있습니다.
  // 예: baseURL: 'http://localhost:8080'
  // package.json의 "proxy" 설정을 사용하고 있다면 baseURL은 필요 없습니다.
});

/**
 * 요청 인터셉터 (Request Interceptor)
 * 모든 API 요청이 서버로 전송되기 전에 이 코드가 실행됩니다.
 */
instance.interceptors.request.use(
  (config) => {
    // localStorage에서 accessToken을 가져옵니다.
    const token = localStorage.getItem("accessToken");

    // 토큰이 존재하면 Authorization 헤더에 추가합니다.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

export default instance;
