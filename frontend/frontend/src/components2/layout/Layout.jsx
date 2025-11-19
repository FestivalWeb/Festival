import React from "react";
import Sidebar from "../layout/Sidebar";

export default function Layout({ children, sidebarType = "default" }) {
  return (
    <div className="layout-container">
      <Sidebar type={sidebarType || "default"} />
      <div className="layout-content">{children}</div>
    </div>
  );
}
