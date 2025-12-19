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

  // ▼▼▼ [핵심] 카카오 유저 판독 로직 (기존 유지) ▼▼▼
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
  
  // 예약 관련 state
  const [myReservations, setMyReservations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  // 비밀번호 변경/탈퇴용 state
  const [deletePassword, setDeletePassword] = useState("");
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showNewConfirm, setShowNewConfirm] = useState(false);

  // 비밀번호 변경 폼 데이터
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 내 정보 수정 폼 데이터
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // ▼▼▼ [추가] 내 게시글 목록 관리용 state ▼▼▼
  const [myPosts, setMyPosts] = useState([]);         // 게시글 목록
  const [postPage, setPostPage] = useState(1);        // 게시글 현재 페이지
  const [postTotalPages, setPostTotalPages] = useState(0); // 게시글 전체 페이지 수

  useEffect(() => {
    if (view !== 'delete') setDeletePassword(""); // 뷰 변경 시 탈퇴 비번 초기화
    if (view !== 'pwd') setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); // 비밀번호 폼 초기화

    // 1. 예약 목록 조회 (기존 로직)
    if (user && view === 'reservations') {
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

    // ▼▼▼ [추가] '내가 쓴 글' 탭 클릭 시 API 호출 ▼▼▼
    if (user && view === 'posts') {
      const userId = user.userId || user.id; // 유저 아이디 확보
      
      // type=USER, keyword=내아이디 로 검색하여 내가 쓴 글만 가져옴
      fetch(`/api/posts?page=${postPage - 1}&size=10&type=USER&keyword=${userId}`)
        .then(res => {
          if(!res.ok) throw new Error("게시글 조회 실패");
          return res.json();
        })
        .then(data => {
          // 1. 전체 게시글 수와 페이지 정보 가져오기
          const totalElements = data.totalElements; // 전체 글 개수
          const currentPage = data.number;          // 현재 페이지 (0부터 시작)
          const pageSize = data.size;               // 한 페이지당 개수 (보통 10개)

          // 2. 목록 변환 (번호 계산 로직 추가)
          const formatted = data.content.map((p, index) => ({
             // ▼▼▼ [핵심] 가짜 번호 계산 (전체 - 앞페이지개수 - 현재순서)
             id: totalElements - (currentPage * pageSize) - index,
             
             realId: p.postId, // [중요] 클릭해서 이동할 땐 진짜 ID가 필요하니 따로 저장!
             title: p.title,
             date: p.createDate ? p.createDate.split('T')[0] : ''
          }));

          setMyPosts(formatted);
          setPostTotalPages(data.totalPages);
        })
        .catch(err => console.error(err));
    }
  }, [user, view, currentPage, postPage]); // postPage 의존성 추가

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

  // 비밀번호 입력 핸들러
  const handleChangePwd = (e) => {
    const { name, value } = e.target;
    setPwdForm(prev => ({ ...prev, [name]: value }));
  };

  // 비밀번호 변경 API 호출
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (pwdForm.currentPassword === pwdForm.newPassword) {
        alert('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
        return;
    }

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const userId = user.userId || user.id;
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
        const msg = await res.text(); 
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

    if (!isKakao && !deletePassword) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    try {
        const userId = user.userId || user.id;
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

    // ▼▼▼ [수정] 내가 쓴 글 목록 (API 데이터 연동) ▼▼▼
    if (view === 'posts') {
      return (
        <div className="posts-list">
          <h3>내가 쓴 글 목록</h3>
          <table className="posts-table">
            <thead>
              <tr><th>글번호</th><th>제목</th><th>작성일</th></tr>
            </thead>
            <tbody>
              {/* API 데이터(myPosts)가 있을 때만 렌더링 */}
              {myPosts.length > 0 ? (
                myPosts.map(p => (
                  // [수정 1] 리액트 내부 성능을 위해 Key는 변하지 않는 '진짜 ID(realId)'를 권장합니다
                  <tr key={p.realId}>
                    
                    {/* 화면에 보이는 번호 (계산된 번호: 8, 7...) */}
                    <td>{p.id}</td>
                    
                    {/* 제목 클릭 시 해당 게시글 상세페이지로 이동 */}
                    <td 
                        className="post-title" 
                        style={{cursor:'pointer'}} 
                        
                        // ▼▼▼ [핵심 수정] 이동할 때는 반드시 '진짜 ID(realId)'를 써야 합니다! ▼▼▼
                        // p.id를 쓰면 "8번 글"을 찾으러 가서 에러가 나지만, 
                        // p.realId를 쓰면 "20번 글(진짜)"을 찾으러 갑니다.
                        onClick={() => navigate(`/post/${p.realId}`)}
                    >
                        {p.title}
                    </td>
                    <td>{p.date}</td>
                  </tr>
                ))
              ) : (
                // 데이터가 없을 때 메시지 표시
                <tr><td colSpan="3">작성한 게시글이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          
          {/* 페이지네이션 연동 */}
          <div className="posts-actions">
            {myPosts.length > 0 && (
               <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                 <Pagination 
                   totalPages={postTotalPages} 
                   currentPage={postPage}
                   onPageChange={(page) => setPostPage(page)} 
                 />
               </div>
            )}
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