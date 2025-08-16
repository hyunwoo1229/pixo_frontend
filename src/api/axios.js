// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 필요한 경우 쿠키 인증 시 사용
});

export default axiosInstance;
