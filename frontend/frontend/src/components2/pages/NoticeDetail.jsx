import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import noticeData from "../data/noticeData"; // [삭제] 더 이상 안 씀
import PageLayout from "../layout/PageLayout";

// 공지사항 상세페이지
export default function NoticeDetail() {
  const { id } = useParams(); // URL에서 실제 DB ID(realId) 가져옴
  const navigate = useNavigate();
  
  // [추가] 실제 데이터를 담을 state
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  // 페이지 마운트 시 데이터 불러오기
  useEffect(() => {
    window.scrollTo(0, 0); // 스크롤 맨 위로

    // [핵심] 백엔드 API 호출해서 상세 정보 가져오기
    // (이때 백엔드에서 조회수도 1 증가시켜 줍니다)
    fetch(`/api/notices/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("데이터 로딩 실패");
        return res.json();
      })
      .then(data => {
        // DTO 변수명에 맞춰서 state에 저장
        setNotice({
          title: data.title,
          dept: data.writer || "관리자", 
          views: data.viewCount || 0,
          date: data.createDate ? data.createDate.split('T')[0] : '-',
          content: data.content,
          file: (data.images && data.images.length > 0) ? data.images[0].storageUri : null
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ padding: "20px" }}>로딩 중...</div>;
  }

  if (!notice) {
    return <div style={{ padding: "20px" }}>공지사항을 찾을 수 없습니다.</div>;
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
      
      {/* 내용 부분 (줄바꿈 처리) */}
      <div style={{ marginBottom: "20px", whiteSpace: "pre-wrap", minHeight: "200px" }}>
        {notice.content}
      </div>
      
      {/* 이미지 표시 */}
      {notice.file && (
        <img
          src={notice.file} 
          alt="공지 이미지"
          style={{ maxWidth: "100%", marginTop: "20px" }}
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