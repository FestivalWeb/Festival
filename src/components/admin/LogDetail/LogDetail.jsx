import React, { useState } from 'react';
import './LogDetail.css';

const LogDetail = () => {
  // --- 1. 데이터 및 상태 관리 ---
  // Mock Data (상세 정보를 위해 userAgent, stackTrace 등 추가 필드 포함)
  const [logs] = useState([
    { id: 1, time: '2025-11-24 09:12:04', type: 'LOGIN', user: 'admin01', ip: '10.0.0.12', msg: '관리자 로그인 성공', path: '/admin/login', browser: 'Chrome/119', stackTrace: '' },
    { id: 2, time: '2025-11-24 09:07:01', type: 'ERROR', user: 'system', ip: '127.0.0.1', msg: '이미지 업로드 실패(용량 초과)', path: '/api/files', browser: 'System', stackTrace: 'java.io.IOException: File size exceeds limit...' },
    { id: 3, time: '2025-11-24 08:42:11', type: 'WARN', user: 'system', ip: '127.0.0.1', msg: 'API 지연(+1.5s)', path: '/api/public/events', browser: 'System', stackTrace: '' },
    { id: 4, time: '2025-11-24 08:39:09', type: 'DELETE', user: 'staff22', ip: '10.0.0.88', msg: '이벤트 게시물 삭제', path: '/admin/boards/evt/5', browser: 'Firefox/118', stackTrace: '' },
    { id: 5, time: '2025-11-24 08:37:52', type: 'LOGIN_FAIL', user: 'guest01', ip: '203.0.113.5', msg: '비밀번호 5회 실패', path: '/login', browser: 'Safari/17', stackTrace: '' },
    { id: 6, time: '2025-11-23 22:10:00', type: 'VIEW', user: 'user55', ip: '211.23.44.1', msg: '메인 페이지 조회', path: '/', browser: 'Chrome/Mobile', stackTrace: '' },
  ]);

  // 필터 상태
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 열 선택 상태 (true면 보임)
  const [visibleColumns, setVisibleColumns] = useState({
    time: true, type: true, user: true, ip: true, msg: true, path: true
  });
  const [showColumnModal, setShowColumnModal] = useState(false); // 열 선택 메뉴 토글

  // 상세 보기 모달 상태
  const [selectedLog, setSelectedLog] = useState(null);

  // --- 2. 로직 처리 ---

  // 필터링
  const filteredLogs = logs.filter(log => {
    // 날짜 필터 (단순 문자열 비교)
    let matchDate = true;
    if (startDate && log.time < startDate) matchDate = false;
    if (endDate && log.time > endDate + ' 23:59:59') matchDate = false;

    // 유형 및 검색어 필터
    const matchType = typeFilter === 'ALL' || log.type === typeFilter;
    const matchSearch = log.msg.includes(searchTerm) || log.ip.includes(searchTerm) || log.user.includes(searchTerm);

    return matchDate && matchType && matchSearch;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentData = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 엑셀 다운로드 (Mock)
  const handleDownload = () => {
    alert(`총 ${filteredLogs.length}개의 로그를 엑셀로 다운로드합니다.`);
  };

  // 열 선택 토글 함수
  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <div className="log-container">
      <div className="page-header">
        <h2>접속/작업 로그 <span className="sub-text">오늘 {filteredLogs.length}건</span></h2>
      </div>

      {/* 툴바 */}
      <div className="toolbar">
        <div className="filter-area-log">
          {/* 기간 선택 */}
          <div className="date-range">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span>~</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>

          {/* 유형 선택 */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="ALL">유형 전체</option>
            <option value="LOGIN">LOGIN</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="DELETE">DELETE</option>
          </select>

          {/* 검색어 */}
          <input 
            type="text" 
            placeholder="IP/ID/메시지 검색" 
            className="input-search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="btn-search-action">검색</button>
        </div>

        <div className="action-buttons relative">
          {/* 열 선택 버튼 & 드롭다운 */}
          <button className="btn-column" onClick={() => setShowColumnModal(!showColumnModal)}>
             ▤ 열 선택
          </button>
          {showColumnModal && (
            <div className="column-menu">
              <label><input type="checkbox" checked={visibleColumns.time} onChange={() => toggleColumn('time')} /> 시간</label>
              <label><input type="checkbox" checked={visibleColumns.type} onChange={() => toggleColumn('type')} /> 유형</label>
              <label><input type="checkbox" checked={visibleColumns.user} onChange={() => toggleColumn('user')} /> 사용자</label>
              <label><input type="checkbox" checked={visibleColumns.ip} onChange={() => toggleColumn('ip')} /> IP</label>
              <label><input type="checkbox" checked={visibleColumns.msg} onChange={() => toggleColumn('msg')} /> 요약</label>
              <label><input type="checkbox" checked={visibleColumns.path} onChange={() => toggleColumn('path')} /> 경로</label>
            </div>
          )}

          <button className="btn-excel" onClick={handleDownload}>엑셀 다운로드</button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              {visibleColumns.time && <th style={{width: '180px'}}>시간</th>}
              {visibleColumns.type && <th style={{width: '100px'}}>유형</th>}
              {visibleColumns.user && <th style={{width: '120px'}}>주체</th>}
              {visibleColumns.ip && <th style={{width: '140px'}}>IP</th>}
              {visibleColumns.msg && <th>요약</th>}
              {visibleColumns.path && <th style={{width: '180px'}}>경로</th>}
              <th style={{width: '80px'}}>세부</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((log) => (
              <tr key={log.id} className={log.type === 'ERROR' ? 'row-error' : ''}>
                {visibleColumns.time && <td>{log.time}</td>}
                {visibleColumns.type && (
                  <td>
                    <span className={`log-badge ${log.type}`}>
                      {log.type}
                    </span>
                  </td>
                )}
                {visibleColumns.user && <td>{log.user}</td>}
                {visibleColumns.ip && <td>{log.ip}</td>}
                {visibleColumns.msg && <td className="text-left">{log.msg}</td>}
                {visibleColumns.path && <td className="text-gray">{log.path}</td>}
                <td>
                  <button className="btn-detail" onClick={() => setSelectedLog(log)}>상세</button>
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

      {/* --- 상세 정보 모달 --- */}
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
                <div className="detail-item full"><strong>요약 메시지:</strong> {selectedLog.msg}</div>
                <div className="detail-item full"><strong>요청 경로:</strong> {selectedLog.path}</div>
                <div className="detail-item full"><strong>브라우저/OS:</strong> {selectedLog.browser}</div>
                
                {selectedLog.stackTrace && (
                  <div className="detail-item full">
                    <strong>Stack Trace:</strong>
                    <pre className="code-block">{selectedLog.stackTrace}</pre>
                  </div>
                )}
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