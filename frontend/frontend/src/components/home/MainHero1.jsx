// src/components/MainHero1.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MainHero.css";

function MainHero1({
  onScrollToIntro,
  onScrollToNotice,
  onScrollToGallery,
  onScrollToBooth,
  onScrollToDirections,
}) {
  // 🔍 돋보기 클릭 시 쓸 상태
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate(); // 클릭 시 이동

  return (
    <div className="sf-page">
      {/* Header is provided globally by shared Header component; removed duplicate header here */}

      {/* 메인 히어로 영역 */}
      <main className="sf-hero">
        <div className="sf-hero-inner">
          {/* 왼쪽 텍스트 */}
          <section className="sf-hero-text">
            <p className="sf-hero-badge">제27회</p>
            <h1 className="sf-hero-title">
              <span className="title-green">논산</span>
              <span className="title-red">딸기</span>
              <span className="title-green">축제</span>
              <span className="sf-hero-subtitle">논산딸기, 세계를 잇다</span>
            </h1>

            <p className="sf-hero-date">2025. 3. 27(목) ~ 3. 30(일)</p>
            <p className="sf-hero-place">논산시관광단지 일원</p>

            <p className="sf-hero-desc">
              새벽 딸기 수확 체험부터 야간 라이브 공연까지,
              달콤한 딸기의 도시 논산에서 봄을 먼저 만나보세요.
            </p>

            <div className="sf-hero-buttons">
              <button
                className="sf-primary-button"
                type="button"
                onClick={onScrollToIntro}
              >
                축제 안내 보기
              </button>
              <button
                className="sf-outline-button"
                type="button"
                onClick={() => navigate("/booth")}   // ← 체험부스 페이지로 이동
              >
                체험 프로그램 신청
              </button>
            </div>
          </section>

          {/* 오른쪽 이미지 영역 */}
          <section className="sf-hero-visual">
            <div className="sf-hero-bg-gradient" />
            <div className="sf-hero-strawberry-main" />
            <div className="sf-hero-strawberry-sub" />
          </section>
        </div>
      </main>

      {/* 챗봇 버튼 */}
      <div className="sf-chatbot-floating" aria-label="챗봇 열기">
        <span className="sf-chatbot-icon" role="img" aria-label="chatbot">🤖</span>
      </div>
    </div>
  );
}

export default MainHero1;
