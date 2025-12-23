import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // axios 설정 파일 (경로 확인 필요!)
import "./ExperienceBoothSection.css";

function ExperienceBoothSection() {
  const navigate = useNavigate();
  const [boothList, setBoothList] = useState([]); // 초기값 빈 배열

  // 1. 데이터 불러오기
  useEffect(() => {
    api.get("/api/booths")
      .then((res) => {
        // 성공 시: 데이터가 있으면 앞에서 4개만 자름
        if (res.data && Array.isArray(res.data)) {
            setBoothList(res.data.slice(0, 4));
        }
      })
      .catch((err) => {
        // 실패 시: 에러 로그만 찍고 boothList는 빈 배열 상태 유지
        console.error("부스 목록 로딩 실패 (백엔드 연결 확인 필요):", err);
        // 따로 에러 UI를 보여주지 않고 조용히 넘어가려면 여기서 아무것도 안 하면 됨
      });
  }, []);

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

  // 이미지 URL 생성 함수
  const getImageUrl = (booth) => {
    if (booth.images && booth.images.length > 0) {
      return `${SERVER_URL}${booth.images[0].storageUri}`;
    }
    // 이미지가 없을 때 보여줄 기본 이미지
    return "https://via.placeholder.com/400x250/ffeef5/e41c54?text=Festival";
  };

  return (
    <section className="booth-page">
      <div className="booth-container">
        <h2 className="booth-title">체험부스 안내</h2>
        <p className="booth-subtext">
          딸기 수확부터 가족 체험, 먹거리 부스까지 다양한 체험을 즐겨보세요.
        </p>

        <div className="booth-grid">
          {/* 데이터가 없거나 로딩 실패 시 안내 문구 표시 */}
          {boothList.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#666" }}>
              <p>현재 준비 중인 부스가 없습니다.</p>
            </div>
          ) : (
            /* 데이터가 있을 때만 카드 렌더링 */
            boothList.map((booth) => (
              <article 
                className="booth-card"
                key={booth.id} 
                onClick={() => handleBoothClick(booth.id)}
              >
                {/* [1] 이미지 영역 */}
                <div className="booth-img-wrap">
                  <img 
                    src={getImageUrl(booth)} 
                    alt={booth.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x250/ffeef5/e41c54?text=No+Image";
                    }}
                  />
                </div>

                {/* [2] 텍스트 컨텐츠 영역 */}
                <div className="booth-content">
                  <h3 className="booth-name">{booth.title}</h3>
                  <p className="booth-desc">
                    {booth.context.length > 35 
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