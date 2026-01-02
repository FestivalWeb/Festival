import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../styles/gallery.css";

export default function BoothImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booth, setBooth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    api.get(`/api/booths/${id}`)
      .then((res) => {
        setBooth(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 로딩 실패:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>로딩 중...</div>;
  if (!booth) return <div style={{padding:'50px', textAlign:'center'}}>부스 정보를 찾을 수 없습니다.</div>;

  // [핵심 수정] BoothImage.jsx(목록 페이지)와 동일한 로직 적용
  const getFinalUrl = (path) => {
    if (!path) return "/images/booth1.jpg"; // 경로가 없으면 기본 이미지
    
    // 1. 이미 완전한 주소인 경우 (http로 시작)
    if (path.startsWith("http")) return path;
    
    // 2. 프론트엔드 정적 이미지인 경우 (/images로 시작)
    if (path.startsWith("/images")) return path;

    // 3. 백엔드 이미지인 경우 (DB에 '/uploads/...' 로 저장되어 있다고 판단됨)
    // 앞의 목록 페이지처럼 단순히 localhost만 붙여줍니다.
    return `http://localhost:8080${path}`; 
  };

  // 보여줄 이미지 목록 정리
  let displayImages = [];
  if (booth.images && booth.images.length > 0) {
      displayImages = booth.images;
  } else {
      // 이미지가 리스트에 없으면 대표 이미지(img)라도 보여줌
      const mainImg = booth.img || booth.boothImg;
      if (mainImg) displayImages = [{ storageUri: mainImg }];
  }

  return (
    <div className="booth2-detail">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom: "20px" }}>
        <button 
          onClick={() => navigate('/booth-images')}
          style={{ 
              padding: "8px 15px", cursor: "pointer",
              backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "5px"
          }}
        >
          ← 목록으로
        </button>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>{booth.title}</h2>

      <div style={{ marginBottom: "40px", padding: "30px", background: "#fff", borderRadius: "8px", border: "1px solid #eee", textAlign: "center" }}>
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.2rem', lineHeight: '1.8', color: '#333' }}>
            {booth.context}
          </p>
          <div style={{ marginTop: '20px', color: '#666', display:'flex', justifyContent:'center', gap:'20px' }}>
             <span>📍 위치: {booth.location}</span>
             <span>📅 날짜: {booth.eventDate}</span>
          </div>
      </div>

      <h3 style={{ borderBottom: '2px solid #ff4f7a', paddingBottom: '10px', marginBottom: '20px', color: '#333', textAlign:'center', width:'fit-content', margin:'0 auto 30px auto' }}>
        📸 활동 사진
      </h3>
      
      <div className="booth2-images" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        {displayImages.length > 0 ? (
          displayImages.map((image, index) => {
            // 이미지 객체에서 경로 문자열 꺼내기 (DTO 구조에 따라 다를 수 있음)
            const rawPath = image.storageUri || image.url || image.fileUrl || image;
            
            return (
                <div key={index} style={{ marginBottom: "30px", width: "100%", maxWidth: "800px" }}>
                    <img
                      src={getFinalUrl(rawPath)}
                      alt={`상세 사진 ${index + 1}`}
                      className="booth2-detail-img"
                      style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                      onError={(e) => {
                        // 에러 시 엑박 대신 기본 이미지 보여주기
                        e.target.onerror = null;
                        e.target.src = "/images/booth1.jpg";
                      }}
                    />
                </div>
            );
          })
        ) : (
          <div style={{ padding: "40px", textAlign: "center", backgroundColor:"#f9f9f9", borderRadius:"8px", color: "#888", width: "100%" }}>
            <p>등록된 사진이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}