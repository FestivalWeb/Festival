import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/layout.css";

export default function Sidebar({ type }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 갤러리의 체험부스 상세 메뉴
  const boothDetailMenu = [
    { label: "딸기 수확 체험", path: "/booth-images/1" },
    { label: "딸기 떡 메치기", path: "/booth-images/2" },
    { label: "케이크 공방", path: "/booth-images/3" },
    { label: "지역 농특산물\n판매존", path: "/booth-images/4" }
  ];

  // 갤러리 상세 메뉴
  const galleryDetailMenu = [
    { label: "체험부스", path: "/booth-images" },
    { label: "공지사항", path: "/notice-images" },
    { label: "게시글", path: "/post-images" },
  ];

  // 현재 경로가 /booth-images/숫자 인지 체크 -> 체험부스1, 2, 3 눌렀을 때 빨간색 활성화
  const isBoothDetail = /^\/booth-images\/\d+$/.test(location.pathname);

  // 메뉴 렌더링 함수
  const renderMenu = (menu) =>
    menu.map((item) => (
      <li
        key={item.label}
        className={location.pathname === item.path ? "active" : ""}
        onClick={() => navigate(item.path)}
      >
        {item.label}
      </li>
    ));

  return (
    <aside className="sidebar">
      <ul>
        {isBoothDetail
          ? renderMenu(boothDetailMenu)
          : type === "galleryDetail"
          ? renderMenu(galleryDetailMenu)
          : [   // 기본 메뉴
              { label: "공지사항", path: "/notice" },
              { label: "게시글", path: "/post" },
              { label: "갤러리", path: "/gallery" },
              { label: "체험 부스 예약", path: "/booth" },
            ].map((item) => (
              <li
                key={item.label}
                className={location.pathname.startsWith(item.path) ? "active" : ""}
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
      </ul>
    </aside>
  );
}
