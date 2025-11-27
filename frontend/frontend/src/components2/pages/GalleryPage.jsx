import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/gallery.css";

// 갤러리누르면 가장 먼저 있는 페이지
export default function GalleryPage() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "체험부스", path: "/booth-images", img: "/images/booth.jpg" },
    { label: "공지사항", path: "/notice-images", img: "/images/notice.jpg" },
    { label: "게시글", path: "/post-images", img: "/images/post.jpg" },
  ];

  return (
     <div className="gallery-page2">
      <div className="gallery-page2-list">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="gallery-page2-card"
            onClick={() => navigate(item.path)}
          >
            <img src={item.img} alt={item.label} className="gallery-page2-img" />
            <span className="gallery-page2-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
