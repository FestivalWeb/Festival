import React, { useState, useEffect } from 'react';
import api from '../../../api/api'; // [중요] axios 설정 파일 경로 확인
import './PopupMgmt.css'; // 기존 CSS 스타일 재사용

const BoothMgmt = () => {
  // --- 1. 상태 관리 ---
  const [booths, setBooths] = useState([]); // 백엔드 데이터 담을 곳

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL'); // ALL, SHOW, HIDE

  // 페이지네이션 및 선택
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 보여줄 개수
  const [selectedIds, setSelectedIds] = useState([]);

  // 모달 상태
  const [showModal, setShowModal] = useState(false); // 생성/수정 통합 모달
  const [isEditMode, setIsEditMode] = useState(false); // 생성 모드인지 수정 모드인지

  // 입력 폼 데이터 (DTO 구조에 맞춤)
  const initialForm = {
    id: null,
    title: '',
    context: '',
    location: '',
    price: 0,
    maxPerson: 50,
    eventDate: '',
    priority: 1
  };
  const [formData, setFormData] = useState(initialForm);

    // [추가] 선택된 이미지 파일들을 담을 상태
  const [selectedFiles, setSelectedFiles] = useState([]);

  // --- 2. 데이터 불러오기 (API) ---
  const fetchBooths = () => {
    api.get('/api/admin/booths')
      .then(res => {
        setBooths(res.data);
      })
      .catch(err => console.error("데이터 로딩 실패:", err));
  };

  useEffect(() => {
    fetchBooths();
  }, []);

  // --- 3. 로직 처리 ---

  // 필터링 로직
  const filteredBooths = booths.filter(item => {
    const matchTitle = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchState = true;
    if (stateFilter === 'SHOW') matchState = item.isShow === true;
    if (stateFilter === 'HIDE') matchState = item.isShow === false;

    return matchTitle && matchState;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredBooths.length / itemsPerPage) || 1;
  const currentData = filteredBooths.slice(
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

  // --- 4. 액션 핸들러 (API 호출) ---

  // [기능] 상태 토글 (공개/비공개 즉시 변경)
  const toggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    api.patch(`/api/admin/booths/${id}/status?isShow=${newStatus}`)
      .then(() => {
        // 성공 시 목록만 새로고침 (혹은 로컬 state만 바꿔도 됨)
        fetchBooths();
      })
      .catch(err => alert("상태 변경 실패"));
  };

  // [기능] 모달 열기 (생성)
  const openCreateModal = () => {
    setFormData(initialForm);
    setIsEditMode(false);
    setShowModal(true);
  };

  // [기능] 모달 열기 (수정)
  const openEditModal = () => {
    if (selectedIds.length !== 1) {
      return alert('수정할 부스를 "하나만" 선택해주세요.');
    }
    const target = booths.find(p => p.id === selectedIds[0]);
    if (!target) return;

    setFormData({
      id: target.id,
      title: target.title,
      context: target.context,
      location: target.location,
      price: target.price,
      maxPerson: target.maxPerson,
      eventDate: target.eventDate, // "YYYY-MM-DD" 형태라 바로 바인딩 가능
      priority: target.priority
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  // [기능] 저장 (생성 및 수정 분기)
  // 기존 handleSave를 이걸로 교체하세요.
  const handleSave = async () => { // async 키워드 추가!
    // 1. 유효성 검사
    if (!formData.title || !formData.eventDate) {
      alert("부스명과 날짜는 필수입니다.");
      return;
    }

    try {
      // 2. [이미지 업로드 단계] 선택한 파일이 있다면 먼저 서버로 보냄
      let uploadedFileIds = []; // 받아온 ID들을 담을 곳

      if (selectedFiles.length > 0) {
        const imageFormData = new FormData(); // 파일 전송용 특수 객체
        selectedFiles.forEach(file => {
          // 'files'는 백엔드 컨트롤러가 받는 파라미터 이름과 같아야 함 (@RequestParam("files"))
          imageFormData.append('files', file); 
        });

        // 파일 업로드 API 호출 (주소는 본인 프로젝트에 맞게 수정 필요!)
        const uploadRes = await api.post('/api/files/upload', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' } // 중요 설정
        });
        
        // 서버가 파일 ID 배열(예: [10, 11])을 줬다고 가정
        uploadedFileIds = uploadRes.data; 
        console.log("업로드된 파일 IDs:", uploadedFileIds);
      }

      // 3. [부스 정보 전송 단계] 받아온 파일 ID를 formData에 합침
      const finalFormData = {
        ...formData,
        fileIds: uploadedFileIds // DTO의 필드명과 일치
      };

      // 4. 최종 저장 API 호출
      if (isEditMode) {
        // 수정 (PUT) - ※ 주의: 기존 이미지 처리는 복잡해서 일단 추가만 고려
        await api.put(`/api/admin/booths/${formData.id}`, finalFormData);
        alert("수정되었습니다.");
      } else {
        // 생성 (POST)
        await api.post('/api/admin/booths', finalFormData);
        alert("부스가 등록되었습니다!");
      }

      // 5. 마무리 (초기화 및 창 닫기)
      setShowModal(false);
      setFormData(initialForm);
      setSelectedFiles([]); // 파일 선택 초기화
      fetchBooths(); // 목록 갱신

    } catch (err) {
      console.error(err);
      // 에러 메시지 좀 더 상세히 표시
      const errMsg = err.response?.data?.message || err.message || "오류 발생";
      alert(`저장 실패: ${errMsg}`);
    }
  };

  // [기능] 삭제
  const handleDelete = () => {
    if (selectedIds.length === 0) return alert('삭제할 항목을 선택해주세요.');
    
    if (window.confirm(`${selectedIds.length}개를 삭제하시겠습니까?`)) {
      // 여러 개 삭제 API가 없다면 반복문으로 호출 (혹은 백엔드에 다건 삭제 추가 필요)
      // 여기서는 예시로 하나씩 삭제 요청 보내는 방식 사용
      Promise.all(selectedIds.map(id => api.delete(`/api/admin/booths/${id}`)))
        .then(() => {
          alert("삭제되었습니다.");
          fetchBooths();
          setSelectedIds([]);
        })
        .catch(err => alert("삭제 중 오류가 발생했습니다."));
    }
  };

  // 입력값 변경 공통 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="popup-container">
      <div className="page-header">
        <h2>체험부스(팝업) 관리 <span className="sub-text">총 {filteredBooths.length}개</span></h2>
      </div>

      {/* 툴바 */}
      <div className="toolbar">
        <div className="filter-area-large">
          <input 
            type="text" 
            placeholder="부스명 검색" 
            className="input-text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select onChange={(e) => setStateFilter(e.target.value)} className="select-state">
            <option value="ALL">전체 보기</option>
            <option value="SHOW">공개중 (ON)</option>
            <option value="HIDE">숨김 (OFF)</option>
          </select>
        </div>

        <div className="action-buttons">
          {/* <button className="btn-toggle" onClick={() => alert('개별 스위치를 이용해주세요.')}>일괄 변경</button> */}
          <button className="btn-edit" onClick={openEditModal}>수정</button>
          <button className="btn-create" onClick={openCreateModal}>신규 등록</button>
          <button className="btn-delete" onClick={handleDelete}>삭제</button>
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
              <th>우선순위</th>
              <th>부스명</th>
              <th>위치</th>
              <th>가격</th>
              <th>운영 날짜</th>
              <th>공개 상태 (Pop-up)</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((booth) => (
              <tr key={booth.id} className={selectedIds.includes(booth.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(booth.id)}
                    onChange={() => handleSelectOne(booth.id)}
                  />
                </td>
                <td><span className="priority-badge">{booth.priority}</span></td>
                <td className="text-left" style={{fontWeight: 'bold'}}>{booth.title}</td>
                <td>{booth.location}</td>
                <td>{booth.price.toLocaleString()}원</td>
                <td>{booth.eventDate}</td>
                <td>
                  {/* 여기가 팝업의 핵심 기능: 스위치 버튼 */}
                  <button 
                    onClick={() => toggleStatus(booth.id, booth.isShow)}
                    className={`status-pill ${booth.isShow ? 'active' : 'inactive'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {booth.isShow ? '공개중 (ON)' : '숨김 (OFF)'}
                  </button>
                </td>
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

      {/* --- 통합 모달 (생성/수정) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '600px' }}>
            <div className="modal-header">
              <h3>{isEditMode ? '부스 정보 수정' : '신규 부스 등록'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                
                {/* 제목 */}
                <div className="form-group full-width">
                  <label>부스명 *</label>
                  <input name="title" type="text" value={formData.title} onChange={handleChange} placeholder="예: 딸기 탕후루 만들기" />
                </div>

                {/* 설명 (Textarea) */}
                <div className="form-group full-width">
                  <label>설명 (상세 내용)</label>
                  <textarea name="context" value={formData.context} onChange={handleChange} placeholder="부스에 대한 설명을 입력하세요." style={{ height: '80px', resize: 'none', padding: '8px' }} />
                </div>

                {/* [추가] 이미지 파일 선택 인풋 */}
                <div className="form-group full-width" style={{marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                  <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>
                    📸 대표/상세 이미지 등록 (다중 선택 가능)
                  </label>
                  <input 
                    type="file" 
                    multiple  // 여러 장 선택 가능하게
                    accept="image/*" // 이미지만 선택 가능하게
                    onChange={(e) => {
                      // 선택된 파일들을 배열로 변환해서 state에 저장
                      setSelectedFiles(Array.from(e.target.files));
                    }} 
                    style={{ padding: '5px' }}
                  />
                  {/* 선택된 파일명 미리보기 */}
                  {selectedFiles.length > 0 && (
                    <ul style={{ fontSize: '13px', color: '#666', marginTop: '5px', paddingLeft: '20px' }}>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 위치 & 가격 */}
                <div className="form-group">
                  <label>위치</label>
                  <input name="location" type="text" value={formData.location} onChange={handleChange} placeholder="예: A-1 구역" />
                </div>
                <div className="form-group">
                  <label>가격 (원)</label>
                  <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0" />
                </div>

                {/* 날짜 & 인원 */}
                <div className="form-group">
                  <label>운영 날짜 *</label>
                  <input name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>최대 인원</label>
                  <input name="maxPerson" type="number" value={formData.maxPerson} onChange={handleChange} />
                </div>

                {/* 우선순위 */}
                <div className="form-group">
                  <label>노출 순위 (1=최상단)</label>
                  <input name="priority" type="number" value={formData.priority} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>취소</button>
              <button className="btn-confirm" onClick={handleSave}>{isEditMode ? '수정 저장' : '등록하기'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BoothMgmt;