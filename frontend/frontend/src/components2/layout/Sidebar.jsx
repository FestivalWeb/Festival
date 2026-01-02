import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import "../styles/layout.css";

export default function Sidebar({ type }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [boothMenu, setBoothMenu] = useState([]);

  useEffect(() => {
    const isBoothRelated = location.pathname.includes('/booth-images');
    
    if (isBoothRelated) {
        api.get('/api/booths')
          .then((res) => {
            console.log("전체 부스 목록:", res.data); // 콘솔에서 변수명 확인용

            const dynamicMenu = res.data
              .map(booth => {
                // ▼▼▼ [핵심] 백엔드가 줄 수 있는 모든 ID 변수명을 다 찾아봄
                const realId = booth.boothId || booth.booth_id || booth.id;
                
                // ID가 없으면 메뉴를 못 만드니까 null 반환 (나중에 걸러냄)
                if (!realId) return null;

                return {
                    id: realId,
                    label: booth.title,
                    path: `/booth-images/${realId}`
                };
              })
              // ▼▼▼ [에러 방지] ID가 없는 데이터는 화면에 그리지 않고 버림
              .filter(item => item !== null);

            setBoothMenu(dynamicMenu);
          })
          .catch(err => console.error("부스 목록 로딩 실패:", err));
    }
  }, [location.pathname]);

  const galleryDetailMenu = [
    { label: "체험부스", path: "/booth-images" },
    { label: "공지사항", path: "/notice-images" },
    { label: "게시글", path: "/post-images" },
  ];

  const isBoothDetail = /^\/booth-images\/\d+$/.test(location.pathname);

  const renderMenu = (menu) =>
    menu.map((item) => (
      <li
        key={item.path} 
        className={location.pathname === item.path ? "active" : ""}
        onClick={() => navigate(item.path)}
      >
        {item.label}
      </li>
    ));

  return (
    <aside className="sidebar">
      <ul>
        {isBoothDetail && boothMenu.length > 0
          ? renderMenu(boothMenu)
          : type === "galleryDetail"
          ? renderMenu(galleryDetailMenu)
          : [
              { label: "공지사항", path: "/notice" },
              { label: "게시글", path: "/post" },
              { label: "갤러리", path: "/gallery" },
              { label: "체험 부스 예약", path: "/booth" },
            ].map((item) => (
              <li
                key={item.path}
                className={location.pathname.startsWith(item.path) ||
                  (item.path === "/post" && location.pathname === "/write")
                  ? "active" : ""}
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
      </ul>
    </aside>
  );
}