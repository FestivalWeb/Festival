import React, { useState } from 'react';
import './PopupMgmt.css';

const PopupMgmt = () => {
  // --- 1. 상태 관리 ---
  const [popups, setPopups] = useState([
    { id: 1, title: '11월 메인 행사', startDate: '2025-11-01', endDate: '2025-11-07', state: '활성', priority: 1, regDate: '2025-10-28' },
    { id: 2, title: '딸기 굿즈 콘테스트', startDate: '2025-11-05', endDate: '2025-11-29', state: '활성', priority: 2, regDate: '2025-10-30' },
    { id: 3, title: '긴급 점검 안내', startDate: '2025-11-02', endDate: '2025-11-02', state: '만료 예정', priority: 1, regDate: '2025-11-02' },
    { id: 4, title: '자원봉사 모집', startDate: '2025-10-15', endDate: '2025-11-30', state: '활성', priority: 3, regDate: '2025-10-10' },
    { id: 5, title: '굿즈 사전예약', startDate: '2025-10-01', endDate: '2025-10-10', state: '비활성', priority: 5, regDate: '2025-09-20' },
    { id: 6, title: '주차장 안내', startDate: '2025-11-01', endDate: '2025-11-30', state: '활성', priority: 9, regDate: '2025-10-25' },
  ]);

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  // 페이지네이션 및 선택
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedIds, setSelectedIds] = useState([]);

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [targetPopup, setTargetPopup] = useState(null);

  // --- 2. 로직 처리 ---

  // 필터링 로직 (기간 검색 포함)
  const filteredPopups = popups.filter(item => {
    const matchTitle = item.title.includes(searchTerm);
    const matchState = stateFilter === 'ALL' || item.state === stateFilter;
    
    // 기간 검색: 시작일/종료일이 설정되어 있으면 해당 범위 내에 팝업 시작일이 있는지 확인
    let matchDate = true;
    if (searchStartDate && item.startDate < searchStartDate) matchDate = false;
    if (searchEndDate && item.startDate > searchEndDate) matchDate = false;

    return matchTitle && matchState && matchDate;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredPopups.length / itemsPerPage);
  const currentData = filteredPopups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 체크박스 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(currentData.map(p => p.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // [기능] 상태 토글 (활성/비활성)
  const toggleStatus = () => {
    if (selectedIds.length === 0) return alert('변경할 팝업을 선택해주세요.');
    
    setPopups(popups.map(p => {
      if (selectedIds.includes(p.id)) {
        return { ...p, state: p.state === '활성' ? '비활성' : '활성' };
      }
      return p;
    }));
    setSelectedIds([]); // 선택 초기화
  };

  // [기능] 수정 모달 열기
  const openEditModal = () => {
    if (selectedIds.length !== 1) {
      return alert('수정할 팝업을 "하나만" 선택해주세요.');
    }
    const popup = popups.find(p => p.id === selectedIds[0]);
    setTargetPopup(popup);
    setShowEditModal(true);
  };

  // [기능] 삭제
  const handleDelete = () => {
    if (selectedIds.length === 0) return alert('삭제할 팝업을 선택해주세요.');
    if (window.confirm(`${selectedIds.length}개의 팝업을 삭제하시겠습니까?`)) {
      setPopups(popups.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  return (
    <div className="popup-container">
      <div className="page-header">
        <h2>팝업 관리 <span className="sub-text">총 {filteredPopups.length}개</span></h2>
      </div>

      {/* 툴바: 기간 검색 및 필터 */}
      <div className="toolbar">
        <div className="filter-area-large">
          <input 
            type="text" 
            placeholder="제목 검색" 
            className="input-text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* 기간 선택 (Date Picker) */}
          <div className="date-range">
            <input 
              type="date" 
              value={searchStartDate}
              onChange={(e) => setSearchStartDate(e.target.value)} 
            />
            <span>~</span>
            <input 
              type="date" 
              value={searchEndDate}
              onChange={(e) => setSearchEndDate(e.target.value)} 
            />
          </div>
          <select onChange={(e) => setStateFilter(e.target.value)} className="select-state">
            <option value="ALL">상태 전체</option>
            <option value="활성">활성</option>
            <option value="비활성">비활성</option>
            <option value="만료 예정">만료 예정</option>
          </select>
          <button className="btn-search-action">검색</button>
        </div>

        <div className="action-buttons">
          <button className="btn-toggle" onClick={toggleStatus}>활성/비활성</button>
          <button className="btn-edit" onClick={openEditModal}>팝업 수정</button>
          <button className="btn-create" onClick={() => setShowCreateModal(true)}>신규 팝업</button>
          <button className="btn-delete" onClick={handleDelete}>팝업 삭제</button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-wrapper">
        <table className="popup-table">
          <thead>
            <tr>
              <th style={{width: '50px'}}>
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={selectedIds.length === currentData.length && currentData.length > 0}
                />
              </th>
              <th>제목</th>
              <th>기간</th>
              <th>상태</th>
              <th>우선순위</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((popup) => (
              <tr key={popup.id} className={selectedIds.includes(popup.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(popup.id)}
                    onChange={() => handleSelectOne(popup.id)}
                  />
                </td>
                <td className="text-left">{popup.title}</td>
                <td>{popup.startDate} ~ {popup.endDate}</td>
                <td>
                  <span className={`status-pill ${popup.state === '활성' ? 'active' : popup.state === '만료 예정' ? 'warning' : 'inactive'}`}>
                    {popup.state}
                  </span>
                </td>
                <td><span className="priority-badge">{popup.priority}</span></td>
                <td>{popup.regDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt;</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&gt;</button>
      </div>

      {/* --- (3-1) 신규 팝업 모달 --- */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>신규 팝업</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>제목 *</label>
                  <input type="text" placeholder="예: 11월 메인 행사" />
                </div>
                <div className="form-group">
                  <label>우선순위 *</label>
                  <input type="number" placeholder="1" min="1" max="10" />
                </div>
                <div className="form-group">
                  <label>상태 *</label>
                  <select>
                    <option>활성</option>
                    <option>비활성</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>시작일 *</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>종료일 *</label>
                  <input type="date" />
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

      {/* --- (3-2) 팝업 수정 모달 --- */}
      {showEditModal && targetPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>팝업 수정</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>제목 *</label>
                  <input type="text" defaultValue={targetPopup.title} />
                </div>
                <div className="form-group">
                  <label>우선순위 *</label>
                  <input type="number" defaultValue={targetPopup.priority} />
                </div>
                <div className="form-group">
                  <label>상태 *</label>
                  <select defaultValue={targetPopup.state}>
                    <option>활성</option>
                    <option>비활성</option>
                    <option>만료 예정</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>시작일 *</label>
                  <input type="date" defaultValue={targetPopup.startDate} />
                </div>
                <div className="form-group">
                  <label>종료일 *</label>
                  <input type="date" defaultValue={targetPopup.endDate} />
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

export default PopupMgmt;