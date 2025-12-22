import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // 현재 로그인한 사용자 아이디 가져오기
  const loginUserId = localStorage.getItem("userId"); 

  useEffect(() => {
    // 1. 백엔드 API 호출
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("게시글을 불러오는데 실패했습니다.");
        return res.json();
      })
      .then((data) => {
        console.log("상세 데이터:", data);
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("에러 발생:", err);
        setLoading(false);
      });
  }, [id]);

  // [추가] 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        alert("삭제되었습니다.");
        navigate("/post");
      } else {
        const msg = await res.text();
        alert("삭제 실패: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  // [추가] 게시글 수정 페이지 이동
  const handleEdit = () => {
    // 수정 페이지로 이동하며 현재 글 데이터 전달
    // (WritePostPage에서 location.state로 받아 처리해야 함)
    navigate("/post/write", { state: { post } }); 
  };

  if (loading) return <div style={{ padding: "20px" }}>로딩 중...</div>;
  if (!post) return <div style={{ padding: "20px" }}>게시글을 찾을 수 없습니다.</div>;

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
        <span>작성자: {post.userId}</span>
        <span style={{ margin: "0 10px" }}>|</span>
        <span>조회수: {post.view}</span>
        <span style={{ margin: "0 10px" }}>|</span>
        <span>날짜: {post.createDate ? post.createDate.replace('T', ' ') : ''}</span>
      </div>

      <div style={{ marginTop: "30px", minHeight: "200px", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
        {post.context}
      </div>

      <div style={{ marginTop: "20px" }}>
        {post.images && post.images.length > 0 && post.images.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:8080${img.storageUri || img.thumbUri}`} 
            alt={`첨부이미지-${index}`}
            style={{ maxWidth: "100%", display: "block", marginBottom: "10px", borderRadius: "4px" }}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: "40px", textAlign: "center", display: "flex", justifyContent: "center", gap: "10px" }}>
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
          목록으로
        </button>

        {/* 작성자 본인일 경우에만 수정/삭제 버튼 표시 */}
        {loginUserId === post.userId && (
          <>
            <button 
              onClick={handleEdit} 
              style={{ 
                padding: "10px 20px", 
                border: "1px solid #4CAF50", 
                borderRadius: "5px", 
                backgroundColor: "#4CAF50", 
                color: "white", 
                cursor: "pointer",
                fontWeight: "bold" 
              }}>
              수정
            </button>
            <button 
              onClick={handleDelete} 
              style={{ 
                padding: "10px 20px", 
                border: "1px solid #f44336", 
                borderRadius: "5px", 
                backgroundColor: "#f44336", 
                color: "white", 
                cursor: "pointer",
                fontWeight: "bold"
              }}>
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
}