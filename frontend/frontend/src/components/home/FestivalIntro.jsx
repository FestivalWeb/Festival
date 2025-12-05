// src/components/FestivalIntro.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FestivalLogo from "../common/FestivalLogo";
import "./FestivalIntro.css";

function FestivalIntro() {
  const [activeLang, setActiveLang] = useState("ko");
  const navigate = useNavigate();

  return (
    <div className="intro-page">
      <div className="intro-container">
        {/* 상단 제목 + 언어 선택 */}
        <header className="intro-header">
          <h2 className="intro-title">축제 소개</h2>

          <div className="intro-lang-buttons">
            <button
              className={`lang-btn ${activeLang === "ko" ? "lang-active" : ""}`}
              onClick={() => setActiveLang("ko")}
            >
              한국어
            </button>

            <button
              className={`lang-btn ${activeLang === "en" ? "lang-active" : ""}`}
              onClick={() => setActiveLang("en")}
            >
              English
            </button>

            <button
              className={`lang-btn ${activeLang === "ja" ? "lang-active" : ""}`}
              onClick={() => setActiveLang("ja")}
            >
              日本語
            </button>

            <button
              className={`lang-btn ${activeLang === "zh" ? "lang-active" : ""}`}
              onClick={() => setActiveLang("zh")}
            >
              中文
            </button>
          </div>
        </header>

        {/* 소개 글 영역 */}
        <section className="intro-text-area">
          <p id="festival-intro-text">
            이 영역에 축제 소개 기본 문장이 들어갑니다. 나중에 번역 API를 연동해서
            한국어/영어/일본어/중국어로 이 문장을 교체해 줄 예정입니다.
          </p>
        </section>

        {/* 하단 카드 영역 */}
        <section className="intro-card-grid">
          <article className="intro-card">
            <div className="intro-card-image">
              <img
                src="/images/opening.jpg"
                alt="개막식 & 오프닝 퍼레이드"
                className="intro-card-img"
              />
            </div>
            <p className="intro-card-caption">개막식 &amp; 오프닝 퍼레이드</p>
          </article>

          <article className="intro-card">
            <div className="intro-card-image">
              <img
                src="/images/booth3_1.jpg"
                alt="딸기 수확 체험"
                className="intro-card-img"
              />
            </div>
            <p className="intro-card-caption">딸기 수확 체험</p>
          </article>

          <article className="intro-card">
            <div className="intro-card-image">
              <img
                src="/images/booth2.jpg"
                alt="딸기 떡 메치기"
                className="intro-card-img"
              />
            </div>
            <p className="intro-card-caption">딸기 떡 메치기</p>
          </article>

          <article className="intro-card">
            <div className="intro-card-image">
              <img
                src="/images/booth3.jpg"
                alt="케이크 공방"
                className="intro-card-img"
              />
            </div>
            <p className="intro-card-caption">케이크 공방</p>
          </article>
        </section>

        {/* 우측 하단 "자세히 보기" 버튼 */}
        <div className="intro-more-link">
          <button
            className="intro-more-button"
            type="button"
            onClick={() => navigate("/intro/detail")}
          >
            자세히 보기 &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default FestivalIntro;
