import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../board/SearchBar";
import BoardTable from "../board/BoardTable";
import Pagination from "../board/Pagination";

export default function PostPage() {
  const navigate = useNavigate();
  const location = useLocation();

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
        // data.content: 게시글 목록, data.totalPages: 전체 페이지 수
        
        // 백엔드 응답을 BoardTable 포맷에 맞게 변환
        const formattedData = data.content.map(p => ({
          id: p.postId,
          title: p.title,
          dept: p.userId, // 작성자 ID를 부서명 위치에 표시 (또는 닉네임)
          views: p.view,
          date: p.createDate ? p.createDate.split('T')[0] : '', // 날짜 포맷팅
          file: p.thumbnailUri // 썸네일 존재 여부 확인용
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

  return (
    <div className="post-page">
      <h2 className="post-page-title">자유게시판</h2>
      
      {/* 검색창 */}
      <SearchBar onSearch={handleSearch} />
      
      {/* 게시글 목록 */}
      <BoardTable
        data={posts}
        onTitleClick={(id) => navigate(`/post/${id}`)}
      />
      
      {/* 페이지네이션 */}
      {posts.length > 0 && (
        <Pagination
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}