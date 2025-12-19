import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/gallery.css";

export default function BoothImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/gallery/albums/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("앨범을 찾을 수 없습니다.");
        return res.json();
      })
      .then((data) => {
        console.log("백엔드 응답 데이터:", data); // 디버깅용 로그
        setAlbumData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("에러:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{textAlign:"center", marginTop: "50px"}}>로딩 중...</div>;
  if (!albumData) return <div style={{textAlign:"center", marginTop: "50px"}}>존재하지 않는 앨범입니다.</div>;

  const { albumTitle, items } = albumData;

  return (
    <div className="booth2-detail">
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: "20px", padding: "5px 10px", cursor: "pointer" }}
      >
        ← 목록으로
      </button>

      <h2>{albumTitle}</h2>

      <div className="booth2-images">
        {items && items.length > 0 ? (
          items.map((item, index) => {
            // ▼▼▼ [수정 핵심] imageUrls 배열의 첫 번째 값을 사용 ▼▼▼
            const imgSrc = (item.imageUrls && item.imageUrls.length > 0)
              ? item.imageUrls[0]
              : "/images/default-thumbnail.png"; // 없을 경우 기본 이미지

            return (
              <div key={index}>
                <img
                  src={imgSrc}
                  alt={item.title || "상세 이미지"}
                  className="booth2-detail-img"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "/images/default-thumbnail.png";
                  }}
                />
                {item.caption && <p>{item.caption}</p>}
              </div>
            );
          })
        ) : (
          <div style={{ padding: "50px", textAlign: "center", width: "100%" }}>
            <p>📷 등록된 사진이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}