import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/booth.css";

const booths = [
  {
    id: 1,
    title: "케이크 공방",
    people: "7/10명",
    date: "2025.10.27 ~ 10.29",
    time: "11:00 - 15:00",
    location: "체험관 2층",
    image: "/images/booth1.jpg",
  },
  {
    id: 2,
    title: "딸기 떡 메치기",
    people: "8/20명",
    date: "2025.10.27 ~ 10.29",
    time: "13:00 - 13:30",
    location: "이벤트 광장",
    image: "/images/booth2.jpg",
  },
    {
    id: 3,
    title: "딸기 수확 체험",
    people: "7/10명",
    date: "2025.10.27 ~ 10.29",
    time: "11:00 - 15:00",
    location: "체험관 2층",
    image: "/images/booth3.jpg",
  },
];

const BoothSection = () => {
  const navigate = useNavigate();

  const goDetail = (booth) => {
    navigate(`/booth/${booth.id}`, { state: { booth } });
  };

  return (
    <div className="booth-list">
      {booths.map((booth) => (
        <div key={booth.id} className="booth-item" onClick={() => goDetail(booth)}>
          {/* 왼쪽 이미지 */}
          <div className="booth-image-wrap">
            <img src={booth.image} alt={booth.title} className="booth-image" />
          </div>

          {/* 오른쪽 정보 박스 */}
          <div className="booth-info-box">
            <h3 className="booth-title">
              <span className="booth-tag">체험</span>
              {booth.title}
            </h3>

            <div className="booth-info-list">
              <div className="booth-info-row">📌 참가자: {booth.people}</div>
              <div className="booth-info-row">📅 {booth.date}</div>
              <div className="booth-info-row">⏰ {booth.time}</div>
              <div className="booth-info-row">📍 {booth.location}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoothSection;