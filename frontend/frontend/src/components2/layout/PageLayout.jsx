// src/components/layout/PageLayout.js
import Sidebar from "./Sidebar";
import "../styles/layout.css";

export default function PageLayout({ children }) {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}
