// MainHero.jsx
import React from "react";
import "./MainHero.css";

// 껍데기 컴포넌트
function MainHero1({ onNavigate }) {
  return <MainHero onNavigate={onNavigate} />;
}

function MainHero({ onNavigate }) {
  return (
    <div className="sf-page">
      {/* 상단 헤더 */}
      <header className="sf-header">
        <div className="sf-header-inner">
          {/* 왼쪽 로고 영역 */}
          <div className="sf-logo-area">
            <div className="sf-logo-mark">🍓</div>
            <div className="sf-logo-text">
              <span className="sf-logo-title">논산딸기축제</span>
            </div>
          </div>

          {/* 가운데 메뉴 */}
          <nav className="sf-nav-right">
  <button
    className="sf-nav-item sf-nav-item-active"
    onClick={() => onNavigate("intro")}
  >
    축제소개
  </button>
  <button className="sf-nav-item">행사일정</button>
  <button className="sf-nav-item">체험프로그램</button>
  <button className="sf-nav-item">오시는 길</button>
  <button className="sf-nav-item">공지사항</button>
</nav>


          {/* 오른쪽 메뉴 */}
          <div className="sf-header-right">
            <button className="sf-icon-button" aria-label="검색">
              🔍
            </button>
            <button className="sf-login-button">로그인</button>
          </div>
        </div>
      </header>

      {/* 메인 히어로 영역 */}
      <main className="sf-hero">
        <div className="sf-hero-inner">
          {/* 왼쪽 텍스트 영역 */}
          <section className="sf-hero-text">
            <p className="sf-hero-badge">제27회</p>
           <h1 className="sf-hero-title">
  <span className="title-green">논산</span>
  <span className="title-red">딸기</span>
  <span className="title-green">축제</span>

  <span className="sf-hero-subtitle">
    논산딸기, 세계를 잇다
  </span>
</h1>

            <p className="sf-hero-date">
              2025. 3. 27(목) ~ 3. 30(일)
            </p>
            <p className="sf-hero-place">
              논산시관광단지 일원
            </p>

            <p className="sf-hero-desc">
              새벽 딸기 수확 체험부터 야간 라이브 공연까지,  
              달콤한 딸기의 도시 논산에서 봄을 먼저 만나보세요.
            </p>

            <div className="sf-hero-buttons">
              <button className="sf-primary-button">축제 안내 보기</button>
              <button className="sf-outline-button">체험 프로그램 신청</button>
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

      {/* 화면 하단 고정 챗봇 버튼 */}
      <button className="sf-chatbot-floating" aria-label="챗봇 열기">
        sb
      </button>
    </div>
  );
}

export default MainHero1;
