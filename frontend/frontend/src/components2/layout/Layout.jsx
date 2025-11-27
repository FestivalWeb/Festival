import React from "react";
import Sidebar from "./Sidebar";
import "../styles/layout.css";

// sidebar에서 하위메뉴로 넘어가기 위해서 layout으로 감싸서 사용
function Layout({ children, sidebarType }) {
  const headerHeight = 80; // Header 높이

  return (
    <div className="layout-container">
      {/* Sidebar에도 Header 높이만큼 margin-top 적용 */}
      <Sidebar
        type={sidebarType}
        style={{ marginTop: `${headerHeight}px` }} // 추가
      />

      {/* Main Content */}
      <main
        className="layout-content"
        style={{ paddingTop: `${headerHeight}px` }} // 기존 유지
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;