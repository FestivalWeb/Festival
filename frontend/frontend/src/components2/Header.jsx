import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/home/MainHero.css"
import "./styles/layout.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // 스크롤바 너비를 계산해서 CSS 변수로 세팅합니다.
  // 이유: 브라우저/페이지에 따라 스크롤바가 생기면 레이아웃이 미세하게 이동하므로
  // JS로 실제 스크롤바 폭을 계산해 `--header-scroll-comp`에 반영하면 일관성 유지가 쉬워집니다.
  useEffect(() => {
    function setScrollbarComp() {
      // window.innerWidth - documentElement.clientWidth = scrollbar width (px)
      const docEl = document.documentElement;
      const scrollbarWidth = Math.max(0, window.innerWidth - docEl.clientWidth);
      // 안전하게 픽셀값으로 설정
      docEl.style.setProperty('--header-scroll-comp', `${scrollbarWidth}px`);
    }

    // 초기 설정
    setScrollbarComp();
    // 리사이즈나 스크롤바 변동 시 재계산
    window.addEventListener('resize', setScrollbarComp);
    // 일부 환경에서 스크롤바가 동적으로 변할 수 있어 focus/visibilitychange 등도 고려 가능

    return () => {
      window.removeEventListener('resize', setScrollbarComp);
    };
  }, []);


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
        {/* 검색 그룹: 버튼(왼쪽) + 입력(오른쪽) */}
        <div className="search-group">
          <button
            className="search-icon-button"
            type="button"
            onClick={() => {
              // 현재는 무동작(no-op). 향후 검색페이지로 연결하기 쉽게 유지.
            }}
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
          />
        </div>

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
