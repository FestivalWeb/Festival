import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../board/SearchBar";
import BoardTable from "../board/BoardTable";
import Pagination from "../board/Pagination";

export default function NoticePage() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  // [추가] 전체 개수 상태 (가상 번호 계산용)
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchNotices(currentPage, keyword);
  }, [currentPage, keyword]);

  const fetchNotices = async (page, kw) => {
    try {
      let url = `/api/notices?page=${page - 1}&size=10`;
      if (kw) {
        url += `&keyword=${encodeURIComponent(kw)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        
        // [필수] 전체 개수 저장
        const totalElems = data.totalElements;
        setTotalElements(totalElems);

        const formattedData = data.content.map((n, index) => ({
          // [핵심] 가상 번호 계산: 전체개수 - (현재페이지-1)*10 - 인덱스
          id: totalElems - ((page - 1) * 10) - index,
          
          realId: n.noticeId, // 실제 ID (클릭 이동용)
          title: n.title,
          
          // [수정] 백엔드가 보내주는 'writer' 사용
          dept: n.writer || "관리자", 
          
          // [수정] 값이 없으면 0으로 표시
          views: n.viewCount || 0,
          
          // [수정] 날짜가 없으면 '-' 표시
          date: n.createDate ? n.createDate.split('T')[0] : '-',
          
          file: n.images && n.images.length > 0
        }));

        setNotices(formattedData);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("공지사항 로드 실패:", error);
    }
  };

  const handleSearch = (type, kw) => {
    setKeyword(kw);
    setCurrentPage(1);
  };

  return (
    <div className="notice-page2">
      <h2 className="notice-page2-title">공지사항</h2>
      <SearchBar onSearch={handleSearch} />
      <BoardTable
        data={notices}
        // [수정] 가짜 ID 대신 realId를 사용해 상세 페이지로 이동
        onTitleClick={(id) => {
            const clicked = notices.find(n => n.id === id);
            if(clicked) navigate(`/notice/${clicked.realId}`);
        }}
      />
      {notices.length > 0 && (
        <Pagination
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}