// src/api/api.js (전체 덮어쓰기)
import axios from 'axios';

const api = axios.create({
  // 백엔드 주소
  baseURL: 'http://localhost:8080',
  // 관리자(세션) 로그인을 위해 쿠키 전송 허용
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;