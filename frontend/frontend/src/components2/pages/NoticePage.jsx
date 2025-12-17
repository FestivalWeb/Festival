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
        
        const formattedData = data.content.map(n => ({
          id: n.noticeId,
          title: n.title,
          dept: n.adminName || "관리자",
          views: n.viewCount,
          date: n.createDate ? n.createDate.split('T')[0] : '',
          file: n.images && n.images.length > 0 // 첨부파일 여부
        }));

        setNotices(formattedData);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("공지사항 로드 실패:", error);
    }
  };

  const handleSearch = (type, kw) => {
    // 공지사항 API는 type 구분 없이 통합 검색이므로 keyword만 사용
    setKeyword(kw);
    setCurrentPage(1);
  };

  return (
    <div className="notice-page2">
      <h2 className="notice-page2-title">공지사항</h2>
      <SearchBar onSearch={handleSearch} />
      <BoardTable
        data={notices}
        onTitleClick={(id) => navigate(`/notice/${id}`)}
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