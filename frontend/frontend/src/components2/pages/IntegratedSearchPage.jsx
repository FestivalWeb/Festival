import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/board.css"; // 기존 스타일 재활용

export default function IntegratedSearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState({ notices: [], posts: [], booths: [] });
  const [loading, setLoading] = useState(false);

  // URL의 ?keyword=... 를 읽어서 검색 실행
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kw = params.get("keyword");
    if (kw) {
      setKeyword(kw);
      fetchSearchResults(kw);
    }
  }, [location.search]);

  const fetchSearchResults = async (kw) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?keyword=${encodeURIComponent(kw)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 결과 카드 렌더링 헬퍼
  const renderList = (list, type) => {
    if (!list || list.length === 0) return <p className="no-result">검색 결과가 없습니다.</p>;

    return (
      <ul className="search-result-list">
        {list.map((item) => (
          <li key={item.id || item.noticeId || item.postId} className="search-item">
            <div 
                className="search-item-title"
                onClick={() => {
                    if (type === 'notice') navigate(`/notice/${item.noticeId}`);
                    if (type === 'post') navigate(`/post/${item.postId}`);
                    // [중요] 부스 클릭 시 state 전달 확인
                    if (type === 'booth') navigate(`/booth/${item.id}`, { state: { booth: item } });
                }}
            >
              <span className="badge">
                {type === 'notice' ? '공지' : type === 'post' ? '게시글' : '부스'}
              </span>
              {/* 제목 표시 */}
              {item.title}
            </div>
            
            {/* 부가 정보 표시 */}
            {item.date && <span className="search-item-date">{item.date}</span>}
            
            {/* [수정] 체험부스는 location 정보를 보여줌 */}
            {type === 'booth' && item.location && (
                <span className="search-item-desc" style={{ marginLeft: '10px', color: '#666', fontSize: '0.9rem' }}>
                    📍 {item.location}
                </span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="layout-content" style={{padding: '40px'}}>
      <h2 style={{borderBottom:'2px solid #333', paddingBottom:'15px', marginBottom:'30px'}}>
        '<span style={{color:'#e91e63'}}>{keyword}</span>' 통합 검색 결과
      </h2>

      {loading ? (
        <p>검색 중...</p>
      ) : (
        <div className="search-sections">
          <section className="search-section">
            <h3>📢 공지사항 ({results.notices.length})</h3>
            {renderList(results.notices, 'notice')}
          </section>

          <section className="search-section">
            <h3>📝 자유게시판 ({results.posts.length})</h3>
            {renderList(results.posts, 'post')}
          </section>

          <section className="search-section">
            <h3>🍓 체험부스 ({results.booths.length})</h3>
            {renderList(results.booths, 'booth')}
          </section>
        </div>
      )}
      
      <style jsx>{`
        .search-section { margin-bottom: 40px; }
        .search-section h3 { font-size: 1.2rem; margin-bottom: 15px; color: #444; }
        .search-result-list { list-style: none; padding: 0; }
        .search-item { 
            padding: 15px 0; 
            border-bottom: 1px solid #eee; 
            display: flex; 
            justify-content: space-between;
            align-items: center;
        }
        .search-item-title { cursor: pointer; font-size: 1.1rem; font-weight: 500; }
        .search-item-title:hover { text-decoration: underline; color: #0056b3; }
        .badge { 
            background: #eee; color: #555; font-size: 0.8rem; padding: 2px 6px; 
            border-radius: 4px; margin-right: 8px; vertical-align: middle;
        }
        .search-item-desc { color: #666; font-size: 0.9rem; margin-left: 10px;}
        .no-result { color: #888; padding: 10px 0; }
      `}</style>
    </div>
  );
}