import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import noticeData from "../data/noticeData";
import PageLayout from "../layout/PageLayout";

export default function NoticeDetail() {
  const { id } = useParams(); // URL에서 id 가져오기

  const navigate = useNavigate();

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
        {/* 실제 내용 예시 */}
        2025 논산 딸기 축제
        'K-POP SHOW' 공연 취소 안내

        산불로 인한 국가 재난 상황이 발생하여
        29~30일 공연이 예정되었던
        'K-POP SHOW'가 전면 취소되어 안내해드립니다.
        시민 여러분의 양해 부탁드립니다.

        산불로 피해를 보신 분들께 위로의 말씀을 드리며
        하루빨리 상황이 안정되기를 진심으로 바랍니다.
      </div>
      {notice.file && (
        <img
          src={`/images/k-popfestival.jpg`}         // noticeData에서 file 경로 가져오기
          alt="공지 이미지"
          style={{ width: "50%", height: "50%", marginTop: "20px" }}
        />
      )}

      <div style={{ marginTop: "40px", textAlign: "left" }}>
        <button
          onClick={() => navigate(-1)}
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