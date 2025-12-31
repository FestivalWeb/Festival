import React from "react";
import "../styles/board.css";

// 공지사항, 게시판에서 공통으로 사용하는 파일 틀
export default function BoardTable({ data, onTitleClick }) {
  return (
    <table className="board-table2">
      <thead>
        <tr>
          <th>글 번호</th>
          <th>제목</th>
          <th>작성자</th>
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
            {/* 첨부파일 아이콘 표시 */}
            <td>
              {item.file ? (
                <span style={{ fontSize: "18px" }}>📁</span>
              ) : (
                ""
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
