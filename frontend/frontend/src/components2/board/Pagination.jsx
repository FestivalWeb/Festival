import React, { useState, useEffect } from "react";
import "../styles/board.css";

export default function Pagination({ totalPages, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);

  // 부모 컴포넌트에서 페이지 변경 시 동기화
  useEffect(() => {
    if (onPageChange) onPageChange(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <a
        onClick={handlePrev}
        className={currentPage === 1 ? "disabled" : ""}
        style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
      >
        {"<"}
      </a>

      {pages.map((num) => (
        <a
          key={num}
          className={num === currentPage ? "active" : ""}
          onClick={() => handlePageClick(num)}
          style={{ cursor: "pointer" }}
        >
          {num}
        </a>
      ))}

      <a
        onClick={handleNext}
        className={currentPage === totalPages ? "disabled" : ""}
        style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
      >
        {">"}
      </a>
    </div>
  );
}
