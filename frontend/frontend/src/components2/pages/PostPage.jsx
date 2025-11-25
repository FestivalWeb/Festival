import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../board/SearchBar";
import BoardTable from "../board/BoardTable";
import Pagination from "../board/Pagination";
import postData from "../data/postData"; // 게시글 더미 데이터

export default function PostsPage() {
  const navigate = useNavigate();

  return (
    <div className="post-page">
      <h2 className="post-page-title">  </h2>
      <SearchBar />
      <BoardTable
        data={postData}
        onTitleClick={(id) => navigate(`/post/${id}`)}
      />
      <Pagination />
    </div>
  );
}
