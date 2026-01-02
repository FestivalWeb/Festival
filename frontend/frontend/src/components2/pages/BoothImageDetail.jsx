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
  const getImageUrl = (path) => {
      if (!path) return "/images/booth1.jpg";
      if (path.startsWith("http")) return path;
      if (path.startsWith("/images")) return path; // 프론트엔드 이미지
      return `http://localhost:8080${path}`;
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

      {/* [추가] 대표 이미지(Main Image) 표시 영역 */}
      {booth.img && (
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
            <img 
                src={getImageUrl(booth.img)} 
                alt="대표 이미지" 
                style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "8px", objectFit: "cover" }}
                onError={(e) => e.target.style.display = 'none'} // 에러나면 숨김
            />
        </div>
      )}

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

      {/* 이미지 갤러리 영역 (기존 코드 - 여기는 '첨부파일'만 나옵니다) */}
      <div className="booth2-images">
        {booth.images && booth.images.length > 0 ? (
          booth.images.map((image, index) => (
             /* ... 기존 코드 그대로 ... */
             /* 단, src={getImageUrl(image)} 부분에서 image 객체가 아니라 
                image.storageUri 문자열을 넘기거나 함수를 맞춰야 함 */
             /* 아래와 같이 작성하세요 */
            <div key={index} style={{ marginBottom: "20px" }}>
                <img
                  src={getImageUrl(image.storageUri || image.url)}
                  alt="상세 사진"
                  className="booth2-detail-img"
                  style={{ width: "100%", maxWidth: "800px", borderRadius: "8px" }}
                />
            </div>
          ))
        ) : (
          /* [수정] 대표 이미지는 있는데 첨부파일만 없는 경우 안내 메시지 변경 */
          <div style={{ padding: "30px", textAlign: "center", backgroundColor:"#f9f9f9", borderRadius:"8px" }}>
            <p>{booth.img ? "추가 상세 사진이 없습니다." : "등록된 사진이 없습니다."}</p>
          </div>
        )}
      </div>
    </div>
  );
}