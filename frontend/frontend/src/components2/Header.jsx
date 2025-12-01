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
  const [showSearch, setShowSearch] = useState(false);
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

  const handleScrollClick = (className) => {
    if (location.pathname !== "/") {
      // 다른 페이지면 홈으로 이동하면서 스크롤 타겟을 전달
      navigate('/', { state: { scrollTo: className } });
    } else {
      // 이미 HomePage면 HomePage의 ref 기반 스크롤을 트리거하도록 이벤트 전송
      try {
        window.dispatchEvent(new CustomEvent('app-scroll-to', { detail: { target: className } }));
      } catch (e) {
        // fallback: DOM 기반 스크롤
        scrollToSection(className);
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
        <button className="sf-nav-item" onClick={() => handleScrollClick("festivalintro")}>
          축제소개
        </button>
        <button className="sf-nav-item" onClick={() => handleScrollClick("notice")} >공지사항/게시물</button>
        <button className="sf-nav-item" onClick={() => handleScrollClick("gallery")}>갤러리</button>
        <button className="sf-nav-item" onClick={() => handleScrollClick("booth")}>
          체험부스
        </button>

        {/* 오시는 길 */}
        <button className="sf-nav-item" onClick={() => handleScrollClick("directions-section")}>
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

        {/* 로그인 / 로그아웃 버튼 */}
        {user ? (
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
