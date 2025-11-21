// import React from "react";
// import Sidebar from "../layout/Sidebar";

// export default function Layout({ children, sidebarType = "default" }) {
//   return (
//     <div className="layout-container">
//       <Sidebar type={sidebarType || "default"} />
//       <div className="layout-content">{children}</div>
//     </div>
//   );
// }

// src/components2/layout/Layout.jsx
// import React from "react";
// import Sidebar from "./Sidebar";
// import "../styles/layout.css";

// function Layout({ children, sidebarType }) {
//   return (
//     <div className="layout-container">
//       <Sidebar type={sidebarType} />
//       <main className="layout-content" style={{ paddingTop: "80px" }}>
//         {children}
//       </main>
//     </div>
//   );
// }

// export default Layout;

import React from "react";
import Sidebar from "./Sidebar";
import "../styles/layout.css";

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