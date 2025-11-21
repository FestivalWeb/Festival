// src/components/common/FestivalLogo.jsx
import React from "react";
import "../MainHero.css";  // 로고 스타일 여기 들어있으니까 함께 불러오기

function FestivalLogo() {
  return (
    <div className="sf-logo-area">
      <div className="sf-logo-mark">🍓</div>
      <div className="sf-logo-text">
        <span className="sf-logo-title">논산딸기축제</span>
      </div>
    </div>
  );
}

export default FestivalLogo;
