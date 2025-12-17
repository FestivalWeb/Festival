import React, { useState } from 'react';
import './BoardMgmt.css';

const BoardMgmt = () => {
  // --- 1. 상태 관리 ---
  const [boards, setBoards] = useState([
    { id: 1, name: '공지사항', scope: '전체', state: '사용', count: 132, skin: 'basic', date: '2025-11-03' },
    { id: 2, name: '포토갤러리', scope: '회원', state: '사용', count: 87, skin: 'gallery', date: '2025-11-03' },
    { id: 3, name: 'FAQ', scope: '전체', state: '사용', count: 24, skin: 'basic', date: '2025-11-02' },
    { id: 4, name: '내부공지', scope: '관리자', state: '중지', count: 11, skin: 'basic', date: '2025-11-01' },
    { id: 5, name: '이벤트', scope: '전체', state: '사용', count: 5, skin: 'basic', date: '2025-10-31' },
    { id: 6, name: '자유게시판', scope: '회원', state: '사용', count: 450, skin: 'basic', date: '2025-10-20' },
  ]);

  // 필터 및 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL'); // 권한 필터
  const [stateFilter, setStateFilter] = useState('ALL'); // 상태 필터

  // 페이지네이션 및 선택 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedIds, setSelectedIds] = useState([]);

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [targetBoard, setTargetBoard] = useState(null); // 수정할 게시판 데이터

  // --- 2. 로직 처리 ---

  // 필터링 로직
  const filteredBoards = boards.filter(item => {
    const matchSearch = item.name.includes(searchTerm);
    const matchScope = scopeFilter === 'ALL' || item.scope === scopeFilter;
    const matchState = stateFilter === 'ALL' || item.state === stateFilter;
    return matchSearch && matchScope && matchState;
  });

  // 페이지네이션 로직
  const totalPages = Math.ceil(filteredBoards.length / itemsPerPage);
  const currentData = filteredBoards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 체크박스 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(currentData.map(b => b.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // [기능] 수정 버튼 클릭
  const openEditModal = () => {
    if (selectedIds.length !== 1) {
      alert('수정할 게시판을 "하나만" 선택해주세요.');
      return;
    }
    const board = boards.find(b => b.id === selectedIds[0]);
    setTargetBoard(board);
    setShowEditModal(true);
  };

  // [기능] 삭제 버튼 클릭
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 게시판을 선택해주세요.');
      return;
    }
    if (window.confirm(`${selectedIds.length}개의 게시판을 삭제하시겠습니까?`)) {
      setBoards(boards.filter(b => !selectedIds.includes(b.id)));
      setSelectedIds([]);
    }
  };

  return (
    <div className="board-container">
      <div className="page-header">
        <h2>게시판 관리 <span className="sub-text">총 {filteredBoards.length}개</span></h2>
      </div>

      {/* 툴바: 검색 + 필터 + 액션버튼 */}
      <div className="toolbar">
        <div className="filter-area">
          <input 
            type="text" 
            placeholder="게시판명 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select onChange={(e) => setScopeFilter(e.target.value)}>
            <option value="ALL">권한 전체</option>
            <option value="전체">전체 공개</option>
            <option value="회원">회원 전용</option>
            <option value="관리자">관리자 전용</option>
          </select>
          <select onChange={(e) => setStateFilter(e.target.value)}>
            <option value="ALL">상태 전체</option>
            <option value="사용">사용</option>
            <option value="중지">중지</option>
          </select>
          <button className="btn-search-action">검색</button>
        </div>

        <div className="action-buttons">
          <button className="btn-create" onClick={() => setShowCreateModal(true)}>게시판 생성</button>
          <button className="btn-edit" onClick={openEditModal}>게시판 수정</button>
          <button className="btn-delete" onClick={handleDelete}>게시판 삭제</button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-wrapper">
        <table className="board-table">
          <thead>
            <tr>
              <th style={{width: '50px'}}>
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={selectedIds.length === currentData.length && currentData.length > 0}
                />
              </th>
              <th>게시판명</th>
              <th>권한</th>
              <th>상태</th>
              <th>게시물수</th>
              <th>스킨</th>
              <th>수정일</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((board) => (
              <tr key={board.id} className={selectedIds.includes(board.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(board.id)}
                    onChange={() => handleSelectOne(board.id)}
                  />
                </td>
                <td>{board.name}</td>
                <td><span className={`badge scope-${board.scope}`}>{board.scope}</span></td>
                <td>
                  <span className={`status-pill ${board.state === '사용' ? 'active' : 'stopped'}`}>
                    {board.state}
                  </span>
                </td>
                <td>{board.count}</td>
                <td>{board.skin}</td>
                <td>{board.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt;</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i + 1} 
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&gt;</button>
      </div>

      {/* --- (3-1) 게시판 생성 모달 --- */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>게시판 생성</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>게시판명 *</label>
                  <input type="text" placeholder="예: 공지사항" />
                </div>
                <div className="form-group">
                  <label>권한 *</label>
                  <select>
                    <option>전체</option>
                    <option>회원</option>
                    <option>관리자</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>상태 *</label>
                  <select>
                    <option>사용</option>
                    <option>중지</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>스킨 *</label>
                  <select>
                    <option>basic</option>
                    <option>gallery</option>
                    <option>faq</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>취소</button>
              <button className="btn-confirm">생성</button>
            </div>
          </div>
        </div>
      )}

      {/* --- (3-2) 게시판 수정 모달 --- */}
      {showEditModal && targetBoard && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>게시판 수정</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>게시판명 *</label>
                  <input type="text" defaultValue={targetBoard.name} />
                </div>
                <div className="form-group">
                  <label>권한 *</label>
                  <select defaultValue={targetBoard.scope}>
                    <option>전체</option>
                    <option>회원</option>
                    <option>관리자</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>상태 *</label>
                  <select defaultValue={targetBoard.state}>
                    <option>사용</option>
                    <option>중지</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>스킨 *</label>
                  <select defaultValue={targetBoard.skin}>
                    <option>basic</option>
                    <option>gallery</option>
                    <option>faq</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>취소</button>
              <button className="btn-confirm">저장</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BoardMgmt;