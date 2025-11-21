// src/components/GallerySection.jsx
import React from "react";
import "./GallerySection.css";

function GallerySection() {
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
            <p className="gallery-caption">개막식 &amp; 불꽃놀이</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">사진 2</div>
            <p className="gallery-caption">딸기 수확 체험</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">사진 3</div>
            <p className="gallery-caption">야간 공연 무대</p>
          </div>

          <div className="gallery-card">
            <div className="gallery-thumb">사진 4</div>
            <p className="gallery-caption">포토존 &amp; 포토부스</p>
          </div>
        </div>

        <div className="gallery-more-wrap">
          <button className="gallery-more-button" type="button">
            갤러리 더보기 &gt;
          </button>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
