import React from "react";
import { useParams } from "react-router-dom";

export default function GalleryDetail() {
  const { year } = useParams();

  // 예시 이미지 URL 배열
  const images = Array.from({ length: 9 }, (_, i) => `/images/${year}/img${i + 1}.jpg`);

  return (
    <div>
      <div className="gallery-detail-grid">
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={`${year} 이미지 ${idx + 1}`} style={{ width: "30%", margin: "1%" }} />
        ))}
      </div>
    </div>
  );
}
