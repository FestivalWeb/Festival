import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/api'; 
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // 1. 통계 데이터 상태
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPosts: 0,
    totalVisitors: 0,
    newReports: 0,
    totalBooths: 0
  });

  const [allData, setAllData] = useState({
    accounts: [],
    boards: [],
    booths: [],
    logs: []
  });

  const [previewData, setPreviewData] = useState({
    accounts: [],
    boards: [],
    booths: [],
    logs: []
  });

  const [searchInputs, setSearchInputs] = useState({
    account: '',
    board: '',
    booth: '',
    log: ''
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const results = await Promise.allSettled([
          adminApi.get('/api/admin/dashboard/stats'),
          adminApi.get('/api/admin/accounts'),
          adminApi.get('/api/admin/boards'),
          adminApi.get('/api/admin/booths'),
          adminApi.get('/api/admin/logs')
        ]);

        const statsData = results[0].status === 'fulfilled' ? results[0].value.data : {};
        const accountsData = results[1].status === 'fulfilled' ? results[1].value.data : [];
        const boardsData = results[2].status === 'fulfilled' ? results[2].value.data : [];
        const boothsData = results[3].status === 'fulfilled' ? results[3].value.data : [];
        const logsData = results[4].status === 'fulfilled' ? results[4].value.data : [];

        // [수정] 데이터가 배열인지, 아니면 Page 객체(.content)인지 확인하여 추출
        const getSafeList = (data) => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (data.content && Array.isArray(data.content)) return data.content;
          return [];
        };

        const fullData = {
        accounts: getSafeList(accountsData),
        boards: getSafeList(boardsData),
        booths: getSafeList(boothsData),
        logs: getSafeList(logsData)
        };

        // [수정] totalBooths 카운트도 안전하게 계산 (Page 객체일 경우 totalElements 사용 추천)
        setStats({
          totalMembers: statsData.totalMembers || 0,
          totalPosts: statsData.totalPosts || 0, 
          totalVisitors: statsData.totalVisitors || 0,
          newReports: statsData.newReports || 0,
          // boothsData가 Page 객체라면 .length는 undefined일 수 있음 -> fullData.booths.length로 변경
          totalBooths: fullData.booths.length 
        });

        setAllData(fullData);

        setPreviewData({
          accounts: fullData.accounts.slice(0, 5),
          boards: fullData.boards.slice(0, 5),
          booths: fullData.booths.slice(0, 5),
          logs: fullData.logs.slice(0, 5)
        });

      } catch (err) {
        console.error("대시보드 로딩 실패:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 300); 
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearchChange = (field, value) => {
    setSearchInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleLocalSearch = (category) => {
    const keyword = searchInputs[category].toLowerCase().trim();
    const sourceData = allData[category + 's']; 

    if (!keyword) {
      setPreviewData(prev => ({
        ...prev,
        [category + 's']: sourceData.slice(0, 5)
      }));
      return;
    }

    let filtered = [];
    if (category === 'account') {
      filtered = sourceData.filter(item => 
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.username && item.username.toLowerCase().includes(keyword))
      );
    } else if (category === 'board') {
      filtered = sourceData.filter(item => 
        (item.name && item.name.toLowerCase().includes(keyword))
      );
    } else if (category === 'booth') {
      filtered = sourceData.filter(item => 
        (item.title && item.title.toLowerCase().includes(keyword))
      );
    } else if (category === 'log') {
      filtered = sourceData.filter(item => 
        (item.message && item.message.toLowerCase().includes(keyword)) ||
        (item.actionType && item.actionType.toLowerCase().includes(keyword))
      );
    }

    setPreviewData(prev => ({
      ...prev,
      [category + 's']: filtered.slice(0, 5)
    }));
  };

  const handleKeyDown = (e, category) => {
    if (e.key === 'Enter') handleLocalSearch(category);
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard loading-container">
        <div className="spinner"></div>
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-wrapper">
      
      {/* 1. 계정관리 */}
      <div className="dash-card">
        <div className="dash-header">
          <h3>계정관리</h3>
          <span className="status-badge green">요약</span>
        </div>
        <div className="stats-box">
          <div><span>총 회원</span> <strong>{stats.totalMembers}</strong></div>
          <div><span>활동</span> <strong>-</strong></div>
        </div>
        <div className="action-bar">
          <input 
            type="text" 
            placeholder="이름/아이디 검색" 
            value={searchInputs.account}
            onChange={(e) => handleSearchChange('account', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'account')}
          />
          <button className="btn-dark" onClick={() => handleLocalSearch('account')}>검색</button>
          <button className="btn-blue" onClick={() => navigate('/admin/account')}>관리</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>아이디</th><th>이름</th><th>역할</th><th>상태</th><th>가입일</th></tr>
          </thead>
          <tbody>
            {previewData.accounts.length > 0 ? (
              previewData.accounts.map((user, i) => (
                <tr key={i}>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.roles && user.roles[0]}</td>
                  <td>
                    <span className={`dot ${user.status === 'ACTIVE' ? 'active' : 'inactive'}`}></span>
                    {user.status}
                  </td>
                  <td>{user.createdAt ? user.createdAt.substring(0, 10) : '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{textAlign:'center', padding:'20px', color: '#888'}}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
        <div className="card-footer" onClick={() => navigate('/admin/account')}>모두 보기 →</div>
      </div>

      {/* 2. 게시판관리 */}
      <div className="dash-card">
        <div className="dash-header">
          <h3>게시판관리</h3>
          <span className="status-badge green">요약</span>
        </div>
        <div className="stats-box">
          <div><span>게시판 수</span> <strong>{allData.boards.length}</strong></div>
          <div><span>총 게시글</span> <strong>{stats.totalPosts}</strong></div>
        </div>
        <div className="action-bar">
          <input 
            type="text" 
            placeholder="게시판명 검색" 
            value={searchInputs.board}
            onChange={(e) => handleSearchChange('board', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'board')}
          />
          <button className="btn-dark" onClick={() => handleLocalSearch('board')}>검색</button>
          <button className="btn-blue" onClick={() => navigate('/admin/board')}>게시판 생성</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>게시판명</th><th>권한</th><th>상태</th><th>게시물수</th><th>수정일</th></tr>
          </thead>
          <tbody>
            {previewData.boards.length > 0 ? (
              previewData.boards.map((board, i) => (
                <tr key={i}>
                  <td>{board.name}</td>
                  <td>{board.readRole}</td>
                  <td>
                    <span className={`dot ${board.status === 'ACTIVE' ? 'active' : 'inactive'}`}></span>
                    {board.status === 'ACTIVE' ? '사용' : '중지'}
                  </td>
                  <td>{board.postCount || 0}</td>
                  <td>{board.updatedAt ? board.updatedAt.substring(0, 10) : '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{textAlign:'center', padding:'20px', color: '#888'}}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
        <div className="card-footer" onClick={() => navigate('/admin/board')}>모두 보기 →</div>
      </div>

      {/* 3. 팝업/부스 관리 */}
      <div className="dash-card">
        <div className="dash-header">
          <h3>팝업/부스 관리</h3>
          <span className="status-badge green">요약</span>
        </div>
        <div className="stats-box">
          <div><span>전체 등록</span> <strong>{stats.totalBooths}</strong></div>
          <div><span>진행중</span> <strong>-</strong></div>
        </div>
        <div className="action-bar">
          <input 
            type="text" 
            placeholder="부스 제목 검색" 
            value={searchInputs.booth}
            onChange={(e) => handleSearchChange('booth', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'booth')}
          />
          <button className="btn-dark" onClick={() => handleLocalSearch('booth')}>검색</button>
          <button className="btn-blue" onClick={() => navigate('/admin/popup')}>신규 등록</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>제목</th><th>기간(운영일)</th><th>상태</th><th>우선순위</th></tr>
          </thead>
          <tbody>
            {previewData.booths.length > 0 ? (
              previewData.booths.map((booth, i) => (
                <tr key={i}>
                  <td>{booth.title}</td>
                  <td>{booth.eventDate}</td>
                  <td>
                    <span className={`status-text ${booth.isShow ? 'text-green' : 'text-gray'}`}>
                      {booth.isShow ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td>{booth.priority}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{textAlign:'center', padding:'20px', color: '#888'}}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
        <div className="card-footer" onClick={() => navigate('/admin/popup')}>모두 보기 →</div>
      </div>

      {/* 4. 로그 기록 */}
      <div className="dash-card">
        <div className="dash-header">
          <h3>로그 기록</h3>
          <span className="status-badge green">요약</span>
        </div>
        <div className="stats-box">
          <div><span>오늘 접속</span> <strong>{stats.totalVisitors}</strong></div>
          <div><span>새 로그</span> <strong>{allData.logs.length}</strong></div>
        </div>
        <div className="action-bar">
          <input 
            type="text" 
            placeholder="유형/메시지 검색" 
            value={searchInputs.log}
            onChange={(e) => handleSearchChange('log', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'log')}
          />
          <button className="btn-dark" onClick={() => handleLocalSearch('log')}>검색</button>
          <button className="btn-green">엑셀</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>시간</th><th>유형</th><th>주체</th><th>IP</th><th>요약</th></tr>
          </thead>
          <tbody>
            {previewData.logs.length > 0 ? (
              previewData.logs.map((log, i) => (
                <tr key={i} className={log.actionType === 'ERROR' ? 'row-error' : ''}>
                  <td>{log.occurredAt ? new Date(log.occurredAt).toLocaleTimeString() : '-'}</td>
                  <td className={log.actionType === 'ERROR' ? 'text-red' : ''}>{log.actionType || 'INFO'}</td>
                  <td>{log.username || 'System'}</td>
                  <td>{log.ipAddress}</td>
                  <td className="text-ellipsis" title={`${log.actionType} ${log.message}`}>
                    {log.actionType} {log.message}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{textAlign:'center', padding:'20px', color: '#888'}}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
        <div className="card-footer" onClick={() => navigate('/admin/log')}>모두 보기 →</div>
      </div>
      
      </div>
    </div>
  );
};

export default AdminDashboard;