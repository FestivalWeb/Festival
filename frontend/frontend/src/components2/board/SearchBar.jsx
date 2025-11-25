import React from "react";
import "../styles/board.css";

export default function SearchBar() {
  return (
    <div className="search-box">
      <select>
        <option>제목</option>
        <option>내용</option>
      </select>

      <input type="text" placeholder="검색어를 입력하세요." />

      <button>검색</button>
    </div>
  );
}
