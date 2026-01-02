import React, { useState, useEffect, useCallback } from 'react';
import adminApi from '../../../api/api'; 
import './LogDetail.css';

const LogDetail = () => {
  // --- 1. 상태 관리 ---
  const [logs, setLogs] = useState([]); 

  // 필터 상태
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 열 선택 및 모달 상태
  const [visibleColumns, setVisibleColumns] = useState({
    time: true, type: true, user: true, ip: true, msg: true, path: true
  });
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // --- 2. 데이터 불러오기 (API) ---
  // [수정] 검색 버튼을 누를 때, 조건(날짜, 검색어)을 서버로 전송합니다.
  const fetchLogs = useCallback(async () => {
    try {
      // 서버로 보낼 파라미터 준비
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (typeFilter !== 'ALL') params.type = typeFilter;
      if (searchTerm) params.keyword = searchTerm;

      // API 호출 (파라미터 포함)
      const res = await adminApi.get('/api/admin/logs', { params });
      
      const mappedData = res.data.map(log => ({
        id: log.actLogId, 
        time: log.occurredAt ? new Date(log.occurredAt).toLocaleString() : '-', 
        type: log.actionType || 'INFO',
        user: log.username || 'System', 
        ip: log.ipAddress,
        msg: log.message, 
        path: '-', 
        browser: '-',
        stackTrace: ''
      }));
      
      setLogs(mappedData);
      setCurrentPage(1); // 검색 시 1페이지로 초기화
    } catch (err) {
      console.error("로그 로딩 실패", err);
      setLogs([]); // 에러 시 빈 배열
    }
  }, [startDate, endDate, typeFilter, searchTerm]);

  // 초기 로딩 (화면 켜질 때 1번 실행)
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, []);

  // --- 3. 렌더링 준비 ---
  // [중요] 클라이언트 측 필터링(filter 함수) 제거 -> 서버에서 이미 걸러져서 옴
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(logs.length / itemsPerPage) || 1;
  const currentData = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownload = () => {
    alert(`현재 조회된 ${logs.length}개의 로그를 다운로드합니다.`);
  };

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <div className="log-container">
      <div className="page-header">
        <h2>접속/작업 로그 <span className="sub-text">검색 결과 {logs.length}건</span></h2>
      </div>

      <div className="toolbar">
        <div className="filter-area-log">
          <div className="date-range">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span>~</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>

          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="ALL">유형 전체</option>
            <option value="INFO">INFO</option>
            <option value="LOGIN">LOGIN</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
          </select>

          <input 
            type="text" 
            placeholder="IP/ID/내용 검색" 
            className="input-search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchLogs()}
          />
          {/* [수정] 버튼 클릭 시 fetchLogs 실행 (서버 검색) */}
          <button className="btn-search-action" onClick={fetchLogs}>검색</button>
        </div>

        <div className="action-buttons relative">
          <button className="btn-column" onClick={() => setShowColumnModal(!showColumnModal)}>
             ▤ 열 선택
          </button>
          {showColumnModal && (
            <div className="column-menu">
              <label><input type="checkbox" checked={visibleColumns.time} onChange={() => toggleColumn('time')} /> 시간</label>
              <label><input type="checkbox" checked={visibleColumns.type} onChange={() => toggleColumn('type')} /> 유형</label>
              <label><input type="checkbox" checked={visibleColumns.user} onChange={() => toggleColumn('user')} /> 사용자</label>
              <label><input type="checkbox" checked={visibleColumns.ip} onChange={() => toggleColumn('ip')} /> IP</label>
              <label><input type="checkbox" checked={visibleColumns.msg} onChange={() => toggleColumn('msg')} /> 내용</label>
              <label><input type="checkbox" checked={visibleColumns.path} onChange={() => toggleColumn('path')} /> 경로</label>
            </div>
          )}
          <button className="btn-excel" onClick={handleDownload}>엑셀 다운로드</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              {visibleColumns.time && <th style={{width: '180px'}}>시간</th>}
              {visibleColumns.type && <th style={{width: '100px'}}>유형</th>}
              {visibleColumns.user && <th style={{width: '120px'}}>주체</th>}
              {visibleColumns.ip && <th style={{width: '140px'}}>IP</th>}
              {visibleColumns.msg && <th>내용</th>}
              {visibleColumns.path && <th style={{width: '150px'}}>경로</th>}
              <th style={{width: '80px'}}>세부</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((log) => (
                <tr key={log.id} className={log.type === 'ERROR' ? 'row-error' : ''}>
                  {visibleColumns.time && <td>{log.time}</td>}
                  {visibleColumns.type && (
                    <td><span className={`log-badge ${log.type}`}>{log.type}</span></td>
                  )}
                  {visibleColumns.user && <td>{log.user}</td>}
                  {visibleColumns.ip && <td>{log.ip}</td>}
                  {visibleColumns.msg && <td className="text-left">{log.msg}</td>}
                  {visibleColumns.path && <td className="text-gray">{log.path}</td>}
                  <td>
                    <button className="btn-detail" onClick={() => setSelectedLog(log)}>상세</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                  데이터가 없습니다. (기간을 변경하거나 검색어를 확인하세요)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content log-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>로그 상세 정보 <span className="log-id">#{selectedLog.id}</span></h3>
              <button className="close-btn" onClick={() => setSelectedLog(null)}>닫기</button>
            </div>
            <div className="modal-body">
              <div className="log-detail-grid">
                <div className="detail-item"><strong>발생 시간:</strong> {selectedLog.time}</div>
                <div className="detail-item"><strong>유형:</strong> <span className={`log-text ${selectedLog.type}`}>{selectedLog.type}</span></div>
                <div className="detail-item"><strong>사용자:</strong> {selectedLog.user}</div>
                <div className="detail-item"><strong>IP 주소:</strong> {selectedLog.ip}</div>
                <div className="detail-item full"><strong>내용:</strong> {selectedLog.msg}</div>
                <div className="detail-item full"><strong>요청 경로:</strong> {selectedLog.path}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-confirm" onClick={() => setSelectedLog(null)}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogDetail;