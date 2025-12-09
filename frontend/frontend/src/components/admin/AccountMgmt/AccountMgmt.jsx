import React, { useState } from 'react';
import './AccountMgmt.css';

const AccountMgmt = () => {
  // --- 1. 상태 관리 (검색, 필터, 페이지네이션, 선택된 항목) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 5개씩 보기
  const [selectedIds, setSelectedIds] = useState([]); // 체크박스 선택된 ID들

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [targetUser, setTargetUser] = useState(null); // 역할 변경 대상

  // --- 2. Mock Data (테스트 데이터) ---
  const [accounts, setAccounts] = useState([
    { id: 'admin01', name: '김관리', email: 'admin@test.com', role: 'SUPER', state: '활성', lastLogin: '2025-11-03 09:12', regDate: '2024-06-01' },
    { id: 'staff02', name: '이운영', email: 'op22@test.com', role: 'STAFF', state: '활성', lastLogin: '2025-11-03 08:45', regDate: '2025-01-20' },
    { id: 'guest01', name: '박게스트', email: 'shk@test.com', role: 'VIEWER', state: '잠금', lastLogin: '-', regDate: '2025-08-20' },
    { id: 'mod07', name: '정관리', email: 'mgt07@test.com', role: 'MANAGER', state: '활성', lastLogin: '2025-11-02 21:33', regDate: '2024-10-18' },
    { id: 'staff31', name: '유직원', email: 'jui31@test.com', role: 'STAFF', state: '활성', lastLogin: '2025-11-02 19:10', regDate: '2025-02-14' },
    { id: 'user88', name: '홍길동', email: 'hong@test.com', role: 'VIEWER', state: '활성', lastLogin: '2025-11-01 10:00', regDate: '2025-09-01' },
    { id: 'user99', name: '김철수', email: 'cheol@test.com', role: 'VIEWER', state: '활성', lastLogin: '2025-10-30 14:20', regDate: '2025-09-02' },
  ]);

  // --- 3. 핸들러 함수들 ---

  // 검색 및 필터링 로직
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.name.includes(searchTerm) || acc.id.includes(searchTerm);
    const matchesRole = roleFilter === 'ALL' || acc.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 페이지네이션 로직
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentData = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 체크박스 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentData.map(acc => acc.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 개별 체크박스 선택/해제
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // [기능] 역할 변경 버튼 클릭 시
  const openRoleModal = () => {
    if (selectedIds.length !== 1) {
      alert('역할을 변경할 계정을 "하나만" 선택해주세요.');
      return;
    }
    const user = accounts.find(acc => acc.id === selectedIds[0]);
    setTargetUser(user);
    setShowRoleModal(true);
  };

  // [기능] 삭제 버튼 클릭 시
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 계정을 선택해주세요.');
      return;
    }
    if (window.confirm(`${selectedIds.length}개의 계정을 삭제하시겠습니까?`)) {
      setAccounts(accounts.filter(acc => !selectedIds.includes(acc.id)));
      setSelectedIds([]);
    }
  };

  return (
    <div className="account-container">
      {/* 상단 헤더 & 툴바 */}
      <div className="page-header">
        <h2>계정 목록 <span className="sub-text">총 {filteredAccounts.length}명</span></h2>
      </div>

      <div className="toolbar">
        <div className="search-area">
          <input 
            type="text" 
            placeholder="이름/ID 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="ALL">역할 전체</option>
            <option value="SUPER">SUPER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="STAFF">STAFF</option>
            <option value="VIEWER">VIEWER</option>
          </select>
          <button className="btn-search-action">검색</button>
        </div>

        <div className="action-buttons">
          <button className="btn-create" onClick={() => setShowCreateModal(true)}>신규 등록</button>
          <button className="btn-edit" onClick={openRoleModal}>역할 변경</button>
          <button className="btn-lock">활성/잠금</button>
          <button className="btn-delete" onClick={handleDelete}>선택 삭제</button>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="table-wrapper">
        <table className="account-table">
          <thead>
            <tr>
              <th style={{width: '50px'}}>
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll} 
                  checked={selectedIds.length === currentData.length && currentData.length > 0}
                />
              </th>
              <th>아이디</th>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
              <th>상태</th>
              <th>최근 로그인</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((acc) => (
              <tr key={acc.id} className={selectedIds.includes(acc.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(acc.id)}
                    onChange={() => handleSelectOne(acc.id)}
                  />
                </td>
                <td>{acc.id}</td>
                <td>{acc.name}</td>
                <td>{acc.email}</td>
                <td><span className={`badge role-${acc.role}`}>{acc.role}</span></td>
                <td>
                  <span className={`status-pill ${acc.state === '활성' ? 'active' : 'locked'}`}>
                    {acc.state}
                  </span>
                </td>
                <td>{acc.lastLogin}</td>
                <td>{acc.regDate}</td>
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

      {/* --- (3-1) 계정 신규 등록 모달 --- */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>계정 신규 등록</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>아이디 *</label>
                  <input type="text" placeholder="예: admin02" />
                </div>
                <div className="form-group">
                  <label>이름 *</label>
                  <input type="text" placeholder="예: 김관리" />
                </div>
                <div className="form-group full-width">
                  <label>이메일 *</label>
                  <input type="email" placeholder="example@domain.com" />
                </div>
                <div className="form-group">
                  <label>역할 *</label>
                  <select><option>선택</option><option>STAFF</option><option>MANAGER</option></select>
                </div>
                <div className="form-group">
                  <label>비밀번호 *</label>
                  <input type="password" placeholder="6자 이상" />
                </div>
                <div className="form-group full-width">
                  <label>메모 (선택)</label>
                  <input type="text" placeholder="메모 입력" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>취소</button>
              <button className="btn-confirm">등록</button>
            </div>
          </div>
        </div>
      )}

      {/* --- (3-2) 역할 변경 모달 --- */}
      {showRoleModal && targetUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>역할 변경</h3>
              <button className="close-btn" onClick={() => setShowRoleModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>아이디</label>
                <input type="text" value={targetUser.id} disabled className="input-disabled" />
              </div>
              <div className="form-group">
                <label>이름</label>
                <input type="text" value={targetUser.name} disabled className="input-disabled" />
              </div>
              <div className="form-group">
                <label>변경할 역할 *</label>
                <select defaultValue={targetUser.role}>
                  <option value="SUPER">SUPER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="STAFF">STAFF</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowRoleModal(false)}>취소</button>
              <button className="btn-confirm">변경 적용</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountMgmt;