import Sidebar from "./Sidebar";
import "../styles/layout.css";

// 하위메뉴 사이드바 적용
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
