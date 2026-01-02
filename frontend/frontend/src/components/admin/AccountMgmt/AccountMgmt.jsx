import React, { useState, useEffect } from 'react';
import adminApi from '../../../api/api';
import './AccountMgmt.css';

const AccountMgmt = () => {
  // [탭 상태] 'admin': 관리자 관리, 'user': 일반 회원 관리
  const [activeTab, setActiveTab] = useState('admin');

  // --- [공통 상태] ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState([]);

  // --- [관리자 관리용 상태] ---
  const [accounts, setAccounts] = useState([]); 
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [targetUser, setTargetUser] = useState(null); 
  const [roleFilter, setRoleFilter] = useState('ALL');

  // --- [일반 회원 관리용 상태] ---
  const [userMembers, setUserMembers] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (activeTab === 'admin') {
      fetchAccounts();
    } else {
      fetchUserMembers();
    }
    // 탭 바뀔 때 선택 초기화
    setSelectedIds([]);
    setCurrentPage(1);
    setSearchTerm('');
  }, [activeTab]);

  // ---------------------------------------------------------
  // 1. 데이터 불러오기
  // ---------------------------------------------------------

  // [관리자 목록]
  const fetchAccounts = async () => {
    try {
      const response = await adminApi.get('/api/admin/accounts');
      const mappedData = response.data.map(user => ({
        id: user.adminId,
        loginId: user.username,
        name: user.name,
        email: user.email,
        role: user.roles && user.roles.length > 0 ? user.roles[0] : 'VIEWER', 
        state: user.status,
        lastLogin: user.lastLoginAt ? user.lastLoginAt.replace('T', ' ').substring(0, 16) : '-',
        regDate: user.createdAt ? user.createdAt.replace('T', ' ').substring(0, 10) : '-'
      }));
      setAccounts(mappedData);
    } catch (error) {
      console.error("계정 목록 로딩 실패:", error);
    }
  };

  // [일반 회원 목록 조회]
  const fetchUserMembers = async () => {
    setMemberLoading(true);
    try {
      const res = await adminApi.get('/api/admin/members');
      
      const mapped = res.data.map(m => ({
        id: m.userId,
        name: m.name,
        email: m.email,
        // [읽기 수정] 백엔드가 주는 값(active)을 우선 확인
        isActive: (m.active !== undefined ? m.active : m.isActive), 
        regDate: m.createdAt ? m.createdAt.replace('T', ' ').substring(0, 10) : '-'
      }));
      setUserMembers(mapped);
    } catch (err) {
      console.error("일반 회원 로딩 실패:", err);
    } finally {
      setMemberLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 2. [관리자 탭] 핸들러
  // ---------------------------------------------------------

  const openApproveModal = async () => {
    try {
      const response = await adminApi.get('/api/admin/auth/pending');
      setPendingUsers(response.data);
      setShowApproveModal(true);
    } catch (error) {
      alert("승인 대기 목록을 불러오지 못했습니다. (권한 확인 필요)");
    }
  };

  const handleApprove = async (pendingId) => {
    if(!window.confirm("승인하시겠습니까?")) return;
    try {
      await adminApi.post(`/api/admin/auth/approve/${pendingId}`);
      alert("승인되었습니다.");
      const res = await adminApi.get('/api/admin/auth/pending');
      setPendingUsers(res.data);
      fetchAccounts(); 
    } catch (error) {
      alert("승인 처리 실패: " + (error.response?.data?.message || "오류"));
    }
  };

  const handleReject = async (pendingId) => {
    if(!window.confirm("거절하시겠습니까?")) return;
    try {
      await adminApi.post(`/api/admin/auth/reject/${pendingId}`);
      alert("거절되었습니다.");
      const res = await adminApi.get('/api/admin/auth/pending');
      setPendingUsers(res.data);
    } catch (error) {
      alert("거절 처리 실패");
    }
  };

  const handleDeleteAdmin = async () => {
    if (selectedIds.length === 0) return alert('삭제할 계정을 선택해주세요.');
    if (!window.confirm(`${selectedIds.length}개의 계정을 삭제하시겠습니까?`)) return;

    const results = await Promise.allSettled(
      selectedIds.map(id => adminApi.delete(`/api/admin/accounts/${id}`))
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failCount = results.length - successCount;

    if (successCount > 0) {
      alert(`${successCount}개 계정이 삭제되었습니다.` + (failCount > 0 ? `\n(${failCount}개 실패 - 본인 또는 상위 권한 삭제 불가)` : ""));
      fetchAccounts();
      setSelectedIds([]);
    } else {
      alert("삭제 실패: 권한이 없거나 자기 자신을 삭제할 수 없습니다.");
    }
  };

  const handleStatusToggle = async () => {
    if (selectedIds.length === 0) return alert("계정을 선택해주세요.");
    if (!window.confirm("상태를 변경하시겠습니까?")) return;

    const results = await Promise.allSettled(
      selectedIds.map(id => {
        const user = accounts.find(acc => acc.id === id);
        if (!user) return Promise.reject("User not found");
        const nextActive = user.state !== 'ACTIVE'; 
        return adminApi.patch(`/api/admin/accounts/${id}/status`, { active: nextActive });
      })
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    
    if (successCount > 0) {
      alert(`${successCount}건의 상태가 변경되었습니다.`);
      fetchAccounts();
      setSelectedIds([]);
    } else {
      alert("상태 변경 실패: 권한 부족 또는 자기 자신 변경 불가");
    }
  };

  const openRoleModal = () => {
    if (selectedIds.length !== 1) return alert('계정을 하나만 선택해주세요.');
    const user = accounts.find(acc => acc.id === selectedIds[0]);
    setTargetUser(user);
    setShowRoleModal(true);
  };

  const handleRoleChangeSubmit = async () => {
    if (!targetUser) return;
    const newRole = document.getElementById('role-select').value; 
    try {
      await adminApi.patch(`/api/admin/accounts/${targetUser.id}/role`, { roleCode: newRole });
      alert("역할이 변경되었습니다.");
      setShowRoleModal(false);
      fetchAccounts();
      setSelectedIds([]);
    } catch (error) {
      alert("역할 변경 실패: 본인 또는 상위 권한은 변경할 수 없습니다.");
    }
  };

  // ---------------------------------------------------------
  // 3. [일반 회원 탭] 핸들러
  // ---------------------------------------------------------

  // [핵심 수정 적용 완료]
  // 백엔드 DTO(AdminMemberDto)가 'active' 필드를 원하므로 isActive 대신 active로 보냅니다.
  const handleMemberStatus = async (userId, currentActive) => {
    const nextState = !currentActive; // true(해제) 또는 false(정지)
    const actionName = nextState ? "정지 해제" : "계정 정지(잠금)";

    if (!window.confirm(`${userId} 회원을 ${actionName} 하시겠습니까?`)) return;

    try {
      // API 호출 시 { active: true/false } 형태로 전송
      await adminApi.patch(`/api/admin/members/${userId}/status`, { active: nextState });
      
      alert(`${actionName} 처리되었습니다.`);
      fetchUserMembers(); 
    } catch (error) {
      console.error(error);
      alert("상태 변경 실패: " + (error.response?.data?.message || "오류가 발생했습니다."));
    }
  };

  const handleMemberDelete = async (userId) => {
    if (!window.confirm("정말 강제 탈퇴시키겠습니까? (복구 불가)")) return;
    try {
      await adminApi.delete(`/api/admin/members/${userId}`);
      alert("탈퇴 처리되었습니다.");
      fetchUserMembers();
    } catch (err) {
      alert("탈퇴 처리 실패");
    }
  };

  // ---------------------------------------------------------
  // 4. 화면 렌더링
  // ---------------------------------------------------------
  
  let currentList = activeTab === 'admin' ? accounts : userMembers;

  const filteredList = currentList.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = (item.name && item.name.toLowerCase().includes(searchLower)) ||
                        (item.loginId && item.loginId.toLowerCase().includes(searchLower)) ||
                        (item.email && item.email.toLowerCase().includes(searchLower));
    
    if (activeTab === 'admin' && roleFilter !== 'ALL') {
      return matchSearch && item.role === roleFilter;
    }
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const currentData = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(currentData.map(acc => acc.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  return (
    <div className="account-container">
      <div className="page-header">
        <h2>계정 관리</h2>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={`btn-tab ${activeTab === 'admin' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('admin')}
          style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: activeTab === 'admin' ? 'bold' : 'normal', backgroundColor: activeTab === 'admin' ? '#007bff' : '#eee', color: activeTab === 'admin' ? '#fff' : '#333', border: 'none', borderRadius: '5px' }}
        >
          관리자 관리
        </button>
        <button 
          className={`btn-tab ${activeTab === 'user' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('user')}
          style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: activeTab === 'user' ? 'bold' : 'normal', backgroundColor: activeTab === 'user' ? '#007bff' : '#eee', color: activeTab === 'user' ? '#fff' : '#333', border: 'none', borderRadius: '5px' }}
        >
          일반 회원 관리
        </button>
      </div>

      <div className="toolbar">
        <div className="search-area">
          <input 
            type="text" 
            placeholder={activeTab === 'admin' ? "ID/이름 검색" : "ID/이름/이메일 검색"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {activeTab === 'admin' && (
            <select onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="ALL">역할 전체</option>
              <option value="SUPER">SUPER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="STAFF">STAFF</option>
            </select>
          )}
        </div>

        <div className="action-buttons">
          {activeTab === 'admin' ? (
            <>
              <button className="btn-create" onClick={openApproveModal}>가입 요청 확인</button>
              <button className="btn-edit" onClick={openRoleModal}>역할 변경</button>
              <button className="btn-lock" onClick={handleStatusToggle}>활성/잠금</button>
              <button className="btn-delete" onClick={handleDeleteAdmin}>선택 삭제</button>
            </>
          ) : (
            <span style={{ color: '#666', fontSize: '0.9em', alignSelf: 'center' }}>
              * 일반 회원은 목록에서 개별 관리 기능을 사용하세요.
            </span>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="account-table">
          <thead>
            <tr>
              {activeTab === 'admin' ? (
                <>
                  <th style={{width: '50px'}}>
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === currentData.length && currentData.length > 0} />
                  </th>
                  <th>ID</th><th>이름</th><th>이메일</th><th>역할</th><th>상태</th><th>가입일</th>
                </>
              ) : (
                <>
                  <th>ID</th><th>이름</th><th>이메일</th><th>상태</th><th>가입일</th><th>관리</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className={selectedIds.includes(item.id) ? 'selected-row' : ''}>
                  {activeTab === 'admin' ? (
                    <>
                      <td><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleSelectOne(item.id)} /></td>
                      <td>{item.loginId}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td><span className={`badge role-${item.role}`}>{item.role}</span></td>
                      <td><span className={`status-pill ${item.state === 'ACTIVE' ? 'active' : 'locked'}`}>{item.state}</span></td>
                      <td>{item.regDate}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>
                        {item.isActive ? (
                          <span style={{ color: "green", fontWeight: "bold" }}>정상</span>
                        ) : (
                          <span style={{ color: "red", fontWeight: "bold" }}>정지됨</span>
                        )}
                      </td>
                      <td>{item.regDate}</td>
                      <td>
                        <button 
                          className={`btn-edit ${item.isActive ? 'btn-danger-outline' : 'btn-primary-outline'}`} 
                          onClick={() => handleMemberStatus(item.id, item.isActive)} 
                          style={{ marginRight: '5px', color: item.isActive ? 'red' : 'blue', borderColor: item.isActive ? 'red' : 'blue' }}
                        >
                          {item.isActive ? '정지(잠금)' : '정지 해제'}
                        </button>
                        <button className="btn-delete" onClick={() => handleMemberDelete(item.id)}>탈퇴</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan="10" style={{textAlign:'center', padding:'20px'}}>데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
      </div>

      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>가입 승인 요청 목록</h3>
              <button className="close-btn" onClick={() => setShowApproveModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              {pendingUsers.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>대기 중인 요청이 없습니다.</p>
              ) : (
                <table className="account-table">
                  <thead><tr><th>ID</th><th>이름</th><th>이메일</th><th>관리</th></tr></thead>
                  <tbody>
                    {pendingUsers.map((user) => (
                      <tr key={user.adminId}>
                        <td>{user.username}</td><td>{user.name}</td><td>{user.email}</td>
                        <td>
                          <button className="admin-btn admin-btn--primary" onClick={() => handleApprove(user.adminId)} style={{marginRight:'5px'}}>승인</button>
                          <button className="admin-btn admin-btn--danger" onClick={() => handleReject(user.adminId)}>거절</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {showRoleModal && targetUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>역할 변경 ({targetUser.name})</h3>
            <div className="modal-body">
              <label>변경할 역할</label>
              <select id="role-select" defaultValue={targetUser.role} style={{width:'100%', padding:'8px', marginTop:'5px'}}>
                <option value="SUPER">SUPER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="STAFF">STAFF</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowRoleModal(false)}>취소</button>
              <button className="btn-confirm" onClick={handleRoleChangeSubmit}>변경 적용</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMgmt;