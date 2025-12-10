import React, { useState, useEffect } from 'react';
import adminApi from '../../../api/api'; // [중요] 아까 만든 axios 인스턴스 import
import './AccountMgmt.css';

const AccountMgmt = () => {
  // Mock Data 삭제하고 빈 배열로 시작
  const [accounts, setAccounts] = useState([]);
  
  // [추가] 가입 승인 대기자 목록 상태
  const [pendingUsers, setPendingUsers] = useState([]);

  // 나머지 상태들(검색, 필터 등)은 그대로 유지...
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedIds, setSelectedIds] = useState([]);

  // 모달 상태
  const [showApproveModal, setShowApproveModal] = useState(false); // 이름 변경 (Create -> Approve)
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

  // [추가] 2. 승인 대기 목록 불러오기 (모달 열 때 호출)
  const openApproveModal = async () => {
    try {
      // GET /api/admin/auth/pending
      const response = await adminApi.get('/api/admin/auth/pending');
      setPendingUsers(response.data); // 대기자 목록 state에 저장
      setShowApproveModal(true);      // 모달 열기
    } catch (error) {
      console.error("대기 목록 로딩 실패:", error);
      alert("승인 대기 목록을 불러오지 못했습니다. (SUPER 권한 필요)");
    }
  };

  // [추가] 3. 승인 처리 (Approve)
  const handleApprove = async (pendingId) => {
    if(!window.confirm("이 계정의 가입을 승인하시겠습니까?")) return;
    try {
      // POST /api/admin/auth/approve/{adminId}
      await adminApi.post(`/api/admin/auth/approve/${pendingId}`);
      alert("승인되었습니다.");
      
      // 목록 갱신 (대기 목록 다시 불러오기 & 메인 계정 목록 갱신)
      const res = await adminApi.get('/api/admin/auth/pending');
      setPendingUsers(res.data);
      fetchAccounts(); 
    } catch (error) {
      console.error("승인 실패:", error);
      alert("승인 처리에 실패했습니다.");
    }
  };

  // [추가] 4. 거절 처리 (Reject)
  const handleReject = async (pendingId) => {
    if(!window.confirm("정말 거절하시겠습니까? (계정이 비활성 유지됩니다)")) return;
    try {
      await adminApi.post(`/api/admin/auth/reject/${pendingId}`);
      alert("거절되었습니다.");
      
      // 목록 갱신
      const res = await adminApi.get('/api/admin/auth/pending');
      setPendingUsers(res.data);
    } catch (error) {
      console.error("거절 실패:", error);
      alert("거절 처리에 실패했습니다.");
    }
  };

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

  // [수정] 삭제 API 호출 함수
const handleDelete = async () => {
  if (selectedIds.length === 0) {
    alert('삭제할 계정을 선택해주세요.');
    return;
  }
  
  if (!window.confirm(`${selectedIds.length}개의 계정을 정말 삭제하시겠습니까?`)) return;

  try {
    // 선택된 ID들을 하나씩 삭제 요청 (Promise.all 병렬 처리)
    const deletePromises = selectedIds.map(id => 
      adminApi.delete(`/api/admin/accounts/${id}`)
    );
    
    await Promise.all(deletePromises);

    alert("삭제되었습니다.");
    fetchAccounts();    // 목록 새로고침
    setSelectedIds([]); // 선택 초기화
  } catch (error) {
    console.error("삭제 실패:", error);
    alert("삭제 중 오류가 발생했습니다.");
  }
};

  // [추가] 역할 변경 API 호출 함수
const handleRoleChangeSubmit = async () => {
  // 1. 선택된 유저와 변경할 역할 확인
  if (!targetUser) return;
  
  // 모달에 있는 select 태그의 값을 가져와야 함 (state로 관리하는 게 좋음)
  // 편의상 document.getElementById 사용 예시 (리액트 방식으로는 state 사용 권장)
  const newRole = document.getElementById('role-select').value; 

  try {
    // PATCH /api/admin/accounts/{adminId}/role
    await adminApi.patch(`/api/admin/accounts/${targetUser.id}/role`, {
      roleCode: newRole
    });

    alert("역할이 성공적으로 변경되었습니다.");
    setShowRoleModal(false); // 모달 닫기
    fetchAccounts();         // 목록 새로고침 (중요!)
    setSelectedIds([]);      // 선택 초기화
  } catch (error) {
    console.error("역할 변경 실패:", error);
    alert("역할 변경 중 오류가 발생했습니다.");
    }
  };

  // [추가] 활성/잠금 상태 변경 함수
const handleStatusToggle = async () => {
  if (selectedIds.length === 0) {
    alert("상태를 변경할 계정을 선택해주세요.");
    return;
  }
  
  if (!window.confirm(`선택한 ${selectedIds.length}명 계정의 상태를 변경하시겠습니까?`)) return;

  try {
    // 선택된 ID들에 대해 각각 비동기 요청을 보냅니다.
    const promises = selectedIds.map(id => {
      // 1. 현재 계정 정보 찾기
      const user = accounts.find(acc => acc.id === id);
      if (!user) return null;

      // 2. 현재 상태의 반대값 계산 ('ACTIVE'면 false로, 아니면 true로)
      // 백엔드 DTO(AdminStatusUpdateRequest)는 boolean active를 받습니다.
      const nextActive = user.state !== 'ACTIVE'; 
      
      // 3. API 요청 (PATCH)
      return adminApi.patch(`/api/admin/accounts/${id}/status`, {
        active: nextActive
      });
    });

    // 모든 요청이 끝날 때까지 기다림
    await Promise.all(promises);

    alert("상태가 변경되었습니다.");
    fetchAccounts();    // 목록 새로고침
    setSelectedIds([]); // 선택 초기화

  } catch (error) {
    console.error("상태 변경 실패:", error);
    alert("일부 계정의 상태 변경에 실패했습니다.");
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
          {/* [수정] 신규 등록 -> 가입 승인 버튼으로 변경 */}
          <button className="btn-create" onClick={openApproveModal}>가입 요청 확인</button>
          <button className="btn-edit" onClick={openRoleModal}>역할 변경</button>
          {/* ▼ [수정] onClick 연결 */}
          <button className="btn-lock" onClick={handleStatusToggle}>활성/잠금</button>
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
            {currentData.length > 0 ? (
              currentData.map((acc) => (
                <tr key={acc.id} className={selectedIds.includes(acc.id) ? 'selected-row' : ''}>
                   <td>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(acc.id)}
                        onChange={() => handleSelectOne(acc.id)}
                      />
                   </td>
                   {/* ▼ 매핑된 데이터 출력 */}
                   <td>{acc.loginId}</td> 
                   <td>{acc.name}</td>
                   <td>{acc.email}</td>
                   <td><span className={`badge role-${acc.role}`}>{acc.role}</span></td>
                   <td>
                     <span className={`status-pill ${acc.state === 'ACTIVE' ? 'active' : 'locked'}`}>
                       {acc.state}
                     </span>
                   </td>
                   <td>{acc.lastLogin}</td>
                   <td>{acc.regDate}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" style={{textAlign:'center', padding:'20px'}}>데이터가 없습니다.</td></tr>
            )}
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

      {/* --- [수정] 가입 승인 모달 (Pending List) --- */}
      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal-content large"> {/* 넓게 쓰기 위해 large 클래스 권장 */}
            <div className="modal-header">
              <h3>가입 승인 요청 목록</h3>
              <button className="close-btn" onClick={() => setShowApproveModal(false)}>닫기</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              
              {pendingUsers.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  대기 중인 가입 요청이 없습니다.
                </p>
              ) : (
                <table className="account-table">
                  <thead>
                    <tr>
                      <th>아이디</th>
                      <th>이름</th>
                      <th>이메일</th>
                      <th>요청일시</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((user) => (
                      <tr key={user.adminId}>
                        <td>{user.username}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.requestedAt ? user.requestedAt.replace('T', ' ').substring(0, 16) : '-'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                              className="admin-btn admin-btn--primary"
                              onClick={() => handleApprove(user.adminId)}
                            >
                              승인
                            </button>
                            <button 
                              className="admin-btn admin-btn--danger"
                              onClick={() => handleReject(user.adminId)}
                            >
                              거절
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowApproveModal(false)}>닫기</button>
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
                {/* id="role-select" 추가 */}
                <select id="role-select" defaultValue={targetUser.role}>
                  <option value="SUPER">SUPER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="STAFF">STAFF</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowRoleModal(false)}>취소</button>
              {/* onClick 연결 */}
              <button className="btn-confirm" onClick={handleRoleChangeSubmit}>변경 적용</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountMgmt;