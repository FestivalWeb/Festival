import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext"; // [추가] 로그인 정보 가져오기
import SearchBar from "../components2/board/SearchBar"; // 경로 확인 필요
import BoardTable from "../components2/board/BoardTable"; // 경로 확인 필요
import Pagination from "../components2/board/Pagination"; // 경로 확인 필요
import "../components2/styles/board.css"; // 기존 스타일 재활용

export default function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // [추가] 현재 로그인한 사용자 정보 (없으면 null)

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

  // ▼ [추가됨] 글쓰기 권한 체크 함수
  const canWrite = () => {
    // 1. 게시판 정보가 아직 안 왔으면 불가
    if (!boardInfo) return false;

    const role = boardInfo.writeRole; // DB에 설정된 쓰기 권한 (PUBLIC, MEMBER, ADMIN...)

    // 2. 전체 공개(PUBLIC)라면 누구나 가능
    if (role === 'PUBLIC') return true;

    // 3. 그 외 권한은 무조건 '로그인'이 되어 있어야 함
    if (!user) return false;

    // 4. 관리자 전용(ADMIN, SUPER 등) 게시판인데, 내가 관리자가 아니면 불가
    // (Login.jsx에서 user.id가 'admin'이거나 user.role이 'ADMIN'인 경우를 관리자로 간주)
    if (['ADMIN', 'SUPER', 'MANAGER'].includes(role)) {
       const isAdmin = user.id === 'admin' || user.role === 'ADMIN'; 
       return isAdmin;
    }

    // 5. 회원 전용(MEMBER) -> 로그인만 했으면 통과
    if (role === 'MEMBER') return true;

    return false; // 그 외 알 수 없는 권한이면 일단 막음
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
      {/* ▼ [수정됨] canWrite() 함수가 true일 때만 버튼을 보여줌 */}
      {canWrite() && (
        <div style={{ textAlign: "right", marginTop: "20px", maxWidth: '1200px', margin: '20px auto' }}>
          <button 
            onClick={() => navigate('/write', { state: { boardId } })}
            style={{ padding: "8px 16px", background: "#ff2f72", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            글쓰기
          </button>
        </div>
      )}

      <Pagination
        totalPages={totalPages}
        onPageChange={fetchPosts}
      />
    </div>
  );
}