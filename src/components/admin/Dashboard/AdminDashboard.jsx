import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // --- Mock Data (이미지 기준 데이터) ---
  const accountData = [
    { id: 'admin01', name: '김관리', role: 'SUPER', state: '활성', date: '2025-11-03 09:12' },
    { id: 'staff02', name: '이운영', role: 'STAFF', state: '활성', date: '2025-11-03 08:45' },
    { id: 'guest01', name: '박게스트', role: 'VIEWER', state: '잠금', date: '-' },
    { id: 'mod07', name: '정관리', role: 'MANAGER', state: '활성', date: '2025-11-02 21:33' },
    { id: 'staff31', name: '유직원', role: 'STAFF', state: '활성', date: '2025-11-02 19:10' },
  ];

  const boardData = [
    { name: '공지사항', scope: '전체', state: '사용', count: 132, date: '2025-11-03' },
    { name: '포토갤러리', scope: '회원', state: '사용', count: 87, date: '2025-11-03' },
    { name: 'FAQ', scope: '전체', state: '사용', count: 24, date: '2025-11-02' },
    { name: '내부공지', scope: '관리자', state: '중지', count: 11, date: '2025-11-01' },
    { name: '이벤트', scope: '전체', state: '사용', count: 5, date: '2025-10-31' },
  ];

  const popupData = [
    { title: '11월 메인 배너', period: '11.01 ~ 11.07', state: '활성', priority: 1 },
    { title: '딸기 굿즈 콘테스트', period: '11.05 ~ 11.29', state: '활성', priority: 2 },
    { title: '긴급 점검 안내', period: '~ 오늘', state: '만료 예정', priority: 1 },
    { title: '자원봉사 모집', period: '10.15 ~ 11.30', state: '활성', priority: 3 },
    { title: '굿즈 사전예약', period: '종료', state: '비활성', priority: 5 },
  ];

  const logData = [
    { time: '09:12:04', type: 'LOGIN', user: 'admin01', ip: '10.0.0.12', msg: '관리자 로그인 성공' },
    { time: '09:10:33', type: 'UPDATE', user: 'admin01', ip: '10.0.0.12', msg: '공지사항 게시글 수정' },
    { time: '09:07:01', type: 'ERROR', user: 'system', ip: '127.0.0.1', msg: '이미지 업로드 실패(용량 초과)' },
    { time: '08:59:22', type: 'CREATE', user: 'mod07', ip: '10.0.0.55', msg: '팝업 생성: 11월 메인 행사' },
    { time: '08:42:11', type: 'WARN', user: 'system', ip: '127.0.0.1', msg: 'API 지연(+1.5s)' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-wrapper">
      
      {/* 1. 계정관리 섹션 */}
      <div className="dash-card">
        <div className="dash-header">
          <h3>계정관리</h3>
          <span className="status-badge green">요약</span>
        </div>
        <div className="stats-box">
          <div><span>전체</span> <strong>58</strong></div>
          <div><span>활동</span> <strong>53</strong></div>
          <div><span>잠금</span> <strong>5</strong></div>
          <div><span>금주 가입</span> <strong>3</strong></div>
        </div>
        <div className="action-bar">
          <input type="text" placeholder="이름/이메일 검색" />
          <button className="btn-dark">검색</button>
          <button className="btn-blue" onClick={() => navigate('/admin/account')}>신규</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>아이디</th><th>이름</th><th>역할</th><th>상태</th><th>최근 로그인</th></tr>
          </thead>
          <tbody>
            {accountData.map((row, i) => (
              <tr key={i}>
                <td>{row.id}</td><td>{row.name}</td><td>{row.role}</td>
                <td><span className={`dot ${row.state === '활성' ? 'active' : 'inactive'}`}></span>{row.state}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-footer" onClick={() => navigate('/admin/account')}>모두 보기 →</div>
      </div>

      {/* 2. 게시판관리 섹션 */}
      <div className="dash-card">
        <div className="dash-header">
          <h3>게시판관리</h3>
          <span className="status-badge green">요약</span>
        </div>
        <div className="stats-box">
          <div><span>게시판 수</span> <strong>7</strong></div>
          <div><span>자유글</span> <strong>6</strong></div>
          <div><span>비공개</span> <strong>2</strong></div>
          <div><span>금주 질문</span> <strong>1</strong></div>
        </div>
        <div className="action-bar">
          <input type="text" placeholder="게시판명 검색" />
          <button className="btn-dark">검색</button>
          <button className="btn-blue" onClick={() => navigate('/admin/board')}>게시판 생성</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>게시판명</th><th>권한</th><th>상태</th><th>게시물수</th><th>수정일</th></tr>
          </thead>
          <tbody>
            {boardData.map((row, i) => (
              <tr key={i}>
                <td>{row.name}</td><td>{row.scope}</td>
                <td><span className={`dot ${row.state === '사용' ? 'active' : 'inactive'}`}></span>{row.state}</td>
                <td>{row.count}</td><td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-footer" onClick={() => navigate('/admin/board')}>모두 보기 →</div>
      </div>

      {/* 3. 팝업관리 섹션 */}
      <div className="dash-card">
        <div className="dash-header">
          <h3>팝업관리</h3>
          <span className="status-badge green">요약</span>
        </div>
        <div className="stats-box">
          <div><span>전체 팝업</span> <strong>12</strong></div>
          <div><span>진행중</span> <strong>3</strong></div>
          <div><span>오늘 완료</span> <strong>1</strong></div>
          <div><span>금주 신규</span> <strong>1</strong></div>
        </div>
        <div className="action-bar">
          <input type="text" placeholder="팝업 제목 검색" />
          <button className="btn-dark">검색</button>
          <button className="btn-blue" onClick={() => navigate('/admin/popup')}>신규 팝업</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>제목</th><th>기간</th><th>상태</th><th>우선순위</th></tr>
          </thead>
          <tbody>
            {popupData.map((row, i) => (
              <tr key={i}>
                <td>{row.title}</td><td>{row.period}</td>
                <td>
                    <span className={`status-text ${row.state === '활성' ? 'text-green' : row.state === '만료 예정' ? 'text-orange' : 'text-gray'}`}>
                        {row.state}
                    </span>
                </td>
                <td>{row.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-footer" onClick={() => navigate('/admin/popup')}>모두 보기 →</div>
      </div>

      {/* 4. 로그 기록 섹션 */}
      <div className="dash-card">
        <div className="dash-header">
          <h3>로그 기록</h3>
          <span className="status-badge green">요약</span>
        </div>
        <div className="stats-box">
          <div><span>오늘 접속</span> <strong>1,204</strong></div>
          <div><span>오류</span> <strong>3</strong></div>
          <div><span>경고</span> <strong>9</strong></div>
          <div><span>관리자 작업</span> <strong>28</strong></div>
        </div>
        <div className="action-bar">
          <input type="text" placeholder="기간/유형/IP 검색" />
          <button className="btn-dark">검색</button>
          <button className="btn-green">엑셀</button>
          <button className="btn-red">에러만</button>
        </div>
        <table className="dash-table">
          <thead>
            <tr><th>시간</th><th>유형</th><th>주체</th><th>IP</th><th>요약</th></tr>
          </thead>
          <tbody>
            {logData.map((row, i) => (
              <tr key={i} className={row.type === 'ERROR' ? 'row-error' : ''}>
                <td>{row.time}</td>
                <td className={row.type === 'ERROR' ? 'text-red' : ''}>{row.type}</td>
                <td>{row.user}</td><td>{row.ip}</td><td>{row.msg}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-footer" onClick={() => navigate('/admin/log')}>모두 보기 →</div>
      </div>
      </div>

    </div>
  );
};

export default AdminDashboard;