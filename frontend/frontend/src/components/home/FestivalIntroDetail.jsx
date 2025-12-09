// src/components/FestivalIntroDetail.jsx
import React, { useRef, useState } from "react";
import "./FestivalIntroDetail.css";

function FestivalIntroDetail() {
  const [activeTab, setActiveTab] = useState("history");

  const historyRef = useRef(null);
  const greetingRef = useRef(null);
  const recordRef = useRef(null);

  const scrollTo = (ref, tabKey) => {
    setActiveTab(tabKey);
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* 상단 타이틀 */}
        <header className="detail-header">
          {/* <div className="detail-header-row">
            <div className="detail-logo">
              <span className="detail-logo-icon">🍓</span>
              <span className="detail-logo-text">논산딸기축제</span>
            </div>
          </div> */}

          {/* 상단 탭 메뉴 3개 */}
          <nav className="detail-top-tabs">
            <button
              type="button"
              className={`detail-tab-btn ${
                activeTab === "history" ? "detail-tab-btn--active" : ""
              }`}
              onClick={() => scrollTo(historyRef, "history")}
            >
              연혁
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${
                activeTab === "greeting" ? "detail-tab-btn--active" : ""
              }`}
              onClick={() => scrollTo(greetingRef, "greeting")}
            >
              인사말
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${
                activeTab === "record" ? "detail-tab-btn--active" : ""
              }`}
              onClick={() => scrollTo(recordRef, "record")}
            >
              행사기록
            </button>
          </nav>
        </header>

        {/* 섹션들 */}
        <main className="detail-main">
          {/* 1. 연혁 */}
          <section ref={historyRef} className="detail-section">
            <h2 className="detail-section-title">논산딸기축제 연혁</h2>

            <div className="detail-card">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>연도</th>
                    <th>개최장소</th>
                    <th>특징</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1997</td>
                    <td>논산 ○○공원</td>
                    <td>제1회 논산딸기축제 개최</td>
                  </tr>
                  <tr>
                    <td>2005</td>
                    <td>논산천 일대</td>
                    <td>체험 프로그램 확대</td>
                  </tr>
                  {/* 필요하면 여기 더 추가 */}
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. 인사말 */}
          <section ref={greetingRef} className="detail-section">
            <h2 className="detail-section-title">인사말</h2>

            <div className="detail-card detail-greeting-card">
              <div className="detail-greeting-photo">사진 영역</div>
              <div className="detail-greeting-text">
                <h3>인사말</h3>
                <p>
                  안녕하십니까, 논산딸기축제에 오신 여러분을 진심으로 환영합니다.
                  풍요로운 논산의 딸기와 함께 따뜻한 추억을 만들어가시길
                  바랍니다.
                </p>
              </div>
            </div>
          </section>

          {/* 3. 행사기록 */}
          <section ref={recordRef} className="detail-section">
            <h2 className="detail-section-title">행사기록</h2>

            <div className="detail-card">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>연도</th>
                    <th>제목</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2025</td>
                    <td>2025년 논산딸기축제 행사 안내</td>
                    <td>512</td>
                  </tr>
                  <tr>
                    <td>2024</td>
                    <td>2024년 논산딸기축제 주요 사진 모음</td>
                    <td>380</td>
                  </tr>
                  {/* 여기도 필요하면 추가 */}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default FestivalIntroDetail;
