import React from 'react';
import './MainHero.css';

function Header({ onNavigate, isLoggedIn, onLogout }) {
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    onLogout && onLogout();
    onNavigate && onNavigate('home');
  };

  return (
    <header className="sf-header">
      <div className="sf-header-inner">
        {/* 왼쪽 로고 영역 */}
        <div className="sf-logo-area" onClick={() => onNavigate && onNavigate('home')} style={{ cursor: 'pointer' }}>
          <div className="sf-logo-mark">🍓</div>
          <div className="sf-logo-text">
            <span className="sf-logo-title">논산딸기축제</span>
          </div>
        </div>

        {/* 가운데 메뉴 */}
        <nav className="sf-nav-right">
          <button
            className="sf-nav-item sf-nav-item-active"
            onClick={() => onNavigate && onNavigate('intro')}
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
          {isLoggedIn ? (
            <button
              className="sf-login-button"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            <button
              className="sf-login-button"
              onClick={() => onNavigate && onNavigate('login')}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
