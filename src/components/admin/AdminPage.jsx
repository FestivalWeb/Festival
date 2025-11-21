// src/components/admin/AdminPage.jsx
import React from "react";
import "./AdminPage.css";

const dummyAccounts = [
  {
    id: 1,
    username: "admin01",
    name: "김관리",
    email: "admin01@festival.kr",
    role: "SUPER",
    status: "활성",
    lastLogin: "2025-11-03 09:12",
    createdAt: "2024-04-01",
  },
  {
    id: 2,
    username: "staff22",
    name: "이운영",
    email: "op22@festival.kr",
    role: "STAFF",
    status: "활성",
    lastLogin: "2025-11-03 08:45",
    createdAt: "2025-01-03",
  },
  {
    id: 3,
    username: "guest01",
    name: "박체크",
    email: "chk@festival.kr",
    role: "VIEWER",
    status: "정지",
    lastLogin: "2025-08-20 12:10",
    createdAt: "2025-02-01",
  },
  {
    id: 4,
    username: "mod07",
    name: "정관리",
    email: "mgr07@festival.kr",
    role: "MANAGER",
    status: "활성",
    lastLogin: "2025-11-02 21:33",
    createdAt: "2024-10-10",
  },
  {
    id: 5,
    username: "staff31",
    name: "유지원",
    email: "ju31@festival.kr",
    role: "STAFF",
    status: "활성",
    lastLogin: "2025-11-02 19:10",
    createdAt: "2025-02-14",
  },
];

function AdminPage() {
  return (
    <div className="admin-layout">
      {/* 왼쪽 사이드바 */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-mark">A</span>
          <span className="admin-logo-text">Admin</span>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">MENU</div>
          <button className="admin-nav-item">대시보드</button>
          <button className="admin-nav-item admin-nav-item--active">
            계정관리
          </button>
          <button className="admin-nav-item">게시판관리</button>
          <button className="admin-nav-item">팝업관리</button>

          <div className="admin-nav-section">SYSTEM</div>
          <button className="admin-nav-item">로그아웃(상세)</button>
        </nav>
      </aside>

      {/* 오른쪽 메인 영역 */}
      <main className="admin-main">
        {/* 상단 바 */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-path">
              계정관리 &gt; 계정 목록
            </div>
            <h1 className="admin-topbar-title">계정 목록</h1>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-user-email">admin@festival.kr</span>
          </div>
        </header>

        {/* 내용 카드 */}
        <section className="admin-content-card">
          {/* 필터 / 액션 영역 */}
          <div className="admin-filters-row">
            <div className="admin-filter-group">
              <label className="admin-filter-label">이름/이메일</label>
              <input
                type="text"
                className="admin-input"
                placeholder="이름 또는 이메일 검색"
              />
            </div>

            <div className="admin-filter-group">
              <label className="admin-filter-label">역할</label>
              <select className="admin-select">
                <option>역할 전체</option>
                <option>SUPER</option>
                <option>MANAGER</option>
                <option>STAFF</option>
                <option>VIEWER</option>
              </select>
            </div>

            <div className="admin-filter-group">
              <label className="admin-filter-label">상태</label>
              <select className="admin-select">
                <option>상태 전체</option>
                <option>활성</option>
                <option>정지</option>
              </select>
            </div>

            <div className="admin-filter-group">
              <label className="admin-filter-label">정렬</label>
              <select className="admin-select">
                <option>최신순</option>
                <option>오래된순</option>
                <option>이름순</option>
              </select>
            </div>

            <div className="admin-filter-actions">
              <button className="admin-btn admin-btn--ghost">검색</button>
              <button className="admin-btn admin-btn--primary">
                신규 등록
              </button>
              <button className="admin-btn admin-btn--ghost">역할 변경</button>
              <button className="admin-btn admin-btn--ghost">활성/중단</button>
              <button className="admin-btn admin-btn--danger">선택 삭제</button>
            </div>
          </div>

          {/* 계정 목록 테이블 */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>아이디</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>역할</th>
                  <th>상태</th>
                  <th>최근 로그인</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                {dummyAccounts.map((acc) => (
                  <tr key={acc.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{acc.username}</td>
                    <td>{acc.name}</td>
                    <td>{acc.email}</td>
                    <td>
                      <span className="admin-role-pill">{acc.role}</span>
                    </td>
                    <td>
                      <span
                        className={
                          acc.status === "활성"
                            ? "admin-status-pill admin-status-pill--active"
                            : "admin-status-pill admin-status-pill--disabled"
                        }
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td>{acc.lastLogin}</td>
                    <td>{acc.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 하단 정보 + 페이지네이션 */}
          <div className="admin-table-footer">
            <div className="admin-table-count">
              1–5 / 58
            </div>
            <div className="admin-pagination">
              <button className="admin-page-btn">&lt;</button>
              <button className="admin-page-btn admin-page-btn--active">
                1
              </button>
              <button className="admin-page-btn">2</button>
              <button className="admin-page-btn">3</button>
              <button className="admin-page-btn">&gt;</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
