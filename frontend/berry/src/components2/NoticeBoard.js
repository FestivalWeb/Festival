import React from "react";

export default function NoticeBoard() {
  const data = [
    {
      id: 1,
      title: "2025년 논산딸기축제 EDM DJ SHOW 공연 취소 안내",
      dept: "논산딸기축제팀",
      views: 1129,
      date: "2025-10-27",
    }
  ];

  return (
    <div className="notice-container">
      <h2>공지사항</h2>

      <div className="search-box">
        <select>
          <option>제목</option>
          <option>내용</option>
        </select>
        <input type="text" placeholder="검색어를 입력하세요" />
        <button>검색</button>
      </div>

      <table className="notice-table">
        <thead>
          <tr>
            <th>글 번호</th>
            <th>제목</th>
            <th>부서명</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>공지</td>
              <td>{row.title}</td>
              <td>{row.dept}</td>
              <td>{row.views}</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
      </div>
    </div>
  );
}
