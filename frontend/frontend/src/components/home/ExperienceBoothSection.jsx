import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // api 모듈 사용
import "./ExperienceBoothSection.css";

function ExperienceBoothSection() {
  const navigate = useNavigate();
  const [boothList, setBoothList] = useState([]);

  // 1. 데이터 불러오기
  useEffect(() => {
    api.get("/api/booths")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
            // 데이터가 있으면 4개까지만 자르기
            setBoothList(res.data.slice(0, 4));
        }
      })
      .catch((err) => {
        console.error("부스 목록 로딩 실패:", err);
      });
  }, []);

  // 이동 시 스크롤 위로 (기존 기능 유지)
  const navigateWithScroll = (path, state = null) => {
    navigate(path, { state });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleMoreClick = () => {
    navigateWithScroll("/booth");
  };

  const handleBoothClick = (id) => {
    navigateWithScroll(`/booth/${id}`);
  };

  // [수정 완료] 이미지 URL 생성 함수
  const getImageUrl = (booth) => {
    // 1순위: 예약 페이지에서 쓰는 대표 이미지(img) 필드가 있으면 이걸 씁니다.
    if (booth.img) {
      // (1) http로 시작하면(외부 링크) 그대로 사용
      if (booth.img.startsWith("http")) {
        return booth.img;
      }
      // (2) [추가된 로직] 프론트엔드 public 폴더 이미지인 경우 (/images 로 시작) -> 그대로 반환
      if (booth.img.startsWith("/images")) {
        return booth.img;
      }
      // (3) 그 외(백엔드 업로드 파일)인 경우 -> 백엔드 주소 붙여서 사용
      return `http://localhost:8080${booth.img}`;
    }

    // 2순위: img 필드는 없는데 images 배열(첨부파일)이 있다면 첫 번째 것 사용
    if (booth.images && booth.images.length > 0) {
      const uri = booth.images[0].storageUri || booth.images[0].url;
      return `http://localhost:8080${uri}`;
    }

    // 3순위: 다 없으면 예약 페이지와 똑같은 기본 이미지 사용
    return "/images/booth1.jpg";
  };

  return (
    <section className="booth-page">
      <div className="booth-container">
        <h2 className="booth-title">체험부스 안내</h2>
        <p className="booth-subtext">
          딸기 수확부터 가족 체험, 먹거리 부스까지 다양한 체험을 즐겨보세요.
        </p>

        <div className="booth-grid">
          {boothList.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#666" }}>
              <p>현재 준비 중인 부스가 없습니다.</p>
            </div>
          ) : (
            boothList.map((booth) => (
              <article 
                className="booth-card"
                key={booth.id} 
                onClick={() => handleBoothClick(booth.id)}
              >
                <div className="booth-img-wrap">
                  <img 
                    // [수정] 위에서 만든 함수로 이미지 주소 가져오기
                    src={getImageUrl(booth)} 
                    alt={booth.title}
                    // 이미지 로딩 실패(엑박) 시 깜빡임 없이 즉시 기본 이미지로 고정
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "/images/booth1.jpg";
                    }}
                  />
                </div>

                <div className="booth-content">
                  <h3 className="booth-name">{booth.title}</h3>
                  <p className="booth-desc">
                    {booth.context && booth.context.length > 35 
                      ? booth.context.substring(0, 35) + "..." 
                      : booth.context}
                  </p>
                  <ul className="booth-info">
                    <li>📅 운영일 : {booth.eventDate}</li>
                    <li>📍 위치 : {booth.location}</li>
                    <li>💰 참가비 : {booth.price > 0 ? `${booth.price.toLocaleString()}원` : "무료"}</li>
                  </ul>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="booth-more-wrap">
          <button
            className="booth-more-button"
            type="button"
            onClick={handleMoreClick}
          >
            체험부스 전체 보기 &gt;
          </button>
        </div>
      </div>
    </section>
  );
}

export default ExperienceBoothSection;