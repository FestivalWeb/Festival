import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/home/MainHero.css"
import "./styles/layout.css";
import api from "../api/api";

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

  // target: HomePage의 ref에서 사용하는 스크롤 대상 클래스명
  // fallbackPath: (홈이 아닐 때) 홈으로 이동하는 대신 이 경로로 네비게이트
  const navOrScroll = (target, fallbackPath) => {
    if (location.pathname === "/") {
      // 같은 페이지일 경우 -> ref 기반 스크롤을 트리거하기 위해 이벤트 사용
      try {
        window.dispatchEvent(new CustomEvent('app-scroll-to', { detail: { target } }));
      } catch (e) {
        scrollToSection(target);
      }
    } else {
      if (fallbackPath) {
        navigate(fallbackPath);
      } else {
        // 홈으로 이동한 뒤 스크롤 요청
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

  // [추가] 게시판 목록 상태
  const [boardMenus, setBoardMenus] = useState([]);

  // [추가] 메뉴 데이터 로드
  useEffect(() => {
    api.get('/api/boards')
      .then(res => setBoardMenus(res.data)) // [{boardId:1, name:"공지"}, ...]
      .catch(err => console.error("메뉴 로드 실패", err));
  }, []);

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
        {/* 2. [수정됨] 드롭다운 메뉴 (게시판 목록) */}
        <div className="sf-dropdown">
          {/* 드롭다운 트리거 버튼 */}
          <button className="sf-nav-item">
            커뮤니티 ▾
          </button>
          
          {/* 펼쳐지는 목록 */}
          <div className="sf-dropdown-menu">
            {boardMenus.length > 0 ? (
              boardMenus.map((board) => (
                <button
                  key={board.boardId}
                  className="sf-dropdown-item" // 새로 만든 CSS 클래스 사용
                  onClick={() => {
                    navigate(`/board/${board.boardId}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // 페이지 이동 시 스크롤 위로
                  }}
                >
                  {board.name}
                </button>
              ))
            ) : (
              <div style={{ padding: '10px', color: '#999', fontSize: '13px', textAlign: 'center' }}>
                게시판 없음
              </div>
            )}
          </div>
        </div>
        
        <button className="sf-nav-item" onClick={() => navOrScroll("gallery", "/gallery") }>갤러리</button>
        <button className="sf-nav-item" onClick={() => navOrScroll("booth", "/booth") }>
          체험부스
        </button>

        {/* 오시는 길 */}
        <button className="sf-nav-item" onClick={() => navOrScroll("directions-section") }>
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
