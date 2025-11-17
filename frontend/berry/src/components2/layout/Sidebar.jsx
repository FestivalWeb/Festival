import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/layout.css";

export default function Sidebar({ type }) {
  const navigate = useNavigate();

  const galleryDetailMenu = [
    { label: "체험부스", path: "/booth-images" },
    { label: "공지사항", path: "/notice-images" },
    { label: "게시글", path: "/post-images" },
  ];

  return (
    <aside className="sidebar">
      {/* <h2>알림마당</h2> */}
      <ul>
        {type === "galleryDetail"
          ? galleryDetailMenu.map((item) => (
              <li key={item.label} onClick={() => navigate(item.path)}>
                {item.label}
              </li>
            ))
          : (
              <>
                <li><Link to="/notice">공지사항</Link></li>
                <li><Link to="/post">게시글</Link></li>
                <li><Link to="/gallery">갤러리</Link></li>
                <li><Link to="/booth">체험 부스</Link></li>
              </>
            )
        }
      </ul>
    </aside>
  );
}
