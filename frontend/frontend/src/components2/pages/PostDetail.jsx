import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api"; // api 모듈 사용

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // 현재 로그인한 사용자 아이디 가져오기
  const loginUserId = localStorage.getItem("userId"); 

  useEffect(() => {
    api.get(`/api/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("에러 발생:", err);
        setLoading(false);
      });
  }, [id]);

  // 작성자 이름 표시 함수
  const getDisplayAuthor = (postData) => {
      if (postData.adminId) {
          return "관리자";
      }
      return postData.userId || "알 수 없음";
  };

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const res = await api.delete(`/api/posts/${id}`);
      if (res.status === 200 || res.status === 204) {
        alert("삭제되었습니다.");
        navigate("/post");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || "오류가 발생했습니다.";
      alert("삭제 실패: " + msg);
    }
  };

  // 게시글 수정 페이지 이동
  const handleEdit = () => {
    navigate("/post/write", { state: { post } }); 
  };

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>로딩 중...</div>;
  if (!post) return <div style={{ padding: "50px", textAlign: "center" }}>게시글을 찾을 수 없습니다.</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{
        paddingBottom: "10px",
        borderBottom: "2px solid #333",
        marginBottom: "20px",
      }}>
        {post.title}
      </h2>

      <div style={{ marginBottom: "20px", textAlign: "right", color: "#666", fontSize: "0.9rem" }}>
        <span>작성자: {getDisplayAuthor(post)}</span>
        <span style={{ margin: "0 10px" }}>|</span>
        <span>조회수: {post.view}</span>
        <span style={{ margin: "0 10px" }}>|</span>
        <span>날짜: {post.createDate ? post.createDate.replace('T', ' ') : ''}</span>
      </div>

      <div style={{ marginTop: "30px", minHeight: "200px", whiteSpace: "pre-wrap", lineHeight: "1.6", marginBottom: "30px" }}>
        {post.context}
      </div>

      {/* 이미지가 있을 때만 렌더링 */}
      {post.images && post.images.length > 0 && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          {post.images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:8080${img.storageUri || img.thumbUri}`} 
              alt={`첨부이미지-${index}`}
              style={{ width: "100%", borderRadius: "8px", border: "1px solid #eee" }}
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
              }}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: "50px", textAlign: "center", display: "flex", justifyContent: "center", gap: "10px" }}>
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
        {loginUserId && post.userId === loginUserId && (
          <>
            <button 
              onClick={handleEdit} 
              style={{ 
                padding: "10px 20px", 
                border: "none", // [수정] 중복 제거됨
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
                border: "none", // [수정] 중복 제거됨
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