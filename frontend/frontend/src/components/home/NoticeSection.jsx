// src/components/NoticeSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // ← import 추가
import "./NoticeSection.css";

function NoticeSection() {

  const navigate = useNavigate(); // ← useNavigate 훅 사용

  const handleMoreClick = () => {
    navigate("/notice"); // /notice 경로로 이동
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // 제목 클릭 시 해당 공지사항 상세 페이지로 이동
  const handleTitleClick = (id) => {
    navigate(`/notice/${id}`); // /notice/:id 경로로 이동
  };

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
                <td
                  className="notice-title-link"
                  onClick={() => handleTitleClick(3)} // 3번 공지사항의 상세 페이지로 이동
                >
                  2025년 논산딸기축제 EDM DJ SHOW 공연 취소 안내
                </td>
                <td>2025-02-10</td>
                <td>512</td>
              </tr>
              <tr>
                <td>2</td>
                <td className="notice-title-link"
                  onClick={() => handleTitleClick(2)} // 2번 공지사항의 상세 페이지로 이동
                >
                  주차 및 셔틀버스 이용 안내
                </td>
                <td>2025-02-05</td>
                <td>384</td>
              </tr>
              <tr>
                <td>1</td>
                <td
                  className="notice-title-link"
                  onClick={() => handleTitleClick(1)} // 1번 공지사항의 상세 페이지로 이동
                >
                  자원봉사자 모집 공고
                </td>
                <td>2025-01-28</td>
                <td>276</td>
              </tr>
            </tbody>
          </table>

          <button className="notice-more-button" onClick={handleMoreClick}>공지사항 더보기 &gt;</button>
        </div>
      </div>
    </section>
  );
}

export default NoticeSection;
