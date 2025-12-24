// src/components2/pages/BoothImageDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api"; // api 모듈 사용
import "../styles/gallery.css";

export default function BoothImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booth, setBooth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // [팀원 로직] 부스 상세 정보 가져오기
    api.get(`/api/booths/${id}`)
      .then((res) => {
        setBooth(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("상세 정보 로딩 실패:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>로딩 중...</div>;
  if (!booth) return <div style={{padding:'50px', textAlign:'center'}}>존재하지 않는 부스입니다.</div>;

  // [팀원 로직] 이미지 경로 처리 함수
  const getImageUrl = (image) => {
      // 이미지 URL이 http로 시작하면 그대로 쓰고, 아니면 서버 경로 붙이기 (상황에 따라 조정 필요)
      // 만약 api.js에 SERVER_URL 상수가 없다면 직접 문자열로 넣거나, 상대경로 사용
      const path = image.storageUri || image.url;
      if (!path) return "https://via.placeholder.com/600x400?text=No+Image";
      return path.startsWith("http") ? path : `http://localhost:8080${path}`; 
      // 주의: 배포 환경에서는 도메인이 바뀌므로, 보통 api.js에서 가져온 BASE_URL을 씁니다.
  };

  return (
    <div className="booth2-detail">
      {/* [내 코드 기능] 목록으로 돌아가기 버튼 추가 */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
            marginBottom: "20px", 
            padding: "8px 15px", 
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ddd",
            borderRadius: "5px"
        }}
      >
        ← 목록으로
      </button>

      <h2>{booth.title}</h2>

      {/* [팀원 로직] 상세 정보 표시 (설명, 위치, 날짜) */}
      <div style={{ marginBottom: "30px", padding: "0 10px" }}>
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: '1.6' }}>
            {booth.context}
          </p>
          <div style={{ marginTop: '15px', color: '#666', fontSize: '0.9rem', display:'flex', gap:'15px' }}>
             <span>📍 위치: {booth.location}</span>
             <span>📅 날짜: {booth.eventDate}</span>
          </div>
      </div>

      {/* 이미지 갤러리 영역 */}
      <div className="booth2-images">
        {booth.images && booth.images.length > 0 ? (
          booth.images.map((image, index) => (
            <div key={image.id || index} style={{ marginBottom: "20px" }}>
                <img
                  src={getImageUrl(image)}
                  alt={`${booth.title} 상세 ${index + 1}`}
                  className="booth2-detail-img"
                  style={{ width: "100%", maxWidth: "800px", borderRadius: "8px" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />
            </div>
          ))
        ) : (
          <div style={{ padding: "50px", textAlign: "center", width: "100%", backgroundColor:"#f9f9f9" }}>
            <p>📷 등록된 상세 사진이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}