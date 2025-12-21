import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api"; // API 설정 파일
import "../styles/gallery.css";

export default function BoothImageDetail() {
  const { id } = useParams();
  
  // 상태 관리
  const [booth, setBooth] = useState(null);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  useEffect(() => {
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

  // 로딩 및 에러 처리
  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>로딩 중...</div>;
  if (!booth) return <div style={{padding:'50px', textAlign:'center'}}>존재하지 않는 체험부스입니다.</div>;

  return (
    <div className="booth2-detail">
      <h2>{booth.title}</h2>

      {/* 이미지 갤러리 영역 */}
      <div className="booth2-images">
        {booth.images && booth.images.length > 0 ? (
          // 1. 이미지가 있을 경우 반복해서 출력
          booth.images.map((image, index) => (
            <img
              key={image.id || index}
              // 서버 이미지 경로 조합
              src={`${SERVER_URL}${image.storageUri}`}
              alt={`${booth.title} 상세 이미지 ${index + 1}`}
              className="booth2-detail-img"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
              }}
            />
          ))
        ) : (
          // 2. 이미지가 없을 경우 기본 이미지 1장 출력
          <img
            src="https://via.placeholder.com/600x400?text=No+Image"
            alt="기본 이미지"
            className="booth2-detail-img"
          />
        )}
      </div>

      {/* 설명글 (DTO의 context 사용) */}
      <p style={{whiteSpace: 'pre-wrap'}}>{booth.context}</p>

      {/* 추가 정보 (위치, 가격 등 필요하면 여기에 추가) */}
      <div style={{marginTop: '20px', color: '#666', fontSize: '0.9rem'}}>
         <p>📍 위치: {booth.location}</p>
         <p>📅 날짜: {booth.eventDate}</p>
      </div>
    </div>
  );
}