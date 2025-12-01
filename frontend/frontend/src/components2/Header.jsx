import React, { useState, useEffect } from "react";
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

  // 오시는 길 클릭 시 스크롤 함수
  const scrollToSection = (className) => {
    const element = document.querySelector(`.${className}`);
    if (element) {
      const headerOffset = 120; // 고정 헤더 높이
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // target: scroll target class name used by HomePage refs
  // fallbackPath: when not on home, navigate to this path instead of navigating to home
  const navOrScroll = (target, fallbackPath) => {
    if (location.pathname === "/") {
      // same page -> use event to trigger ref-based scroll
      try {
        window.dispatchEvent(new CustomEvent('app-scroll-to', { detail: { target } }));
      } catch (e) {
        scrollToSection(target);
      }
    } else {
      if (fallbackPath) {
        navigate(fallbackPath);
      } else {
        // navigate to home and request scroll
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
      onClick={handleLogoClick} // 클릭 이벤트 추가
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
        <button className="sf-nav-item" onClick={() => navOrScroll("notice", "/notice") } >공지사항/게시물</button>
        <button className="sf-nav-item" onClick={() => navOrScroll("gallery", "/gallery") }>갤러리</button>
        <button className="sf-nav-item" onClick={() => navOrScroll("booth", "/booth") }>
          체험부스
        </button>

        {/* 오시는 길 */}
        <button className="sf-nav-item" onClick={() => handleScrollClick("directions-section")}>
          오시는 길
        </button>
      </nav>

      {/* 오른쪽 - 검색 + 로그인 */}
      <div className="nav-right">
        {/* 검색 입력 — 항상 노출 */}
        <input
          type="text"
          className="search-input"
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* 돋보기 버튼 (클릭 시 향후 검색 페이지로 이동하도록 처리) */}
        <button
          className="search-icon-button"
          type="button"
          onClick={() => {
            // 향후 검색 페이지로 연결하기 쉬우므로 쿼리 포함 네비게이트
            const q = searchText ? `?q=${encodeURIComponent(searchText)}` : "";
            navigate(`/search${q}`);
          }}
        >
          <span role="img" aria-label="search">
            🔍
          </span>
        </button>

        {/* 로그인 상태에 따라: 로그인 전에는 로그인 버튼, 로그인 후에는 마이페이지 + 로그아웃 */}
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
