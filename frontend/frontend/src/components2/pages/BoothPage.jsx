import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // API 경로 확인
import "../styles/booth.css";

const BoothSection = () => {
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);

  useEffect(() => {
    api.get("/api/booths")
      .then(res => setBooths(res.data))
      .catch(err => console.error("부스 목록 로드 실패:", err));
  }, []);

  const goDetail = (booth) => {
    navigate(`/booth/${booth.id}`, { state: { booth } });
  };

  const getImageUrl = (booth) => {
    if (booth.images && booth.images.length > 0) return `${SERVER_URL}${booth.images[0].storageUri}`;
    return "https://via.placeholder.com/300?text=No+Image";
  };

  return (
    <div className="booth2-list">
      {booths.length === 0 ? (
        <div style={{padding:'50px', textAlign:'center', width:'100%'}}>진행 중인 체험 부스가 없습니다.</div>
      ) : (
        booths.map((booth) => (
          <div key={booth.id} className="booth2-item" onClick={() => goDetail(booth)}>
            <div className="booth2-image-wrap">
              <img src={getImageUrl(booth)} alt={booth.title} className="booth2-image" 
                   onError={(e) => e.target.src="https://via.placeholder.com/300?text=Error"}/>
            </div>
            <div className="booth2-info-box">
              <h3 className="booth2-title">
                <span className="booth2-tag">체험</span>
                {booth.title}
              </h3>
              <div className="booth2-info-list">
                <div className="booth2-info-row">📌 최대 인원: {booth.maxPerson}명</div>
                <div className="booth2-info-row">📅 {booth.eventDate}</div>
                {/* 시간 정보가 DB에 없으면 임의로 표시하거나 필드 추가 필요 */}
                <div className="booth2-info-row">⏰ 10:00 ~ 17:00</div> 
                <div className="booth2-info-row">📍 {booth.location}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BoothSection;