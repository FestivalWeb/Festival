import React from "react";
import { useNavigate } from "react-router-dom";

const booths = [
  {
    id: 1,
    title: "VR 체험",
    description: "가상현실 체험 부스로 최신 VR 기기를 직접 사용해 볼 수 있습니다.",
    image: "/images/booth1.jpg",
  },
  {
    id: 2,
    title: "드론 체험",
    description: "드론 조종법을 배우고 간단한 미션을 수행할 수 있는 체험 부스입니다.",
    image: "/images/booth2.jpg",
  },
  {
    id: 3,
    title: "로봇 만들기",
    description: "간단한 로봇을 만들어보고 프로그래밍까지 체험할 수 있는 부스입니다.",
    image: "/images/booth3.jpg",
  },
];

const BoothSection = () => {
  const navigate = useNavigate();

  const goDetail = (booth) => {
    navigate(`/booth/${booth.id}`, { state: { booth } });
  };

  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
      {booths.map((booth) => (
        <div
          key={booth.id}
          style={{
            cursor: "pointer",
            width: "300px",
            textAlign: "center",
          }}
          onClick={() => goDetail(booth)}
        >
          <img
            src={booth.image}
            alt={booth.title}
            style={{ width: "100%", borderRadius: "10px" }}
          />
          <h3>{booth.title}</h3>
          <p>{booth.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BoothSection;
