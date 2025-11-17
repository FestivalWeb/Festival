import React from "react";
import { Link } from "react-router-dom";   // 🔥 Link import 필요!
import "../styles/layout.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>알림마당</h2>

      <ul>
        <li className="active">
          <Link to="/notice">공지사항</Link>
        </li>

        <li>
          <Link to="/post">게시글</Link>
        </li>

        <li>
          <Link to="/gallery">갤러리</Link>
        </li>

        <li>
          <Link to="/booth">체험 부스</Link>
        </li>
      </ul>
    </aside>
  );
}
