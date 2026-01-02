import React, { useState, useEffect } from 'react';
import api from '../../../api/api'; // 파일 업로드용 (Content-Type 설정 등)
import adminApi from '../../../api/api';
import './PopupMgmt.css';

const PopupMgmt = () => {
  const [booths, setBooths] = useState([]);
  
  // 공통 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState([]);
  
  // 모달 & 폼 상태
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const initialForm = { id: null, title: '', context: '', location: '', price: 0, maxPerson: 50, eventDate: '', priority: 1 };
  const [formData, setFormData] = useState(initialForm);
  const [selectedFiles, setSelectedFiles] = useState([]); // 이미지 파일

  // 목록 로드
  const fetchBooths = async () => {
    try {
      const res = await adminApi.get('/api/admin/booths');
      setBooths(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchBooths(); }, []);

  // 필터링
  const filteredBooths = booths.filter(item => {
    const matchTitle = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    let matchState = true;
    if (stateFilter === 'SHOW') matchState = item.isShow === true;
    if (stateFilter === 'HIDE') matchState = item.isShow === false;
    return matchTitle && matchState;
  });

  const totalPages = Math.ceil(filteredBooths.length / itemsPerPage) || 1;
  const currentData = filteredBooths.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(currentData.map(p => p.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(v => v !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // [기능 수정] 상태 토글 (isShow 값을 반전시켜서 PATCH 전송)
  const toggleStatus = async (id, currentShow) => {
    try {
      await adminApi.patch(`/api/admin/booths/${id}/status?isShow=${!currentShow}`);
      fetchBooths(); // 즉시 새로고침
    } catch (err) {
      alert("상태 변경 실패");
    }
  };

  // 모달 열기
  const openCreateModal = () => {
    setFormData(initialForm);
    setSelectedFiles([]);
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditModal = () => {
    if (selectedIds.length !== 1) return alert("부스를 하나만 선택해주세요.");
    const target = booths.find(p => p.id === selectedIds[0]);
    setFormData({
      id: target.id,
      title: target.title,
      context: target.context,
      location: target.location,
      price: target.price,
      maxPerson: target.maxPerson,
      eventDate: target.eventDate,
      priority: target.priority // [중요] 우선순위 불러오기
    });
    setSelectedFiles([]);
    setIsEditMode(true);
    setShowModal(true);
  };

  // [기능 유지] 저장 핸들러 (이미지 업로드 + 우선순위 반영)
  const handleSave = async () => {
    if (!formData.title || !formData.eventDate) return alert("부스명과 날짜는 필수입니다.");

    try {
      // 1. 이미지 업로드 (선택된 파일이 있는 경우)
      let uploadedFileIds = [];
      if (selectedFiles.length > 0) {
        const imageFormData = new FormData();
        selectedFiles.forEach(file => imageFormData.append('files', file));
        
        // 파일 업로드 API 호출
        const uploadRes = await api.post('/api/files/upload', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedFileIds = uploadRes.data; 
      }

      // 2. 데이터 병합 (fileIds 포함)
      const finalFormData = {
        ...formData,
        fileIds: uploadedFileIds 
      };

      // 3. API 전송
      if (isEditMode) {
        await adminApi.put(`/api/admin/booths/${formData.id}`, finalFormData);
        alert("수정되었습니다.");
      } else {
        await adminApi.post('/api/admin/booths', finalFormData);
        alert("등록되었습니다.");
      }

      setShowModal(false);
      fetchBooths();
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert("저장 실패: " + (err.response?.data?.message || "오류 발생"));
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    if (!window.confirm(`${selectedIds.length}개를 삭제하시겠습니까?`)) return;
    try {
      await Promise.all(selectedIds.map(id => adminApi.delete(`/api/admin/booths/${id}`)));
      alert("삭제되었습니다.");
      fetchBooths();
      setSelectedIds([]);
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="popup-container">
      <div className="page-header"><h2>체험부스(팝업) 관리</h2></div>
      
      <div className="toolbar">
        <div className="filter-area-large">
          <input type="text" placeholder="부스명 검색" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select onChange={e => setStateFilter(e.target.value)}>
            <option value="ALL">전체 보기</option>
            <option value="SHOW">공개중 (ON)</option>
            <option value="HIDE">숨김 (OFF)</option>
          </select>
        </div>
        <div className="action-buttons">
          <button className="btn-create" onClick={openCreateModal}>신규 등록</button>
          <button className="btn-edit" onClick={openEditModal}>수정</button>
          <button className="btn-delete" onClick={handleDelete}>삭제</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="popup-table">
          <thead>
            <tr>
              <th style={{width:'50px'}}><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === currentData.length && currentData.length > 0} /></th>
              <th>우선순위</th><th>부스명</th><th>위치</th><th>가격</th><th>날짜</th><th>공개 상태</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(b => (
              <tr key={b.id}>
                <td><input type="checkbox" checked={selectedIds.includes(b.id)} onChange={() => handleSelectOne(b.id)} /></td>
                <td><span className="priority-badge">{b.priority}</span></td>
                <td style={{fontWeight:'bold'}}>{b.title}</td>
                <td>{b.location}</td>
                <td>{b.price.toLocaleString()}원</td>
                <td>{b.eventDate}</td>
                <td>
                  <button className={`status-pill ${b.isShow ? 'active' : 'inactive'}`} onClick={() => toggleStatus(b.id, b.isShow)} style={{border:'none', cursor:'pointer'}}>
                    {b.isShow ? 'ON' : 'OFF'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{width:'600px'}}>
            <h3>{isEditMode ? '부스 정보 수정' : '신규 부스 등록'}</h3>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>부스명</label>
                  <input name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>설명</label>
                  <textarea name="context" value={formData.context} onChange={handleChange} style={{height:'80px'}} />
                </div>
                {/* [유지됨] 이미지 업로드 UI */}
                <div className="form-group full-width">
                  <label>이미지 등록 (다중 선택)</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => setSelectedFiles(Array.from(e.target.files))} />
                  {selectedFiles.length > 0 && <ul style={{fontSize:'0.8em', color:'#666'}}>{selectedFiles.map((f,i)=><li key={i}>{f.name}</li>)}</ul>}
                </div>
                <div className="form-group">
                  <label>위치</label><input name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>가격</label><input name="price" type="number" value={formData.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>날짜</label><input name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>최대 인원</label><input name="maxPerson" type="number" value={formData.maxPerson} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>우선순위 (1=높음)</label>
                  <input name="priority" type="number" value={formData.priority} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)}>취소</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupMgmt;