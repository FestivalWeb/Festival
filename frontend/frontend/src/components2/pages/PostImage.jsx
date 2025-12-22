import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/gallery.css'; 

const PostImages = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 서버 API 호출 (가짜 데이터 postData 사용 X)
    fetch('/api/posts/gallery') 
      .then((res) => {
        if (!res.ok) {
          throw new Error(`통신 실패 상태코드: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("받아온 갤러리 데이터:", data);
        setImages(data);
      })
      .catch((err) => console.error("에러 발생:", err));
  }, []);

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
        {images.length > 0 ? (
          images.map((item) => (
            <div 
              key={item.fileId} 
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
                {/* [중요] DB에 저장된 경로는 '/uploads/...' 같은 상대 경로일 수 있으므로
                   앞에 서버 주소(http://localhost:8080)를 붙여줘야 이미지가 보입니다!
                */}
                <img 
                  src={`http://localhost:8080${item.imageUri}`} 
                  alt={item.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    transition: 'transform 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1.0)'}
                  onError={(e) => { e.target.src = '/images/placeholder.png'; }} // 이미지 로딩 실패 시 대체 이미지
                />
              </div>

              <div style={{ padding: '15px', backgroundColor: '#fff' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {item.title}
                </h4>
                <div style={{ fontSize: '13px', color: '#666', display:'flex', justifyContent:'space-between' }}>
                    <span>📸 작성자</span>
                    <span style={{ fontWeight:'bold', color: '#007BFF' }}>{item.writer}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <p>등록된 게시글 이미지가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostImages;