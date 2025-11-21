import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../components/home/MainHero.css"
import "./styles/layout.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sf-header">
      <div className="sf-header-inner">
        {/* 왼쪽 로고 영역 */}
        <div className="sf-logo-area">
          <div className="sf-logo-mark">🍓</div>
          <div className="sf-logo-text">
            <span className="sf-logo-title">논산딸기축제</span>
          </div>
        </div>

         {/* 가운데 메뉴 */}
        <nav className="sf-nav-right">
          <button className="sf-nav-item" onClick={() => navigate("/intro")}>
            축제소개
          </button>
          <button className="sf-nav-item">공지사항/게시물</button>
          <button className="sf-nav-item">갤러리</button>
          <button className="sf-nav-item" onClick={() => navigate("/booth")}>
            체험부스
          </button>
          <button className="sf-nav-item" onClick={() => navigate("/notice")}>
            오시는 길
          </button>
        </nav>

        {/* 오른쪽 메뉴 */}
        <div className="sf-header-right">
          <button className="sf-icon-button" aria-label="검색">🔍</button>
          <button className="sf-login-button">로그인</button>
        </div>
      </div>
    </header>
  );
}
  
