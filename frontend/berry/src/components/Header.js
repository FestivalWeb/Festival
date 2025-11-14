import React from "react";
import { Link } from "react-router-dom";
import "./styles/layout.css";

export default function Header() {
  return (
    <header className="top-header">
      <div className="logo">논산딸기축제</div>
      <nav className="top-menu">
        <ul>
           <li><Link to="/">축제 소개</Link></li>
          <li><Link to="/notice">공지사항/게시물</Link></li>
          <li><Link to="/gallery">갤러리</Link></li>
          <li><Link to="/booth">체험부스</Link></li>
          <li><Link to="/map">오시는 길</Link></li>
          <li><Link to="/login">로그인</Link></li>
        </ul>
      </nav>
    </header>
  );
}
