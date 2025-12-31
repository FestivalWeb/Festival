import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // api 모듈 사용
import "../styles/gallery.css"; // 스타일 파일

const NoticeImages = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 갤러리 API 호출
    api.get("/api/posts/gallery")
      .then((res) => {
        console.log("공지 갤러리 데이터:", res.data);
        if (Array.isArray(res.data)) {
           // [핵심] 공지사항(NOTICE) 타입만 필터링
           const noticeImages = res.data.filter((item) => item.type === "NOTICE");
           
           // 최신순 정렬 (DTO의 postId 필드에 noticeId가 들어있음)
           const sortedData = noticeImages.sort((a, b) => b.postId - a.postId);
           setNotices(sortedData);
        } else {
           setNotices([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("공지사항 로드 실패:", err);
        setNotices([]);
        setLoading(false);
      });
  }, []);

  // [핵심] 이미지 주소 처리
  const getImageUrl = (item) => {
    // 1. 갤러리 API 데이터 (imageUri)가 있을 때
    if (item.imageUri) {
       return `http://localhost:8080${item.imageUri}`;
    }
    // 2. 만약 일반 데이터 구조로 들어올 경우 대비
    if (item.images && item.images.length > 0) {
      return `http://localhost:8080${item.images[0].storageUri || item.images[0].thumbUri}`;
    }
    // 3. 이미지가 없으면 기본 이미지
    return "/images/booth1_1.jpg";
  };

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>로딩 중...</div>;

  return (
    <div className="gallery-detail-container" style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📢 공지사항 갤러리</h2>
      
      <div className="image-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
      }}>
        {notices.length > 0 ? (
          notices.map((item) => (
            <div 
              // key는 fileId가 있으면 쓰고, 없으면 postId(noticeId) 사용
              key={item.fileId || item.postId} 
              className="gallery-item"
              // 클릭 시 공지사항 상세 페이지로 이동
              onClick={() => navigate(`/notice/${item.postId}`)} 
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
                  alt={item.title || "공지 이미지"} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    transition: 'transform 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1.0)'}
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
                    <span>📢 작성자</span>
                    <span style={{ fontWeight:'bold', color: '#ff5722' }}>
                      {item.writer || "관리자"}
                    </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <p>등록된 공지사항 이미지가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeImages;