// src/components/ExperienceBoothSection.jsx
import React from "react";
import "./ExperienceBoothSection.css";

function ExperienceBoothSection() {
  return (
    <section className="booth-page">
      <div className="booth-container">
        <h2 className="booth-title">체험부스 안내</h2>
        <p className="booth-subtext">
          딸기 수확부터 가족 체험, 먹거리 부스까지 다양한 체험을 즐겨보세요.
        </p>

        <div className="booth-grid">
          <article className="booth-card">
            <h3 className="booth-name">딸기 수확 체험존</h3>
            <p className="booth-desc">
              현장에서 직접 딸기를 따고 맛볼 수 있는 인기 부스입니다.
            </p>
            <ul className="booth-info">
              <li>운영시간 : 10:00 ~ 17:00</li>
              <li>위치 : A존 1번 라인</li>
              <li>참가비 : 1인 10,000원</li>
            </ul>
          </article>

          <article className="booth-card">
            <h3 className="booth-name">딸기 디저트 만들기</h3>
            <p className="booth-desc">
              생딸기를 이용한 케이크·타르트·파르페 만들기 체험입니다.
            </p>
            <ul className="booth-info">
              <li>운영시간 : 11:00 / 14:00 / 16:00</li>
              <li>위치 : B존 푸드 체험관</li>
              <li>사전예약 권장</li>
            </ul>
          </article>

          <article className="booth-card">
            <h3 className="booth-name">키즈 놀이존</h3>
            <p className="booth-desc">
              어린이들을 위한 에어바운스, 페이스페인팅, 스탬프 투어 부스입니다.
            </p>
            <ul className="booth-info">
              <li>운영시간 : 10:00 ~ 18:00</li>
              <li>위치 : C존 가족 체험 구역</li>
              <li>보호자 동반 필수</li>
            </ul>
          </article>

          <article className="booth-card">
            <h3 className="booth-name">지역 농특산물 판매존</h3>
            <p className="booth-desc">
              논산 지역 농가가 직접 참여하는 농특산물 판매·홍보 부스입니다.
            </p>
            <ul className="booth-info">
              <li>운영시간 : 10:00 ~ 20:00</li>
              <li>위치 : 메인 광장 주변</li>
              <li>시식 코너 운영</li>
            </ul>
          </article>
        </div>

        <div className="booth-more-wrap">
          <button className="booth-more-button" type="button">
            체험부스 전체 보기 &gt;
          </button>
        </div>
      </div>
    </section>
  );
}

export default ExperienceBoothSection;
