// src/components/GallerySection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./GallerySection.css";

function GallerySection() {
  const navigate = useNavigate();

  const handleMoreClick = () => {
    navigate("/gallery");

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
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
            <div className="gallery-thumb">
              <img
                src="/images/booth1.jpg"
                alt="딸기 수확 체험"
                className="gallery-thumb-img"
              />
            </div>
            <p className="gallery-caption">딸기 수확 체험</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">
              <img
                src="/images/booth2.jpg"
                alt="딸기 떡 메치기"
                className="gallery-thumb-img"
              />
            </div>
            <p className="gallery-caption">딸기 떡 메치기</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">
              <img
                src="/images/booth3.jpg"
                alt="케이크 공방"
                className="gallery-thumb-img"
              />
            </div>
            <p className="gallery-caption">케이크 공방</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">
              <img
                src="/images/booth4.jpg"
                alt="지역 농특산물 판매존"
                className="gallery-thumb-img"
              />
            </div>
            <p className="gallery-caption">지역 농특산물 판매존</p>
          </div>
        </div>

        <div className="gallery-more-wrap">
          <button
            className="gallery-more-button"
            type="button"
            onClick={handleMoreClick}
          >
            갤러리 더보기 &gt;
          </button>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
