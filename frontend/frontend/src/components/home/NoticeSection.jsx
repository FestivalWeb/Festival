import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; 
import "./NoticeSection.css";

function NoticeSection() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]); 
  const [totalElements, setTotalElements] = useState(0); // [추가] 전체 글 개수 저장

  useEffect(() => {
    // 최신 공지사항 3개 조회 (page=0)
    api.get("/api/notices?page=0&size=3")
      .then((res) => {
        if (res.data && res.data.content) {
          setNotices(res.data.content);
          // [추가] 전체 데이터 개수 저장 (가짜 번호 계산용)
          setTotalElements(res.data.totalElements); 
        }
      })
      .catch((err) => {
        console.error("메인 공지사항 로드 실패:", err);
      });
  }, []);

  const handleMoreClick = () => {
    navigate("/notice"); 
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleTitleClick = (id) => {
    navigate(`/notice/${id}`); 
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
              {notices.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                notices.map((notice, index) => (
                  <tr key={notice.noticeId}>
                    {/* [수정] 가짜 번호 계산: 전체개수 - 인덱스 */}
                    {/* (메인화면은 항상 1페이지이므로 page 계산 불필요) */}
                    <td>{totalElements - index}</td>
                    
                    <td
                      className="notice-title-link"
                      onClick={() => handleTitleClick(notice.noticeId)}
                      style={{ cursor: "pointer" }}
                    >
                      {notice.title}
                    </td>
                    
                    {/* 날짜 포맷팅 */}
                    <td>
                      {notice.createDate ? notice.createDate.split("T")[0] : "-"}
                    </td>
                    
                    <td>{notice.viewCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button className="notice-more-button" onClick={handleMoreClick}>
            공지사항 더보기 &gt;
          </button>
        </div>
      </div>
    </section>
  );
}

export default NoticeSection;