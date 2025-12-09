import React from "react";
import { useNavigate } from "react-router-dom";
import { boothResData } from "../data/boothResData";
import "../styles/booth.css";


// 체험부스 예약 탭 대표 페이지
const BoothSection = () => {
  const navigate = useNavigate();

  const goDetail = (booth) => {
    navigate(`/booth/${booth.id}`, { state: { booth } });
  };

  return (
    <div className="booth2-list">
      {boothResData.map((booth) => (
        <div key={booth.id} className="booth2-item" onClick={() => goDetail(booth)}>
          {/* 왼쪽 이미지 */}
          <div className="booth2-image-wrap">
            <img src={booth.image} alt={booth.title} className="booth2-image" />
          </div>

          {/* 오른쪽 정보 박스 */}
          <div className="booth2-info-box">
            <h3 className="booth2-title">
              <span className="booth2-tag">체험</span>
              {booth.title}
            </h3>

            <div className="booth2-info-list">
              <div className="booth2-info-row">📌 참가자: {booth.people}</div>
              <div className="booth2-info-row">
                📅 {`${booth.availableDates[0].replace(/-/g, ".")}~${booth.availableDates[booth.availableDates.length - 1].slice(5).replace(/-/g, ".")}`}
              </div>
              <div className="booth2-info-row">⏰ {booth.time}</div>
              <div className="booth2-info-row">📍 {booth.location}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoothSection;