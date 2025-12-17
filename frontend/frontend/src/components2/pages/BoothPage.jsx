import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/booth.css";

const BoothPage = () => {
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);

  useEffect(() => {
    fetch("/api/booths")
      .then((res) => res.json())
      .then((data) => {
        // 데이터가 잘 왔는지 확인
        console.log("부스 데이터:", data); 
        setBooths(data);
      })
      .catch((err) => console.error("부스 목록 로드 실패:", err));
  }, []);

  const goDetail = (booth) => {
    navigate(`/booth/${booth.id}`, { state: { booth } });
  };

  return (
    <div className="booth2-list">
      {booths.length > 0 ? (
        booths.map((booth) => (
          <div key={booth.id} className="booth2-item" onClick={() => goDetail(booth)}>
            <div className="booth2-image-wrap">
              {/* [수정] 백엔드에서 img가 없으면 기본 이미지 사용 */}
              <img 
                src={booth.img || "/images/booth1.jpg"} 
                alt={booth.title} 
                className="booth2-image" 
                onError={(e) => { e.target.src = "/images/booth1.jpg"; }} // 이미지 깨짐 방지
              />
            </div>

            <div className="booth2-info-box">
              <h3 className="booth2-title">
                <span className="booth2-tag">체험</span>
                {booth.title}
              </h3>

              <div className="booth2-info-list">
                <div className="booth2-info-row">
                  📌 참가자: {booth.currentPerson || 0}/{booth.maxPerson}명
                </div>
                <div className="booth2-info-row">
                  📅 {booth.eventDate} ~
                </div>
                <div className="booth2-info-row">
                  ⏰ {booth.time || "10:00 - 18:00"}
                </div>
                <div className="booth2-info-row">📍 {booth.location}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ padding: "50px", textAlign: "center" }}>
          체험부스 정보를 불러오는 중입니다... (혹은 데이터가 없습니다)
        </div>
      )}
    </div>
  );
};

export default BoothPage;