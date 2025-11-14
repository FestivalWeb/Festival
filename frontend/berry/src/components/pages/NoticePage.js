import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../layout/PageLayout";
import SearchBar from "../board/SearchBar";
import BoardTable from "../board/BoardTable";
import Pagination from "../board/Pagination";
import noticeData from "../data/noticeData"; // 여기서만 import

export default function NoticePage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <h2 className="notice-title">공지사항</h2>
      <SearchBar />
      <BoardTable 
        data={noticeData} 
        onTitleClick={(id) => navigate(`/notice/${id}`)}  
      />
      <Pagination />
    </PageLayout>
  );
}
