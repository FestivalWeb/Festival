import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import SearchBar from "../components2/board/SearchBar"; // 경로 확인 필요
import BoardTable from "../components2/board/BoardTable"; // 경로 확인 필요
import Pagination from "../components2/board/Pagination"; // 경로 확인 필요
import "../components2/styles/board.css"; // 기존 스타일 재활용

export default function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [boardInfo, setBoardInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // 데이터 불러오기
  useEffect(() => {
    if (!boardId) return;

    // 1. 게시판 정보 가져오기 (제목 표시용)
    api.get(`/api/boards/${boardId}`)
      .then(res => setBoardInfo(res.data))
      .catch(() => {
        alert("존재하지 않는 게시판입니다.");
        navigate("/");
      });

    // 2. 글 목록 가져오기 (1페이지)
    fetchPosts(1);
  }, [boardId]);

  const fetchPosts = (page) => {
    api.get(`/api/posts`, { params: { boardId, page: page - 1, size: 10 } })
      .then(res => {
        setPosts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(page);
      })
      .catch(err => console.error(err));
  };

  if (!boardInfo) return <div style={{padding:'100px', textAlign:'center'}}>Loading...</div>;

  return (
    <div className="notice-page2" style={{ paddingTop: '120px' }}> {/* 헤더 높이만큼 패딩 */}
      <h2 className="notice-page2-title">{boardInfo.name}</h2>
      
      <SearchBar />
      
      {/* 백엔드 데이터를 BoardTable 형식에 맞게 변환 */}
      <BoardTable
        data={posts.map(p => ({
          id: p.postId,
          title: p.title,
          dept: p.writerName || '관리자',
          views: p.viewCount,
          date: p.createDate ? p.createDate.substring(0, 10) : '-',
          file: false 
        }))}
        onTitleClick={(postId) => navigate(`/post/${postId}`)}
      />

      {/* 글쓰기 버튼 (권한 체크는 여기서!) */}
      {/* 예: boardInfo.writeRole === 'MEMBER' 이면 버튼 표시 */}
      <div style={{ textAlign: "right", marginTop: "20px", maxWidth: '1200px', margin: '20px auto' }}>
        <button 
          onClick={() => navigate('/write', { state: { boardId } })}
          style={{ padding: "8px 16px", background: "#ff2f72", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          글쓰기
        </button>
      </div>

      <Pagination
        totalPages={totalPages}
        onPageChange={fetchPosts}
      />
    </div>
  );
}