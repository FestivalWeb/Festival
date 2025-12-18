import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../board/SearchBar";
import BoardTable from "../board/BoardTable";
import Pagination from "../board/Pagination";
import postData from "../data/postData"; // 게시글 더미 데이터


export default function PostsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // 한 페이지당 글 수

  const totalPages = Math.ceil(postData.length / postsPerPage);

  // 현재 페이지 글 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = postData.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="post-page">
      <h2 className="post-page-title">게시글</h2>
      <SearchBar />
      <BoardTable
        data={currentPosts}
        onTitleClick={(id) => navigate(`/post/${id}`)}
      />
      {/* 페이지네이션 + 글쓰기 버튼 한 줄로 */}
      <div className="pagination-wrapper">
        <Pagination
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
       <div className="write-button-wrapper">
    <button className="write-fab" onClick={() => navigate("/write")}>
      글쓰기
    </button>
  </div>
    </div>
    </div>
  );
}