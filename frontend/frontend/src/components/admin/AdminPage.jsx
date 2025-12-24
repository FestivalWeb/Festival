import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // 라우터 훅 추가
import adminApi from "../../api/api";
import "./AdminPage.css";

function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // 내 정보 상태 (초기값 null로 설정하여 로딩 중임을 구분 가능)
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate(); // 페이지 이동 함수
  const location = useLocation(); // 현재 주소 확인용

  // [수정됨] 컴포넌트 마운트 시 API 호출로 내 정보 가져오기
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await adminApi.get('/api/admin/auth/me');
        setAdminInfo(response.data); // { username, name, roles... }
      } catch (error) {
        console.error("인증 정보 로드 실패:", error);
        // 401 에러(세션 만료)라면 로그인 페이지로 튕겨내기
        if (error.response && error.response.status === 401) {
             alert("세션이 만료되었습니다. 다시 로그인해주세요.");
             navigate("/admin/login");
        }
      }
    };

    fetchMe();
  }, [navigate]); // navigate 의존성 추가

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

  // [2] 로그아웃 핸들러 함수 추가
  const handleLogout = async () => {
    if (!window.confirm("정말 로그아웃 하시겠습니까?")) return;

    try {
      // POST 요청으로 쿠키 삭제 (credentials: true 필수)
      await adminApi.post("/api/admin/auth/logout");
      alert("로그아웃 되었습니다.");
      navigate("/admin/login"); // 로그인 화면으로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      // 실패해도 사용자가 갇히지 않도록 로그인 화면으로 이동
      navigate("/admin/login");
    }
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

          {/* [3] 로그아웃 버튼 추가 (SYSTEM 섹션 하단에 배치) */}
          <button 
            className="admin-nav-item" 
            onClick={handleLogout}
            style={{ marginTop: 'auto', color: '#ff6b6b' }} // 살짝 붉은색으로 강조 (선택사항)
          >
            로그아웃
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
          {/* ▼ 우측 사용자 정보 영역 ▼ */}
          <div className="admin-topbar-right">
            {adminInfo ? (
              <span className="admin-user-email">
                {/* 이름 표시 */}
                {adminInfo.name} 
                
                {/* 아이디 표시 (회색, 괄호) */}
                <span style={{ color: '#aaa', fontSize: '0.9em', marginLeft: '6px', fontWeight: 'normal' }}>
                  ({adminInfo.username})
                </span>
                
                {/* 권한 뱃지 (SUPER 등) - role-badge 클래스는 CSS에 추가한 것 사용 */}
                {adminInfo.roles && adminInfo.roles.length > 0 && (
                   <span className="role-badge">
                       {adminInfo.roles[0]}
                   </span>
                )}
              </span>
            ) : (
              // 데이터 로딩 중 표시
              <span className="admin-user-email" style={{ color: '#777' }}>
                Loading...
              </span>
            )}
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