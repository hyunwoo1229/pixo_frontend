// src/setupAxios.js
import axios from 'axios';



// 백엔드와 쿠키를 주고받기 위해 필수적인 설정입니다.
axios.defaults.withCredentials = true;

// 요청 인터셉터: API 요청을 보내기 전에 헤더에 Access Token을 추가합니다.
axios.interceptors.request.use(config => {
  // 토큰 재발급 요청일 경우 헤더에 토큰을 담지 않습니다.
  if (config.url === '/api/auth/reissue') {
    return config;
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


// 응답 인터셉터: API 응답이 401(Unauthorized) 에러일 경우 토큰 재발급을 시도합니다.
axios.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config;

    // 401 에러이고, 재시도한 요청이 아니며, 재발급 요청 자체가 실패한게 아닐 경우에만 실행합니다.
    if (err.response?.status === 401 && !orig._retry && orig.url !== '/api/auth/reissue') {
      orig._retry = true; // 재시도 플래그를 true로 설정하여 무한 재발급 요청을 방지합니다.
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // 백엔드로 새로운 Access Token을 요청합니다.
        const { data } = await axios.post('/api/auth/reissue', { refreshToken });
        
        // 새로 받은 토큰들을 Local Storage에 저장합니다.
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // 실패했던 원래 요청의 헤더에 새로운 Access Token을 설정하여 재요청합니다.
        orig.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(orig);

      } catch (error) {
        // Refresh Token이 유효하지 않아 재발급에 실패한 경우
        // 모든 토큰과 사용자 정보를 삭제하고 로그인 페이지로 리디렉션합니다.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('name');
        localStorage.removeItem('role'); // role 정보도 함께 삭제
        
        // 현재 페이지가 로그인 페이지가 아닐 경우에만 리디렉션
        if (window.location.pathname !== '/login') {
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    }
    
    // 401 에러가 아닐 경우, 에러를 그대로 반환합니다.
    return Promise.reject(err);
  }
);

export default axios;