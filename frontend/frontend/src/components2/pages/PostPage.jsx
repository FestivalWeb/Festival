import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../board/SearchBar";
import BoardTable from "../board/BoardTable";
import Pagination from "../board/Pagination";
// import postData from "../data/postData"; // 더미 데이터는 주석 처리 또는 삭제
import { useAuth } from "../../context/AuthContext";

export default function PostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // AuthContext에서 사용자 정보 가져옴 (없으면 null)

  // 데이터 상태 관리
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  
  // 검색 및 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("ALL");

  // 1. URL 쿼리스트링(헤더 검색) 확인
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryKeyword = params.get("keyword");
    
    if (queryKeyword) {
      setKeyword(queryKeyword);
      setSearchType("TITLE"); // 헤더 검색은 기본적으로 제목 검색 등으로 설정
    }
  }, [location.search]);

  // 2. 데이터 불러오기 (페이지나 키워드가 바뀔 때마다 실행)
  useEffect(() => {
    fetchPosts(currentPage, keyword, searchType);
  }, [currentPage, keyword, searchType]);

  const fetchPosts = async (page, kw, type) => {
    try {
      // Spring Boot Page는 0부터 시작하므로 page - 1
      let url = `/api/posts?page=${page - 1}&size=10&direction=DESC`;
      
      if (kw) {
        url += `&keyword=${encodeURIComponent(kw)}&type=${type}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        
        // 전체 게시글 수 가져오기
        const totalElements = data.totalElements; 
        
        // 백엔드 응답을 BoardTable 포맷에 맞게 변환
        const formattedData = data.content.map((p, index) => ({
          // [보여주기용 가상 번호 계산]
          // 공식: 전체개수 - (현재페이지 * 10) - 현재인덱스
          id: totalElements - ((page - 1) * 10) - index, 
          
          realId: p.postId, // [중요] 실제 DB ID (클릭 시 이동용)
          title: p.title,
          dept: p.userId, 
          views: p.view,
          date: p.createDate ? p.createDate.split('T')[0] : '',
          file: p.thumbnailUri
        }));

        setPosts(formattedData);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("게시글 로드 실패:", error);
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = (type, kw) => {
    setSearchType(type);
    setKeyword(kw);
    setCurrentPage(1); // 검색 시 1페이지로 초기화
  };

  const handleWriteClick = () => {
    // 1. 로그인 체크 (Context 사용 권장)
    // localStorage도 가능하지만 Context와 동기화가 안 될 수 있음
    const userId = localStorage.getItem("userId"); 

    if (!userId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    
    // [핵심 수정] 글쓰기 경로를 /write -> /post/write 로 변경
    navigate("/post/write");
  };

  return (
    <div className="post-page">
      <h2 className="post-page-title">게시글</h2>
      
      {/* 검색창 */}
      <SearchBar onSearch={handleSearch} />
      
      {/* 게시글 목록 */}
      <BoardTable
        data={posts}
        onTitleClick={(id) => {
            // posts 배열에서 클릭된 항목(가상 번호 id)을 찾아 진짜 ID(realId)로 이동
            const clickedPost = posts.find(p => p.id === id);
            if (clickedPost) {
                navigate(`/post/${clickedPost.realId}`);
            }
        }}
      />
      
      {/* 페이지네이션 + 글쓰기 버튼 */}
      <div className="pagination-wrapper">
        <Pagination
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
       <div className="write-button-wrapper">
        <button className="write-fab" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>
    </div>
    </div>
  );
}