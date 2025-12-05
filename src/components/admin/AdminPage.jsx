import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // 라우터 훅 추가
import "./AdminPage.css";

function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate(); // 페이지 이동 함수
  const location = useLocation(); // 현재 주소 확인용

  // 현재 메뉴가 활성화되었는지 확인하는 함수
  const isActive = (path) => location.pathname === `/admin/${path}`;

  // 현재 주소에 따라 헤더 제목 변경
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "대시보드";
    if (path.includes("account")) return "계정 관리";
    if (path.includes("board")) return "게시판 관리";
    if (path.includes("popup")) return "팝업 관리";
    if (path.includes("log")) return "로그 상세";
    return "관리자 시스템";
  };

  return (
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      
      {/* 1. 햄버거 버튼 (메뉴 토글) */}
      <button
        type="button"
        className="admin-menu-toggle"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label="메뉴 열고 닫기"
      >
        <span className="admin-menu-toggle-bar" />
        <span className="admin-menu-toggle-bar" />
        <span className="admin-menu-toggle-bar" />
      </button>

      {/* 2. 왼쪽 사이드바 */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-mark">🍓</span>
          <span className="admin-logo-text">Admin</span>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">MENU</div>
          
          {/* 대시보드 버튼 */}
          <button 
            className={`admin-nav-item ${isActive("dashboard") ? "admin-nav-item--active" : ""}`}
            onClick={() => navigate("/admin/dashboard")}
          >
            대시보드
          </button>
          
          {/* 계정관리 버튼 */}
          <button 
            className={`admin-nav-item ${isActive("account") ? "admin-nav-item--active" : ""}`}
            onClick={() => navigate("/admin/account")}
          >
            계정관리
          </button>
          
          {/* 게시판관리 버튼 */}
          <button 
            className={`admin-nav-item ${isActive("board") ? "admin-nav-item--active" : ""}`}
            onClick={() => navigate("/admin/board")}
          >
            게시판관리
          </button>
          
          {/* 팝업관리 버튼 */}
          <button 
            className={`admin-nav-item ${isActive("popup") ? "admin-nav-item--active" : ""}`}
            onClick={() => navigate("/admin/popup")}
          >
            팝업관리
          </button>

          <div className="admin-nav-section">SYSTEM</div>
          
          {/* 로그상세 버튼 */}
          <button 
            className={`admin-nav-item ${isActive("log") ? "admin-nav-item--active" : ""}`}
            onClick={() => navigate("/admin/log")}
          >
            로그 상세
          </button>
        </nav>
      </aside>

      {/* 3. 오른쪽 메인 영역 */}
      <main className="admin-main">
        {/* 상단 바 */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-path">
              관리자 &gt; {getPageTitle()}
            </div>
            <h1 className="admin-topbar-title">{getPageTitle()}</h1>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-user-email">admin@festival.kr (SUPER)</span>
          </div>
        </header>

        {/* ★ 여기가 핵심입니다 ★
            기존에는 여기에 계정 목록 테이블 코드가 직접 있었지만,
            이제는 <Outlet />을 넣어서 주소에 맞는 컴포넌트(대시보드, 계정 등)를 불러옵니다.
        */}
        <div style={{ padding: "20px", height: "calc(100vh - 70px)", overflowY: "auto" }}>
            <Outlet />
        </div>

      </main>
    </div>
  );
}

export default AdminPage;