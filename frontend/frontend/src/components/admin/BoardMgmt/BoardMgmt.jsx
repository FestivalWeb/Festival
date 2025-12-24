import React, { useState, useEffect } from 'react';
import adminApi from '../../../api/api';
import './BoardMgmt.css';

const BoardMgmt = () => {
  // 1. 상태 관리 (Mock Data 삭제 -> 빈 배열 초기화)
  const [boards, setBoards] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedIds, setSelectedIds] = useState([]);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // [수정] 입력 폼 상태 (visibility 삭제 -> readRole, writeRole 추가)
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    readRole: 'PUBLIC',  // 읽기 권한 기본값
    writeRole: 'MEMBER', // 쓰기 권한 기본값
    skin: 'basic',
    status: true
  });

  // --- 2. 백엔드 데이터 불러오기 (Read) ---
  const fetchBoards = async () => {
    try {
      // GET /api/admin/boards
      const response = await adminApi.get('/api/admin/boards');
      
      // 백엔드 데이터 -> 프론트엔드 포맷 매핑
      const mappedData = response.data.map(board => ({
        id: board.boardId,
        name: board.name,
        readRole: board.readRole,   // [추가]
        writeRole: board.writeRole, // [추가]
        state: board.status === 'ACTIVE' ? '사용' : '중지', // 상태 문자열 변환
        count: board.postCount,
        skin: board.skin,
        date: board.updatedAt ? board.updatedAt.substring(0, 10) : '-'
      }));
      setBoards(mappedData);
    } catch (error) {
      console.error("게시판 목록 로딩 실패:", error);
    }
  };
  useEffect(() => {
    fetchBoards();
  }, []);


  // --- 3. 로직 처리 ---

  const filteredBoards = boards.filter(item => {
    const matchSearch = item.name.includes(searchTerm);
    // [참고] 필터링 로직은 필요에 따라 readRole 또는 writeRole 기준으로 수정 가능
    // const matchRole = roleFilter === 'ALL' || item.readRole === roleFilter; 
    const matchState = stateFilter === 'ALL' || item.state === stateFilter;
    return matchSearch && matchState;
  });

  const totalPages = Math.ceil(filteredBoards.length / itemsPerPage);
  const currentData = filteredBoards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(currentData.map(b => b.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // 모달 열기 (생성)
  const openCreateModal = () => {
    setIsEditMode(false);
    // [수정] 초기값 설정
    setFormData({ 
      id: null, 
      name: '', 
      readRole: 'PUBLIC', 
      writeRole: 'MEMBER', 
      skin: 'basic', 
      status: true 
    });
    setShowModal(true);
  };

  // 모달 열기 (수정)
  const openEditModal = () => {
    if (selectedIds.length !== 1) {
      alert('수정할 게시판을 "하나만" 선택해주세요.');
      return;
    }
    const board = boards.find(b => b.id === selectedIds[0]);
    setIsEditMode(true);
    // [수정] 기존 데이터 불러오기
    setFormData({
      id: board.id,
      name: board.name,
      readRole: board.readRole,
      writeRole: board.writeRole,
      skin: board.skin,
      status: board.state === '사용'
    });
    setShowModal(true);
  };

  // [기능] 저장 (생성/수정)
  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        readRole: formData.readRole,
        writeRole: formData.writeRole,
        skin: formData.skin,
        status: formData.status
      };

      if (isEditMode) {
        // PUT /api/admin/boards/{id}
        await adminApi.put(`/api/admin/boards/${formData.id}`, payload);
        alert("수정되었습니다.");
      } else {
        // POST /api/admin/boards
        await adminApi.post('/api/admin/boards', payload);
        alert("생성되었습니다.");
      }
      setShowModal(false);
      fetchBoards(); // 목록 갱신
      setSelectedIds([]);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // [기능] 삭제
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 게시판을 선택해주세요.');
      return;
    }
    if (!window.confirm(`${selectedIds.length}개의 게시판을 삭제하시겠습니까?`)) return;

    try {
      // DELETE /api/admin/boards/bulk-delete
      await adminApi.delete('/api/admin/boards/bulk-delete', {
        data: { boardIds: selectedIds }
      });
      alert("삭제되었습니다.");
      fetchBoards();
      setSelectedIds([]);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 실패 (권한 부족 또는 오류)");
    }
  };
  
  return (
    <div className="board-container">
      <div className="page-header">
        <h2>게시판 관리 <span className="sub-text">총 {filteredBoards.length}개</span></h2>
      </div>

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
            <option value="PUBLIC">전체 공개 (PUBLIC)</option>
            <option value="MEMBER">회원 전용 (MEMBER)</option>
            <option value="STAFF">직원 전용 (STAFF)</option>
            <option value="MANAGER">매니저 전용 (MANAGER)</option>
            <option value="SUPER">관리자 전용 (SUPER)</option>
          </select>
          <select onChange={(e) => setStateFilter(e.target.value)}>
            <option value="ALL">상태 전체</option>
            <option value="사용">사용</option>
            <option value="중지">중지</option>
          </select>
          <button className="btn-search-action">검색</button>
        </div>

        <div className="action-buttons">
          <button className="btn-create" onClick={openCreateModal}>게시판 생성</button>
          <button className="btn-edit" onClick={openEditModal}>게시판 수정</button>
          <button className="btn-delete" onClick={handleDelete}>게시판 삭제</button>
        </div>
      </div>

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
              <th>읽기 권한</th> 
              <th>쓰기 권한</th> 
              <th>상태</th>
              <th>게시물수</th>
              <th>스킨</th>
              <th>수정일</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((board) => (
                <tr key={board.id} className={selectedIds.includes(board.id) ? 'selected-row' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(board.id)}
                      onChange={() => handleSelectOne(board.id)}
                    />
                  </td>
                  <td>{board.name}</td>
                  {/* [수정] 권한 뱃지 표시 */}
                  <td><span className="badge">{board.readRole}</span></td>
                  <td><span className="badge">{board.writeRole}</span></td>
                  <td>
                    <span className={`status-pill ${board.state === '사용' ? 'active' : 'stopped'}`}>
                      {board.state}
                    </span>
                  </td>
                  <td>{board.count}</td>
                  <td>{board.skin}</td>
                  <td>{board.date}</td>
                </tr>
              ))
            ) : (
               <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>데이터가 없습니다.</td></tr>
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

      {/* --- 통합 모달 (생성/수정 공용) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditMode ? '게시판 수정' : '게시판 생성'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>게시판명 *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="예: 공지사항" 
                  />
                </div>
                {/* [수정] 읽기 권한 선택 */}
                <div className="form-group">
                  <label>읽기 권한 (Read) *</label>
                  <select 
                    value={formData.readRole}
                    onChange={(e) => setFormData({...formData, readRole: e.target.value})}
                  >
                    <option value="PUBLIC">전체 공개 (PUBLIC)</option>
                    <option value="MEMBER">회원 전용 (MEMBER)</option>
                    <option value="STAFF">직원 전용 (STAFF)</option>
                    <option value="MANAGER">매니저 전용 (MANAGER)</option>
                    <option value="SUPER">관리자 전용 (SUPER)</option>
                  </select>
                </div>

                {/* [수정] 쓰기 권한 선택 */}
                <div className="form-group">
                  <label>쓰기 권한 (Write) *</label>
                  <select 
                    value={formData.writeRole}
                    onChange={(e) => setFormData({...formData, writeRole: e.target.value})}
                  >
                    {/* 쓰기는 보통 전체공개 잘 안 함 (스팸 방지) */}
                    <option value="MEMBER">회원 전용 (MEMBER)</option>
                    <option value="STAFF">직원 전용 (STAFF)</option>
                    <option value="MANAGER">매니저 전용 (MANAGER)</option>
                    <option value="SUPER">관리자 전용 (SUPER)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>상태 *</label>
                  <select 
                    value={formData.status ? "true" : "false"}
                    onChange={(e) => setFormData({...formData, status: e.target.value === 'true'})}
                  >
                    <option value="true">사용</option>
                    <option value="false">중지</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>스킨 *</label>
                  <select 
                    value={formData.skin}
                    onChange={(e) => setFormData({...formData, skin: e.target.value})}
                  >
                    <option value="basic">basic</option>
                    <option value="gallery">gallery</option>
                    <option value="event">event</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>취소</button>
              <button className="btn-confirm" onClick={handleSave}>
                {isEditMode ? '수정' : '생성'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BoardMgmt;