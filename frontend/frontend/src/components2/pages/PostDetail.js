import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import postData from "../data/postData"; // 게시글 더미 데이터

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = postData.find((p) => p.id === parseInt(id));

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{
        paddingBottom: "10px",
        borderBottom: "2px solid #333",
        marginBottom: "20px",
      }}>
        {post.title}
      </h2>
      <div style={{ marginBottom: "10px", color: "#555" }}>
        작성자: {post.author} | 조회수: {post.views} | 날짜: {post.date}
      </div>
      <div style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
        {post.content}
      </div>
      {post.file && (
        <img
          src={post.file}
          alt="게시글 이미지"
          style={{ width: "50%", height: "50%", marginTop: "20px" }}
        />
      )}
      <button style={{
        marginTop: "20px", padding: "8px 16px",
        border: "2px solid #333",
        borderRadius: "5px",
        backgroundColor: "white",
        color: "#333",
        cursor: "pointer",
      }} onClick={() => navigate(-1)}>
        목록으로 돌아가기
      </button>
    </div>
  );
}
