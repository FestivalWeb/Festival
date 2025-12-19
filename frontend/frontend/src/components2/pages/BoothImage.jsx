import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/gallery.css";
import Pagination from "../board/Pagination";

export default function BoothImage() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    // 1. 카테고리 코드 'booth'로 요청
    fetch(`/api/gallery/albums?categoryCode=booth&page=${currentPage - 1}&size=${itemsPerPage}`)
      .then((res) => {
        if (!res.ok) throw new Error("데이터 로딩 실패");
        return res.json();
      })
      .then((data) => {
        setAlbums(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error("앨범 로딩 에러:", err));
  }, [currentPage]);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>체험부스 갤러리</h2>
      
      <div className="booth2-grid">
        {albums.length > 0 ? (
          albums.map((album) => (
            <div
              key={album.albumId} 
              className="booth2-card"
              onClick={() => navigate(`/booth-images/${album.albumId}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{album.title}</h3>
              
              {/* ▼▼▼ [수정] 백엔드 DTO 변수명(imageUrl)에 맞춤 ▼▼▼ */}
              <img 
                src={album.imageUrl ? album.imageUrl : "/images/booth1.jpg"} 
                alt={album.title} 
                onError={(e) => {
                  e.target.onerror = null; // 무한 루프 방지 (이게 핵심!)
                  e.target.src = "/images/booth1.jpg"; 
                }}
              />
              {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
              
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", width: "100%", padding: "50px" }}>
            등록된 앨범이 없습니다.
          </div>
        )}
      </div>

      {albums.length > 0 && (
        <Pagination
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}