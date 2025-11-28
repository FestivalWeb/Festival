import React from 'react';

const PostsList = ({ posts = [] }) => {
  return (
    <div className="posts-list">
      <h3>내가 쓴 글 목록</h3>
      <table className="posts-table">
        <thead>
          <tr><th>글번호</th><th>제목</th><th>작성일</th></tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td className="post-title">{p.title}</td>
              <td>{p.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="posts-actions">
        <div className="pager">&nbsp;|&nbsp; &lt; 1 &gt; &nbsp;|&nbsp;</div>
        <button className="btn-primary">목록</button>
      </div>
    </div>
  );
};

export default PostsList;
