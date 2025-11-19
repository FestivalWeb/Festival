import React from "react";
import "../styles/board.css";

export default function BoardTable({ data, onTitleClick }) {
  return (
    <table className="board-table">
      <thead>
        <tr>
          <th>글 번호</th>
          <th>제목</th>
          <th>부서명</th>
          <th>조회수</th>
          <th>작성일</th>
          <th>첨부파일</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
             <td>{item.id}</td>
             <td>
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => onTitleClick(item.id)}
              >
                {item.title}
              </span>
            </td>
            {/* <td>{item.type}</td> */}
            {/* <td>{item.title}</td> */}
            <td>{item.dept}</td>
            <td>{item.views}</td>
            <td>{item.date}</td>
            <td>{item.file}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
