// src/api/adminApi.js (파일 생성)
import axios from 'axios';

const adminApi = axios.create({
  // 백엔드 주소 (Proxy 설정이 되어 있다면 '/api' 만 써도 됨)
  baseURL: 'http://localhost:8080',
  withCredentials: true, // ★ 중요: 브라우저가 쿠키(세션ID)를 자동으로 주고받게 함
});

export default adminApi;