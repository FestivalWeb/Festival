import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// [수정] 더미 데이터 삭제하고 API 호출로 변경
export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 백엔드 API 호출 (진짜 데이터 가져오기)
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("게시글을 불러오는데 실패했습니다.");
        return res.json();
      })
      .then((data) => {
        console.log("상세 데이터:", data); // 디버깅용
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("에러 발생:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: "20px" }}>로딩 중...</div>;
  if (!post) return <div style={{ padding: "20px" }}>게시글을 찾을 수 없습니다.</div>;

  // 백엔드 데이터 구조에 맞춰서 변수 사용
  // (title, userId, view, createDate, context, images 등)
  
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{
        paddingBottom: "10px",
        borderBottom: "2px solid #333",
        marginBottom: "20px",
      }}>
        {post.title}
      </h2>

      <div style={{ marginBottom: "10px", color: "#555", textAlign: "right", fontSize: "0.9rem" }}>
        {/* 백엔드 필드명: userId, view, createDate */}
        <span>작성자: {post.userId}</span>
        <span style={{ margin: "0 10px" }}>|</span>
        <span>조회수: {post.view}</span>
        <span style={{ margin: "0 10px" }}>|</span>
        <span>날짜: {post.createDate ? post.createDate.replace('T', ' ') : ''}</span>
      </div>

      {/* 본문 내용 (백엔드 필드명: context) */}
      <div style={{ marginTop: "30px", minHeight: "200px", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
        {post.context}
      </div>

      {/* 이미지 출력 */}
      <div style={{ marginTop: "20px" }}>
        {post.images && post.images.length > 0 && post.images.map((img, index) => (
          <img
            key={index}
            // ▼▼▼ [수정] 백엔드 주소(http://localhost:8080)를 앞에 붙여줍니다! ▼▼▼
            src={`http://localhost:8080${img.storageUri || img.thumbUri}`} 
            alt={`첨부이미지-${index}`}
            style={{ maxWidth: "100%", display: "block", marginBottom: "10px", borderRadius: "4px" }}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found"; // 엑박 시 대체 이미지
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={() => navigate('/post')}
          style={{
            padding: "10px 20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "white",
            color: "#333",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}