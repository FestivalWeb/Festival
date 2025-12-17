import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MyPage.css';
import instaIcon from '../assets/인스타그램.png';
import ytIcon from '../assets/유튜브.png';
import mailIcon from '../assets/이메일.png';
import Reservations from './Reservations';
import Pagination from '../components2/board/Pagination'; 
import ConfirmModal from './ConfirmModal';

const MyPage = ({ onLogout }) => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // ▼▼▼ [핵심] 강력한 카카오 유저 판독기 (Provider가 없어도 잡아냅니다) ▼▼▼
  const isKakao = user && (
    (user.provider === 'KAKAO') || 
    String(user.userId || "").toLowerCase().includes('kakao') ||
    String(user.id || "").toLowerCase().includes('kakao') ||
    String(user.email || "").toLowerCase().includes('kakao') ||
    String(user.name || "").toLowerCase().includes('kakao')
  );

  const [view, setView] = useState('info');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  // 비밀번호 변경/탈퇴용 state
  const [deletePassword, setDeletePassword] = useState("");
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showNewConfirm, setShowNewConfirm] = useState(false);

  // [추가] 비밀번호 변경 폼 데이터 관리
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    if (view !== 'delete') setDeletePassword(""); // 뷰 변경 시 탈퇴 비번 초기화
    if (view !== 'pwd') setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); // 비밀번호 폼 초기화

    if (user && view === 'reservations') {
      // API 호출 시 user.id 없으면 user.userId 사용
      const uid = user.id || user.userId;
      fetch(`/api/reservations/me?userId=${uid}&page=${currentPage - 1}&size=5`)
        .then((res) => {
          if (!res.ok) throw new Error('예약 조회 실패');
          return res.json();
        })
        .then((data) => {
          setMyReservations(data.content);
          setTotalPages(data.totalPages);
        })
        .catch((err) => console.error(err));
    }
  }, [user, view, currentPage]);

  const handleLogout = () => {
    logout();
    onLogout && onLogout();
    navigate('/');
  };

  const openConfirm = (action, target = null) => {
    setConfirmAction(action);
    if(target) setSelectedReservation(target);
    setConfirmOpen(true);
  };

  const handleConfirm = async (ok) => {
    setConfirmOpen(false);
    if (!ok) {
        setConfirmAction(null);
        return;
    }

    if (confirmAction === 'reservation-cancel') {
      if (!selectedReservation) return;
      try {
        const res = await fetch(`/api/reservations/${selectedReservation.reservationId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            alert('예약이 취소되었습니다.');
            setMyReservations(prev => prev.filter(r => r.reservationId !== selectedReservation.reservationId));
            setView('reservations');
            setSelectedReservation(null);
        } else {
            alert('예약 취소 실패');
        }
      } catch (err) {
        console.error(err);
        alert('서버 오류');
      }
    }
    
    if (confirmAction === 'pwd-cancel') {
      setView('info');
    }
    
    setConfirmAction(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...(user || {}), ...form };
    updateUser(updated);
    alert('정보가 저장되었습니다.');
    setView('info');
  };

  // [추가] 비밀번호 입력 핸들러
  const handleChangePwd = (e) => {
    const { name, value } = e.target;
    setPwdForm(prev => ({ ...prev, [name]: value }));
  };

  // [추가] 비밀번호 변경 API 호출
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const userId = user.userId || user.id;
      // UserController의 @PutMapping("/users/password") 호출
      const res = await fetch(`/users/password?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pwdForm),
      });

      if (res.ok) {
        alert('비밀번호가 성공적으로 변경되었습니다.\n보안을 위해 다시 로그인해주세요.');
        logout();
        navigate('/login');
      } else {
        const msg = await res.text(); // 서버에서 보낸 에러 메시지 (예: 현재 비밀번호 불일치)
        alert('비밀번호 변경 실패: ' + msg);
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 회원 탈퇴 로직
  const handleDelete = async () => {
    if (!window.confirm('정말 계정을 삭제하시겠습니까? 삭제된 정보는 복구할 수 없습니다.')) {
        return;
    }

    // 카카오가 아닌데 비번 없으면 차단
    if (!isKakao && !deletePassword) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    try {
        const userId = user.userId || user.id;
        // UserController의 @DeleteMapping("/users/me") 호출
        // 카카오 유저는 비밀번호 검증을 패스하기 위해 더미값 전송
        const pwdToSend = isKakao ? 'kakao-pass' : deletePassword;
        
        const response = await fetch(`/users/me?userId=${userId}&password=${encodeURIComponent(pwdToSend)}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('계정이 삭제되었습니다. 이용해 주셔서 감사합니다.');
            logout();
            onLogout && onLogout();
            navigate('/');
        } else {
            const errorMsg = await response.text();
            alert(`탈퇴 실패: ${errorMsg}`);
        }
    } catch (err) {
        console.error(err);
        alert('서버 오류가 발생했습니다.');
    }
  };

  const renderContent = () => {
    if (!user) return <div className="mypage-center">로그인 후 이용해주세요.</div>;

    if (view === 'info') {
      return (
        <div className="mypage-info">
          <h3>내 정보</h3>
          <p className="hint">원하는 정보를 수정할 수 있습니다.</p>
          <div className="info-form">
            <div className="info-row">
              <div className="label">이름</div>
              <div className="field"><input readOnly value={user.name || ''} className="info-input" /></div>
            </div>
            <div className="info-row">
              <div className="label">이메일</div>
              <div className="field"><input readOnly value={user.email || ''} className="info-input" /></div>
            </div>
            <div className="info-row">
              <div className="label">전화번호</div>
              <div className="field"><input readOnly value={user.phone || ''} className="info-input" /></div>
            </div>
            <div className="actions actions-right">
              <button className="btn-primary" onClick={() => setView('edit')}>수정하기</button>
            </div>
          </div>
        </div>
      );
    }

    if (view === 'reservations') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Reservations
              reservations={myReservations}
              onViewDetail={(r) => { 
                  setSelectedReservation(r); 
                  setView('reservation-detail'); 
              }}
            />
            {myReservations.length > 0 && (
                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                    <Pagination 
                        totalPages={totalPages} 
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)} 
                    />
                </div>
            )}
          </div>
        );
    }

    if (view === 'reservation-detail') {
        const r = selectedReservation;
        if (!r) return <div onClick={() => setView('reservations')}>선택된 예약이 없습니다.</div>;

        return (
          <div className="reservation-detail">
            <h3>예약 상세 정보</h3>
            <div className="detail-card">
              <img 
                src={r.boothImg || "/images/booth1.jpg"} 
                alt={r.boothTitle} 
                className="detail-thumb"
                style={{ objectFit: 'cover' }}
              />
              <div className="detail-info">
                <div className="detail-title">{r.boothTitle}</div>
                <p>{r.boothLocation}</p>
                <dl>
                  <dt>예약자</dt><dd>{user.name}</dd>
                  <dt>예약 날짜</dt><dd>{r.reserveDate}</dd>
                  <dt>인원</dt><dd>{r.count}명</dd>
                  <dt>상태</dt><dd>{r.status}</dd>
                </dl>
              </div>
            </div>
            <div className="detail-actions">
              <button className="btn-ghost" onClick={() => openConfirm('reservation-cancel')}>예약 취소</button>
              <button className="btn-primary" onClick={() => setView('reservations')}>목록으로</button>
            </div>
          </div>
        );
    }

    if (view === 'posts') {
      const mockPosts = [
        { id: 1, title: '2025 논산딸기축제 너무 기대됩니다!', date: '2025-03-01' },
        { id: 2, title: '주차장 위치 문의드립니다.', date: '2025-03-05' },
        { id: 3, title: '체험부스 예약 확인 부탁드려요.', date: '2025-03-10' }
      ];

      return (
        <div className="posts-list">
          <h3>내가 쓴 글 목록</h3>
          <table className="posts-table">
            <thead>
              <tr><th>글번호</th><th>제목</th><th>작성일</th></tr>
            </thead>
            <tbody>
              {mockPosts.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td className="post-title" style={{cursor:'pointer'}}>{p.title}</td>
                  <td>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="posts-actions">
            <div className="pager">&nbsp;|&nbsp; &lt; 1 &gt; &nbsp;|&nbsp;</div>
            <button className="btn-primary" onClick={() => navigate('/post')}>전체 게시판 가기</button>
          </div>
        </div>
      );
    }

    if (view === 'edit') {
      return (
        <form className="mypage-edit" onSubmit={handleSave}>
          <h3>정보 수정하기</h3>
          <p className="hint">형식에 맞게 원하는 정보를 수정해주세요.</p>
          <label>
            이름
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            이메일
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            전화번호
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </label>
          <div className="actions-right">
            <button type="submit" className="btn-primary">수정하기</button>
            <button type="button" className="btn-ghost" onClick={() => setView('info')}>취소</button>
          </div>
        </form>
      );
    }

    if (view === 'pwd') {
      if (isKakao) return <div className="mypage-center">카카오 계정은 비밀번호를 변경할 수 없습니다.</div>;

      return (
        <form className="mypage-edit" onSubmit={handlePasswordChange}>
          <h3>비밀번호 변경</h3>
          <label>
            현재 비밀번호
            <div className="input-with-toggle">
              <input 
                name="currentPassword"
                type={showOldPwd ? 'text' : 'password'} 
                placeholder="현재 비밀번호" 
                value={pwdForm.currentPassword}
                onChange={handleChangePwd}
              />
              <button type="button" className="toggle-btn" onClick={() => setShowOldPwd(s => !s)}>{showOldPwd ? '숨기기' : '보기'}</button>
            </div>
          </label>
          <label>
            새 비밀번호
            <div className="input-with-toggle">
              <input 
                name="newPassword"
                type={showNewPwd ? 'text' : 'password'} 
                placeholder="새 비밀번호" 
                value={pwdForm.newPassword}
                onChange={handleChangePwd}
              />
              <button type="button" className="toggle-btn" onClick={() => setShowNewPwd(s => !s)}>{showNewPwd ? '숨기기' : '보기'}</button>
            </div>
          </label>
          <label>
            새 비밀번호 확인
            <div className="input-with-toggle">
              <input 
                name="confirmPassword"
                type={showNewConfirm ? 'text' : 'password'} 
                placeholder="새 비밀번호 확인" 
                value={pwdForm.confirmPassword}
                onChange={handleChangePwd}
              />
              <button type="button" className="toggle-btn" onClick={() => setShowNewConfirm(s => !s)}>{showNewConfirm ? '숨기기' : '보기'}</button>
            </div>
          </label>
          <div className="actions-right">
            <button className="btn-primary" type="submit">변경하기</button>
            <button type="button" className="btn-ghost" onClick={() => setView('info')}>취소</button>
          </div>
        </form>
      );
    }

    if (view === 'delete') {
      return (
        <div className="mypage-delete">
          <h3>회원 탈퇴</h3>
          <p>정말로 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제됩니다.</p>
          
          {!isKakao ? (
              <label>
                현재 비밀번호 확인
                <input 
                    type="password" 
                    placeholder="비밀번호를 입력하세요" 
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                />
              </label>
          ) : (
              <div className="kakao-notice" style={{ padding: '20px 0', color: '#666', fontSize: '0.95rem' }}>
                  ※ 카카오 연동 계정은 비밀번호 입력 없이 즉시 탈퇴 처리됩니다.
              </div>
          )}

          <div className="actions-right">
            <button className="btn-danger" onClick={handleDelete}>삭제하기</button>
            <button type="button" className="btn-ghost" onClick={() => setView('info')}>취소</button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mypage-outer">
      <div className="mypage-container">
        <aside className="mypage-sidebar">
          <div className="avatar-wrap">
            <div className="avatar-circle" />
          </div>
          <nav className="side-nav">
            <button className={view === 'info' ? 'active' : ''} onClick={() => setView('info')}>내 정보</button>
            <button className={view === 'reservations' || view === 'reservation-detail' ? 'active' : ''} onClick={() => setView('reservations')}>예약 목록</button>
            <button className={view === 'posts' ? 'active' : ''} onClick={() => setView('posts')}>내가 쓴 글</button>
            
            {/* 카카오 유저가 아닐 때만 버튼 표시 */}
            {!isKakao && (
                <button className={view === 'pwd' ? 'active' : ''} onClick={() => setView('pwd')}>비밀번호 변경</button>
            )}
            
            <button className={view === 'delete' ? 'active' : ''} onClick={() => setView('delete')}>회원 탈퇴</button>
          </nav>
        </aside>

        <main className="mypage-main">
          <header className="main-header">
            <div className="title">마이페이지</div>
            <button className="btn-logout" onClick={handleLogout} style={{fontSize:'12px'}}>로그아웃</button>
          </header>

          <section className="main-content">{renderContent()}</section>

          <div className="content-bottom footer-contact">
             <div className="cb-left">
              <div className="icon-list">
                  <div className="icon-row"><img src={instaIcon} alt="instagram" className="footer-icon"/> <span>인스타그램</span></div>
                  <div className="icon-row"><img src={ytIcon} alt="youtube" className="footer-icon"/> <span>유튜브</span></div>
                  <div className="icon-row"><img src={mailIcon} alt="email" className="footer-icon"/> <span>이메일</span></div>
              </div>
            </div>
            <div className="cb-center contact-list">
              <div className="contact-line">instagram.com/nonsan.korea</div>
              <div className="contact-line">www.youtube.com/@Nonsan</div>
              <div className="contact-line">nonsan@nonsan.com</div>
            </div>
            <div className="cb-right empty-col" />
          </div>

          <div className="policy-links">
             <div className="pl-col pl-left"><a href="#">개인정보 취급 방침</a></div>
             <div className="pl-col pl-center"><a href="#">저작권 정책</a></div>
             <div className="pl-col pl-right"><a href="#">집단 이메일 수집 거부</a></div>
          </div>

          <div className="address-row">
            <div className="addr-left">32983) 충청남도 논산시 시민로 270</div>
            <div className="addr-center">TEL. 041-730-2973</div>
            <div className="addr-right">FAX. 041-732-3977</div>
          </div>

          <div className="container-copy">COPYRIGHT 2025 NONSAN CITY. ALL RIGHTS RESERVED</div>
        </main>
      </div>
    
      <ConfirmModal open={confirmOpen} onConfirm={() => handleConfirm(true)} onCancel={() => handleConfirm(false)} />
    </div>
  );
};

export default MyPage;