// src/components/MainHero1.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <div className="sf-page">
      {/* 상단 헤더 */}
      <header className="sf-header">
        <div className="sf-header-inner">
          {/* 왼쪽 로고 */}
          <Link to="/" className="sf-logo-area">
  <div className="sf-logo-mark">🍓</div>
  <div className="sf-logo-text">
    <span className="sf-logo-title">논산딸기축제</span>
    </div>
</Link>

          {/* 가운데 메뉴 */}
          <nav className="sf-nav">
            <button
              type="button"
              className="sf-nav-item"
              onClick={onScrollToIntro}
            >
              축제소개
            </button>

            <button
              type="button"
              className="sf-nav-item"
              onClick={onScrollToNotice}
            >
              공지사항
            </button>

            <button
              type="button"
              className="sf-nav-item"
              onClick={onScrollToGallery}
            >
              갤러리
            </button>

            <button
              type="button"
              className="sf-nav-item"
              onClick={onScrollToBooth}
            >
              체험부스
            </button>

            <button
              type="button"
              className="sf-nav-item"
              onClick={onScrollToDirections}
            >
              오시는 길
            </button>
          </nav>

          {/* 오른쪽 - 검색 + 로그인 */}
          <div className="nav-right">
            {/* 돋보기 버튼 */}
            <button
              className="search-icon-button"
              type="button"
              onClick={() => setShowSearch((prev) => !prev)}
            >
              <span role="img" aria-label="search">
                🔍
              </span>
            </button>

            {/* 🔽 돋보기 눌렀을 때만 보이는 입력창 */}
            {showSearch && (
              <input
                type="text"
                className="search-input"
                placeholder="검색어를 입력하세요"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                /* 눈에 확 보이게 테스트용 스타일 */
                style={{
                  border: "2px solid red",
                  background: "white",
                }}
              />
            )}

            {/* 로그인 버튼 */}
            <button className="login-button" type="button">
              로그인
            </button>
          </div>
        </div>
      </header>

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
              <button className="sf-outline-button" type="button">
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
