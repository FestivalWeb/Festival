import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/booth.css";

// 체험부스 예약 탭 대표 페이지
const booths = [
  {
    id: 1,
    title: "케이크 공방",
    people: "7/10명",
    date: "2025.10.27 ~ 10.29",
    time: "11:00 - 15:00",
    location: "체험관 2층",
    image: "/images/booth1.jpg",
    res_description: "논산딸기를 이용하여 케이크를 직접 만들어봅니다."
  },
  {
    id: 2,
    title: "딸기 떡 메치기",
    people: "8/20명",
    date: "2025.10.27 ~ 10.29",
    time: "13:00 - 13:30",
    location: "이벤트 광장",
    image: "/images/booth2.jpg",
    res_description: "한국전통 디저트인 떡을 직접 만들어봅니다."
  },
    {
    id: 3,
    title: "딸기 수확 체험",
    people: "7/10명",
    date: "2025.10.27 ~ 10.29",
    time: "11:00 - 15:00",
    location: "체험관 2층",
    image: "/images/booth3.jpg",
    res_description: "논산딸기를 직접 수확해봅니다."
  }
];

const BoothSection = () => {
  const navigate = useNavigate();

  const goDetail = (booth) => {
    navigate(`/booth/${booth.id}`, { state: { booth } });
  };

  return (
    <div className="booth2-list">
      {booths.map((booth) => (
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
              <div className="booth2-info-row">📅 {booth.date}</div>
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