import React from "react";
import "../styles/layout.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>알림마당</h2>
      <ul>
        <li className="active">공지사항</li>
        <li>게시글</li>
        <li>갤러리</li>
        <li>체험 부스</li>
      </ul>
    </aside>
  );
}
