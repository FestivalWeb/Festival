import React, { useState, useEffect } from 'react';
import adminApi from '../../../api/api'; // adminApi 인스턴스 사용
import './BoardMgmt.css';

const BoardMgmt = () => {
  // 'notice' | 'post'
  const [activeTab, setActiveTab] = useState('notice');
  
  // 데이터 상태
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 페이지네이션 및 검색
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 상태 (생성/수정)
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // 폼 입력값
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isImportant: false, 
  });

  // [추가] 파일 업로드 관련 상태
  const [uploadedFileIds, setUploadedFileIds] = useState([]); // 업로드된 파일 ID 목록

  // ---------------------------------------------------------
  // 1. 데이터 불러오기
  // ---------------------------------------------------------
  useEffect(() => {
    fetchData();
    setCurrentPage(1); 
    setSearchTerm('');
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = '';
      if (activeTab === 'notice') {
        url = '/api/notices'; 
      } else {
        // [주의] 관리자용 게시글 조회 API 경로
        url = '/api/admin/posts'; 
      }

      const res = await adminApi.get(url);
      const rawData = Array.isArray(res.data) ? res.data : (res.data.content || []);
      
      const formatted = rawData.map(item => ({
        id: item.postId || item.noticeId || item.id,
        title: item.title,
        content: item.content,
        // DTO 필드명(writerName) 확인 필요. 백엔드 Response에 맞게 조정
        writer: item.writerName || item.writer || (item.user ? item.user.name : '관리자'),
        regDate: item.createDate || item.regDate || '-',
        viewCount: item.viewCount || 0
      }));

      // 최신순 정렬
      formatted.sort((a, b) => new Date(b.regDate) - new Date(a.regDate));
      
      setDataList(formatted);
    } catch (err) {
      console.error(`${activeTab} 로딩 실패:`, err);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 2. 파일 업로드 핸들러 [추가됨]
  // ---------------------------------------------------------
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadData = new FormData();
    files.forEach(file => {
      uploadData.append('files', file); // 백엔드 @RequestParam("files") 와 일치해야 함
    });

    try {
      // MediaController에 정의된 업로드 엔드포인트 호출
      const res = await adminApi.post('/api/media/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 응답 예시: [{fileId: 1, url: '...'}, {fileId: 2, url: '...'}]
      const newIds = res.data.map(f => f.fileId);
      
      // 기존 ID 목록에 추가
      setUploadedFileIds(prev => [...prev, ...newIds]);
      
      alert(`이미지 ${files.length}개가 업로드되었습니다.`);
    } catch (err) {
      console.error("파일 업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  // ---------------------------------------------------------
  // 3. CRUD 핸들러
  // ---------------------------------------------------------

  // [삭제]
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까? (복구 불가)")) return;

    try {
      const url = activeTab === 'notice' 
        ? `/api/admin/notices/${id}` 
        : `/api/admin/posts/${id}`;
        
      await adminApi.delete(url);
      alert("삭제되었습니다.");
      fetchData(); 
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  // [모달 열기 - 생성]
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ title: '', content: '', isImportant: false });
    setUploadedFileIds([]); // 파일 ID 초기화
    setSelectedItem(null);
    setShowModal(true);
  };

  // [모달 열기 - 수정]
  const openEditModal = (item) => {
    setModalMode('edit');
    setFormData({
      title: item.title,
      content: item.content,
      isImportant: false 
    });
    setUploadedFileIds([]); // 수정 시 기존 파일 유지는 별도 로직 필요, 일단 초기화
    setSelectedItem(item);
    setShowModal(true);
  };

  // [저장 (생성/수정)]
  const handleSave = async () => {
    // 1. 유효성 검사
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 2. 전송할 데이터 (이미지 ID 포함)
    const payload = {
      ...formData,
      fileIds: uploadedFileIds
    };

    try {
      if (activeTab === 'notice') {
        // [공지사항] 생성, 수정 모두 가능
        if (modalMode === 'create') {
          await adminApi.post('/api/admin/notices', payload);
        } else {
          await adminApi.put(`/api/admin/notices/${selectedItem.id}`, payload);
        }
      } else {
        // [게시글] 관리자는 "수정"만 가능하도록 변경 (작성 시도는 차단)
        if (modalMode === 'create') {
           alert("관리자 권한으로 게시글을 직접 작성할 수 없습니다.\n(공지사항을 이용하거나, 회원이 쓴 글을 수정/삭제만 가능합니다.)");
           return; // 여기서 함수 종료 (API 호출 안 함)
        } else {
           // 수정은 정상적으로 진행
           await adminApi.put(`/api/admin/posts/${selectedItem.id}`, payload);
        }
      }

      alert(modalMode === 'create' ? "등록되었습니다." : "수정되었습니다.");
      setShowModal(false);
      setUploadedFileIds([]); // 파일 ID 초기화
      fetchData(); // 목록 갱신
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다: " + (err.response?.data?.message || err.message));
    }
  };

  // ---------------------------------------------------------
  // 4. 렌더링 헬퍼
  // ---------------------------------------------------------
  const filteredData = dataList.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.writer && item.writer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="board-mgmt-container">
      <div className="page-header">
        <h2>게시판 관리</h2>
      </div>

      {/* 탭 버튼 */}
      <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={`btn-tab ${activeTab === 'notice' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('notice')}
          style={{ 
            padding: '10px 20px', 
            fontWeight: activeTab === 'notice' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'notice' ? '#007bff' : '#f1f1f1',
            color: activeTab === 'notice' ? '#fff' : '#333',
            border: 'none', borderRadius: '5px', cursor: 'pointer'
          }}
        >
          공지사항 관리
        </button>
        <button 
          className={`btn-tab ${activeTab === 'post' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('post')}
          style={{ 
            padding: '10px 20px', 
            fontWeight: activeTab === 'post' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'post' ? '#007bff' : '#f1f1f1',
            color: activeTab === 'post' ? '#fff' : '#333',
            border: 'none', borderRadius: '5px', cursor: 'pointer'
          }}
        >
          회원 게시글(자유게시판)
        </button>
      </div>

      {/* 툴바 */}
      <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div className="search-area">
          <input 
            type="text" 
            placeholder="제목 또는 작성자 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', width: '250px' }}
          />
        </div>
        <div>
          {/* [핵심 수정] activeTab이 'notice'일 때만 등록 버튼 표시 */}
          {activeTab === 'notice' && (
            <button className="btn-create" onClick={openCreateModal} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border:'none', borderRadius:'4px', cursor:'pointer' }}>
              공지사항 등록
            </button>
          )}
        </div>
      </div>
      {/* 테이블 */}
      <div className="table-wrapper">
        <table className="account-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '12px', textAlign: 'center', width: '60px' }}>NO</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>제목</th>
              <th style={{ padding: '12px', textAlign: 'center', width: '120px' }}>작성자</th>
              <th style={{ padding: '12px', textAlign: 'center', width: '150px' }}>작성일</th>
              {activeTab === 'notice' && <th style={{ padding: '12px', textAlign: 'center', width: '80px' }}>조회수</th>}
              <th style={{ padding: '12px', textAlign: 'center', width: '150px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    {filteredData.length - ((currentPage - 1) * itemsPerPage) - index}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ cursor: 'pointer', fontWeight: 'bold', color: '#333' }} onClick={() => openEditModal(item)}>
                      {item.title}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{item.writer}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    {typeof item.regDate === 'string' ? item.regDate.substring(0, 10) : '-'}
                  </td>
                  {activeTab === 'notice' && (
                    <td style={{ textAlign: 'center', padding: '10px' }}>{item.viewCount}</td>
                  )}
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    <button 
                      onClick={() => openEditModal(item)}
                      style={{ marginRight: '5px', padding: '4px 8px', cursor: 'pointer', backgroundColor:'#007bff', color:'#fff', border:'none', borderRadius:'3px' }}
                    >
                      수정
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      style={{ padding: '4px 8px', cursor: 'pointer', backgroundColor:'#dc3545', color:'#fff', border:'none', borderRadius:'3px' }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>데이터가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i + 1} 
            onClick={() => setCurrentPage(i + 1)}
            style={{ 
              padding: '6px 12px', 
              border: '1px solid #ddd',
              backgroundColor: currentPage === i + 1 ? '#007bff' : '#fff',
              color: currentPage === i + 1 ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 생성/수정 모달 */}
      {showModal && (
        <div className="modal-overlay" style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div className="modal-content" style={{ 
            backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '500px', maxWidth: '90%' 
          }}>
            <h3>
              {activeTab === 'notice' ? '공지사항' : '게시글'} {modalMode === 'create' ? '등록' : '수정'}
            </h3>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>제목</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>내용</label>
              <textarea 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="10"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {/* [추가됨] 파일 업로드 필드 */}
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>이미지 첨부</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'block', marginTop: '5px' }}
              />
              {uploadedFileIds.length > 0 && (
                <p style={{ fontSize: '12px', color: 'green', marginTop: '5px' }}>
                  현재 {uploadedFileIds.length}개의 이미지가 업로드 준비됨
                </p>
              )}
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', cursor: 'pointer' }}>취소</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardMgmt;