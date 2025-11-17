
import React from "react";
import postData from "../data/postData";

export default function PostImages() {
  // 첨부된 이미지만 가져오기
  const images = postData
    .filter((n) => n.file) // file이 있는 게시글만
    .map((n) => n.file);

  return (
    <div className="image-grid">
      {images.map((src, idx) => (
        <img key={idx} src={src} alt={`게시글 이미지 ${idx}`} />
      ))}
    </div>
  );
}
