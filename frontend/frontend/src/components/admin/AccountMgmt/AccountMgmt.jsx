import React, { useState, useEffect } from 'react';
import adminApi from '../../../api/api'; // [중요] 아까 만든 axios 인스턴스 import
import './AccountMgmt.css';

const AccountMgmt = () => {
  // Mock Data 삭제하고 빈 배열로 시작
  const [accounts, setAccounts] = useState([]);
  
  // 나머지 상태들(검색, 필터 등)은 그대로 유지...
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  // [추가] 백엔드 데이터 불러오기 함수
  const fetchAccounts = async () => {
    try {
      // 백엔드: GET /api/admin/accounts
      const response = await adminApi.get('/api/admin/accounts');
      
      // 백엔드 데이터(DTO)를 화면용 데이터로 변환 (매핑)
      const mappedData = response.data.map(user => ({
        id: user.adminId,            // 실제 DB PK (수정/삭제용)
        loginId: user.username,      // 화면 표시용 아이디
        name: user.name,
        email: user.email,
        // roles는 리스트로 오므로 첫 번째 것만 쓰거나 join
        role: user.roles && user.roles.length > 0 ? user.roles[0] : 'VIEWER', 
        state: user.status,          // "ACTIVE", "INACTIVE" 등
        lastLogin: user.lastLoginAt ? user.lastLoginAt.replace('T', ' ').substring(0, 16) : '-',
        regDate: user.createdAt ? user.createdAt.replace('T', ' ').substring(0, 10) : '-'
      }));
      
      setAccounts(mappedData);
    } catch (error) {
      console.error("계정 목록 로딩 실패:", error);
      if (error.response && error.response.status === 401) {
          alert("세션이 만료되었습니다.");
          // 로그인 페이지로 튕겨내기 로직 추가 가능
      }
    }
  };

  // 화면 켜지자마자 실행
  useEffect(() => {
    fetchAccounts();
  }, []);
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