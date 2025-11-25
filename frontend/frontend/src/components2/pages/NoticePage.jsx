import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../board/SearchBar";
import BoardTable from "../board/BoardTable";
import Pagination from "../board/Pagination";
import noticeData from "../data/noticeData";

export default function NoticePage() {
  const navigate = useNavigate();

  return (
    <div className="notice-page2">
      <h2 className="notice-page2-title">  </h2>
      <SearchBar />
      <BoardTable
        data={noticeData}
        onTitleClick={(id) => navigate(`/notice/${id}`)}
      />
      <Pagination />
    </div>
  );
}
