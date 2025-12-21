import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../styles/gallery.css";
import Pagination from "../board/Pagination"; // Pagination 경로 확인

export default function BoothImage() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    api.get("/api/booths")
      .then(res => setBooths(res.data))
      .catch(err => console.error(err));
  }, []);

  const totalPages = Math.ceil(booths.length / itemsPerPage);
  const currentItems = booths.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getImageUrl = (booth) => {
     if (booth.images && booth.images.length > 0) return `${SERVER_URL}${booth.images[0].storageUri}`;
     return "https://via.placeholder.com/300?text=No+Image";
  };

  return (
    <div>
      <div className="booth2-grid">
        {booths.length === 0 ? (
           <div style={{width:'100%', textAlign:'center', padding:'50px'}}>등록된 사진이 없습니다.</div>
        ) : (
          currentItems.map((booth) => (
            <div
              key={booth.id}
              className="booth2-card"
              onClick={() => navigate(`/booth-images/${booth.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{booth.title}</h3>
              <img src={getImageUrl(booth)} alt={booth.title} 
                   onError={e => e.target.src="https://via.placeholder.com/300"}/>
              <p>{booth.context}</p>
            </div>
          ))
        )}
      </div>

      {booths.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage} // Pagination 컴포넌트에 따라 props 확인 필요
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}