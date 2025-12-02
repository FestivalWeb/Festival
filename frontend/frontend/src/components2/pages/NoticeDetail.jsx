import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import noticeData from "../data/noticeData";
import PageLayout from "../layout/PageLayout";

// 공지사항 상세페이지
export default function NoticeDetail() {
  const { id } = useParams(); // URL에서 id 가져오기
  const navigate = useNavigate();

  // 페이지 마운트 시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const notice = noticeData.find((n) => n.id === parseInt(id));

  if (!notice) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{
        paddingBottom: "10px",
        borderBottom: "2px solid #333",
        marginBottom: "20px",
      }}>
        {notice.title}
      </h2>
      <div style={{ marginBottom: "10px", color: "#555", textAlign: "right" }}>
        작성자: {notice.dept} | 조회수: {notice.views} | 날짜: {notice.date}
      </div>
      <div style={{ marginBottom: "20px" }}>
        {notice.content}
      </div>
      {notice.file && (
        <img
          src={notice.file}         // noticeData에서 file 경로 가져오기
          alt="공지 이미지"
          style={{ width: "50%", height: "50%", marginTop: "20px" }}
        />
      )}

      <div style={{ marginTop: "40px", textAlign: "left" }}>
        <button
          onClick={() => {
            navigate('/notice');
            window.scrollTo(0, 0);
          }}
          style={{
            padding: "8px 16px",
            border: "2px solid #333",
            borderRadius: "5px",
            backgroundColor: "white",
            color: "#333",
            cursor: "pointer",
          }}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}