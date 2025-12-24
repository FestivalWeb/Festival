import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // api 모듈 사용
import "../styles/gallery.css"; // 스타일 파일

const PostImages = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 기존에 쓰시던 '갤러리 전용 API' 주소로 복구
    api.get("/api/posts/gallery")
      .then((res) => {
        console.log("갤러리 데이터:", res.data); // 데이터 확인용 로그
        // 데이터가 배열인지 확인 후 설정
        if (Array.isArray(res.data)) {
           // 최신글(postId 큰 순서) 정렬
           const sortedData = res.data.sort((a, b) => b.postId - a.postId);
           setPosts(sortedData);
        } else {
           setPosts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("게시글 로드 실패:", err);
        setPosts([]);
        setLoading(false);
      });
  }, []);

  // [핵심] 이미지 주소 처리 (기존 코드 + 엑박 방지)
  const getImageUrl = (item) => {
    // 1. 갤러리 API 데이터 (imageUri)가 있을 때
    if (item.imageUri) {
       return `http://localhost:8080${item.imageUri}`;
    }
    // 2. 만약 일반 Post 데이터(images 배열)로 들어올 경우를 대비
    if (item.images && item.images.length > 0) {
      return `http://localhost:8080${item.images[0].storageUri || item.images[0].thumbUri}`;
    }
    // 3. 이미지가 없으면 무조건 기본 이미지 반환
    return "/images/booth1_1.jpg";
  };

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>로딩 중...</div>;

  return (
    <div className="gallery-detail-container" style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📸 게시글 갤러리</h2>
      
      <div className="image-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
      }}>
        {posts.length > 0 ? (
          posts.map((item) => (
            <div 
              // key는 fileId가 있으면 쓰고, 없으면 postId 사용
              key={item.fileId || item.postId} 
              className="gallery-item"
              onClick={() => navigate(`/post/${item.postId}`)} 
              style={{ 
                cursor: 'pointer', 
                border: '1px solid #eee', 
                borderRadius: '10px', 
                overflow: 'hidden',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                <img 
                  src={getImageUrl(item)} 
                  alt={item.title || "게시글 이미지"} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    transition: 'transform 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1.0)'}
                  // 이미지가 깨지면 즉시 기본 이미지로 교체 (깜빡임 해결)
                  onError={(e) => { 
                    e.target.onerror = null;
                    e.target.src = '/images/booth1_1.jpg'; 
                  }} 
                />
              </div>

              <div style={{ padding: '15px', backgroundColor: '#fff' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {item.title}
                </h4>
                <div style={{ fontSize: '13px', color: '#666', display:'flex', justifyContent:'space-between' }}>
                    <span>📸 작성자</span>
                    {/* 작성자 정보 표시 (writer 필드 우선) */}
                    <span style={{ fontWeight:'bold', color: '#007BFF' }}>
                      {item.writer || item.userId || "알 수 없음"}
                    </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <p>등록된 게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostImages;