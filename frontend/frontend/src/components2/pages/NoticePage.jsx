import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../board/SearchBar";
import BoardTable from "../board/BoardTable";
import Pagination from "../board/Pagination";
import noticeData from "../data/noticeData";

export default function NoticePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // 한 페이지당 글 수

  const totalPages = Math.ceil(noticeData.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = noticeData.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="notice-page2">
      <h2 className="notice-page2-title">공지사항</h2>
      <SearchBar />
      <BoardTable
        data={currentPosts}
        onTitleClick={(id) => navigate(`/notice/${id}`)}
      />
      <Pagination
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
