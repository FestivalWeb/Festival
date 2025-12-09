import React from "react";
import postData from "../data/postData";

// 게시글에 첨부된 이미지만 모아놓음 (갤러리의 게시글탭)
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
