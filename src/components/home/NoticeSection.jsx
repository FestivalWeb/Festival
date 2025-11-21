// src/components/NoticeSection.jsx
import React from "react";
import "./NoticeSection.css";

function NoticeSection() {
  return (
    <section className="notice-page">
      <div className="notice-container">
        <h2 className="notice-title">공지사항</h2>

        <div className="notice-card">
          <table className="notice-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3</td>
                <td>2025년 논산딸기축제 운영 안내</td>
                <td>2025-02-10</td>
                <td>512</td>
              </tr>
              <tr>
                <td>2</td>
                <td>주차 및 셔틀버스 이용 안내</td>
                <td>2025-02-05</td>
                <td>384</td>
              </tr>
              <tr>
                <td>1</td>
                <td>자원봉사자 모집 공고</td>
                <td>2025-01-28</td>
                <td>276</td>
              </tr>
            </tbody>
          </table>

          <button className="notice-more-button">공지사항 더보기 &gt;</button>
        </div>
      </div>
    </section>
  );
}

export default NoticeSection;
