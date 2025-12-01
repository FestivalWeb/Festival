// src/components/GallerySection.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // ← 추가
import "./GallerySection.css";

function GallerySection() {

  const navigate = useNavigate(); // ← useNavigate 훅 사용

  const handleMoreClick = () => {
    navigate("/gallery"); // /gallery 경로로 이동

    // 2. 이동 후 잠시 기다렸다가 스크롤 (페이지 렌더링 후)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100); // 100ms 정도 충분
  };

  return (
    <section className="gallery-page">
      <div className="gallery-container">
        <h2 className="gallery-title">갤러리</h2>

        <p className="gallery-subtext">
          축제 현장의 분위기를 사진으로 만나보세요.
        </p>

        <div className="gallery-grid">
          <div className="gallery-card">
            <div className="gallery-thumb">사진 1</div>
            <p className="gallery-caption">딸기 수확 체험</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">사진 2</div>
            <p className="gallery-caption">딸기 떡 메치기</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">사진 3</div>
            <p className="gallery-caption">케이크 공방</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">사진 4</div>
            <p className="gallery-caption">지역 농특산물 판매존</p>
          </div>
        </div>

        <div className="gallery-more-wrap">
          <button className="gallery-more-button" type="button" onClick={handleMoreClick}>
            갤러리 더보기 &gt;
          </button>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
