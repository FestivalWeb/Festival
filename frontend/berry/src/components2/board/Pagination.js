import React from "react";
import "../styles/board.css";

export default function Pagination() {
  const pages = [1, 2, 3, 4, 5];

  return (
    <div className="pagination">
      {pages.map((num) => (
        <a key={num} className={num === 1 ? "active" : ""}>
          {num}
        </a>
      ))}
      <a>{">"}</a>
    </div>
  );
}
