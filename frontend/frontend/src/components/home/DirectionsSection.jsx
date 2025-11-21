// src/components/DirectionsSection.jsx
import React from "react";
import "./DirectionsSection.css";

function DirectionsSection() {
  return (
    <section className="directions-page">
      <div className="directions-container">
        <h2 className="directions-title">오시는 길</h2>
        <p className="directions-subtext">
          논산딸기축제가 열리는 행사장 위치와 교통편을 안내해 드립니다.
        </p>

        {/* 상단: 지도 + 기본 정보 */}
        <div className="directions-top">
          <div className="directions-map">
            <span className="directions-map-placeholder">
              지도 영역 (추후 API 연동)
            </span>
          </div>

          <div className="directions-info-card">
            <h3 className="directions-info-title">행사장 정보</h3>
            <ul className="directions-info-list">
              <li>
                <strong>주소</strong> : 충남 논산시 ○○로 123, 논산시관광단지 일원
              </li>
              <li>
                <strong>문의처</strong> : 논산딸기축제 조직위원회 (☎ 041-000-0000)
              </li>
              <li>
                <strong>행사기간</strong> : 2025. 3. 27(목) ~ 3. 30(일)
              </li>
            </ul>
          </div>
        </div>

        {/* 하단: 교통 안내 */}
        <div className="directions-bottom">
          <div className="directions-card">
            <h3 className="directions-card-title">대중교통 안내</h3>
            <ul className="directions-card-list">
              <li>
                <strong>기차</strong> : 논산역 하차 → 셔틀버스 또는 시내버스 이용
              </li>
              <li>
                <strong>버스</strong> : 논산종합버스터미널 하차 → 행사장 순환 버스
                탑승
              </li>
              <li>
                <strong>시내버스</strong> : ○○번, △△번 탑승 후{" "}
                <span>관광단지 입구</span> 정류장에서 하차
              </li>
            </ul>
          </div>

          <div className="directions-card">
            <h3 className="directions-card-title">자가용 &amp; 주차안내</h3>
            <ul className="directions-card-list">
              <li>
                <strong>내비게이션</strong> :{" "}
                <span>&quot;논산딸기축제 주차장&quot;</span> 검색
              </li>
              <li>
                <strong>주차장</strong> : 제1, 제2 임시 주차장 운영 (도보 5~10분)
              </li>
              <li>
                <strong>셔틀버스</strong> : 주차장 ↔ 행사장 간 무료 셔틀 운행
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DirectionsSection;
