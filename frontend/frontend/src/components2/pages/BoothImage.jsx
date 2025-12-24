// src/components2/pages/BoothImage.jsx (또는 BoothPage.jsx)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // fetch 대신 api 모듈 사용 권장
import "../styles/gallery.css";
import Pagination from "../board/Pagination";

export default function BoothImage() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    // [팀원 로직 + 내 페이징] 부스 목록을 서버 페이징으로 가져오기
    // 백엔드 BoothController가 Pageable을 지원한다면 이렇게 호출
    // 만약 백엔드가 페이징을 지원 안 하면 일단 다 가져오고 프론트에서 잘라야 함 (팀원 방식)
    
    // 여기서는 일단 팀원 방식(전체 조회)을 사용하되, 나중에 백엔드가 페이징 지원하면 바꿀 수 있게 작성
    api.get("/api/booths") 
      .then((res) => {
        const allBooths = res.data; // 전체 데이터
        setTotalPages(Math.ceil(allBooths.length / itemsPerPage)); // 총 페이지 계산
        
        // 현재 페이지에 해당하는 데이터만 잘라내기 (클라이언트 페이징)
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setBooths(allBooths.slice(startIndex, endIndex));
      })
      .catch((err) => console.error("부스 로딩 에러:", err));
  }, [currentPage]);

  // [팀원 로직] 이미지 주소 추출 함수
  const getImageUrl = (booth) => {
    if (booth.images && booth.images.length > 0) {
        // 백엔드가 주는 이미지 객체 구조에 따라 .url 또는 .storageUri 선택
        return booth.images[0].url || booth.images[0].storageUri; 
    }
    return "/images/booth1.jpg"; // 기본 이미지
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>체험부스 갤러리</h2>
      
      <div className="booth2-grid">
        {booths.length > 0 ? (
          booths.map((booth) => (
            <div
              key={booth.id || booth.boothId} 
              className="booth2-card"
              onClick={() => navigate(`/booth-images/${booth.id || booth.boothId}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{booth.title}</h3>
              
              {/* [수정] 팀원 코드의 안전한 이미지 처리 로직 적용 */}
              <img 
                src={getImageUrl(booth)} 
                alt={booth.title} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/images/booth1.jpg"; 
                }}
              />
              {/* 간단한 설명 추가 (팀원 코드 장점) */}
              <p style={{padding: "0 10px", color: "#666", fontSize: "0.9em"}}>
                {booth.context && booth.context.length > 30 
                  ? booth.context.substring(0, 30) + "..." 
                  : booth.context}
              </p>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", width: "100%", padding: "50px" }}>
            등록된 부스가 없습니다.
          </div>
        )}
      </div>

      {totalPages > 0 && (
        <Pagination
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}