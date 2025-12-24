import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/home/MainHero.css"
import "./styles/layout.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // 🔍 검색 상태
  const [searchText, setSearchText] = useState("");

  const handleGlobalSearch = () => {
    if (!searchText.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    navigate(`/search?keyword=${encodeURIComponent(searchText)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGlobalSearch();
    }
  };

  // 오시는 길 클릭 시 스크롤 함수
  const scrollToSection = (className) => {
    const element = document.querySelector(`.${className}`);
    if (element) {
      const headerOffset = 120; 
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // 스크롤 or 페이지 이동 함수
  const navOrScroll = (target, fallbackPath) => {
    if (location.pathname === "/") {
      try {
        window.dispatchEvent(new CustomEvent('app-scroll-to', { detail: { target } }));
      } catch (e) {
        scrollToSection(target);
      }
    } else {
      if (fallbackPath) {
        navigate(fallbackPath);
      } else {
        navigate('/', { state: { scrollTo: target } });
      }
    }
  };

   // 로고 클릭 시 홈 이동 + 맨 위 스크롤
  const handleLogoClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sf-header">
      {/* 왼쪽 로고 영역 */}
      <div className="sf-logo-area"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <div className="sf-logo-mark">🍓</div>
        <div className="sf-logo-text">
          <span className="sf-logo-title">논산딸기축제</span>
        </div>
      </div>

      {/* 가운데 메뉴 */}
      <nav className="sf-nav-right">
        <button className="sf-nav-item" onClick={() => navOrScroll("festivalintro") }>
          축제소개
        </button>
        
        {/* [복구 완료] 원래대로 '공지사항/게시물' 버튼만 남김 */}
        <button className="sf-nav-item" onClick={() => navOrScroll("notice", "/notice") }>
          공지사항/게시물
        </button>

        <button className="sf-nav-item" onClick={() => navOrScroll("gallery", "/gallery") }>
          갤러리
        </button>
        <button className="sf-nav-item" onClick={() => navOrScroll("booth", "/booth") }>
          체험부스
        </button>

        <button className="sf-nav-item" onClick={() => navOrScroll("directions-section") }>
          오시는 길
        </button>
      </nav>

      {/* 오른쪽 - 검색 + 로그인 */}
      <div className="nav-right">
        {/* 검색 그룹 */}
        <div className="search-group">
          <button
            className="search-icon-button"
            type="button"
            onClick={handleGlobalSearch}
            aria-label="search-button"
          >
            <span role="img" aria-label="search">
              🔍
            </span>
          </button>

          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 로그인 상태 처리 */}
        {user ? (
          <>
            <button className="mypage-button" type="button" onClick={() => navigate('/mypage')}>
              마이페이지
            </button>
            <button
              className="login-button"
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            className="login-button"
            type="button"
            onClick={() => navigate('/login')}
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}