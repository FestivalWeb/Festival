import React, { useState } from "react";
import "../styles/board.css";

// onSearch: (type, keyword) => void 형태의 함수를 props로 받음
export default function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("TITLE"); // 기본값: 제목

  const handleSearch = () => {
    if (onSearch) {
      onSearch(type, keyword);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-box">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="TITLE">제목</option>
        <option value="CONTENT">내용</option>
        <option value="user">작성자</option>
      </select>

      <input 
        type="text" 
        placeholder="검색어를 입력하세요." 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleSearch}>검색</button>
    </div>
  );
}