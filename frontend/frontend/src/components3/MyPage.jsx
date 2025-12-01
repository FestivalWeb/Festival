import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MyPage.css';
import instaIcon from '../assets/인스타그램.png';
import ytIcon from '../assets/유튜브.png';
import mailIcon from '../assets/이메일.png';
import Reservations from './Reservations';
import PostsList from './PostsList';
import ConfirmModal from './ConfirmModal';

const MyPage = ({ onLogout }) => {
  const { user, logout, updateUser } = useAuth();

  const navigate = useNavigate();

  const [view, setView] = useState('info');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showNewConfirm, setShowNewConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout && onLogout();
    navigate('/');
  };

  const openConfirm = (action) => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const handleConfirm = (ok) => {
    setConfirmOpen(false);
    if (!ok) return;
    if (confirmAction === 'pwd-cancel') {
      setView('reservations');
    }
    if (confirmAction === 'reservation-cancel') {
      setView('reservations');
      alert('예약이 취소되었습니다.');
      setSelectedReservation(null);
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

  const handleDelete = () => {
    if (window.confirm('정말 계정을 삭제하시겠습니까?')) {
      logout();
      alert('계정이 삭제되었습니다.');
      navigate('/');
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
              <div className="field"><input readOnly value={user.name || ''} placeholder="회원가입 할 때 적었던 이름" className="info-input" /></div>
            </div>
            <div className="info-row">
              <div className="label">이메일</div>
              <div className="field"><input readOnly value={user.email || ''} placeholder="회원가입 할 때 적었던 이메일" className="info-input" /></div>
            </div>
            <div className="info-row">
              <div className="label">전화번호</div>
              <div className="field"><input readOnly value={user.phone || ''} placeholder="회원가입 할 때 적었던 전화번호" className="info-input" /></div>
            </div>

            <div className="actions actions-right">
              <button className="btn-primary" onClick={() => setView('edit')}>수정하기</button>
            </div>
          </div>
        </div>
      );
    }

    if (view === 'reservations') {
        const mockReservations = [
          { id: 1, title: '부스/체험 이름', desc: '부스나 체험 활동에서 어떤 걸 활동하는지 간단하게 명시' },
          { id: 2, title: '부스/체험 이름', desc: '부스나 체험 활동에서 어떤 걸 활동하는지 간단하게 명시' },
          { id: 3, title: '부스/체험 이름', desc: '부스나 체험 활동에서 어떤 걸 활동하는지 간단하게 명시' }
        ];

        return (
          <Reservations
            reservations={mockReservations}
            onViewDetail={(r) => { setSelectedReservation(r); setView('reservation-detail'); }}
          />
        );
    }

    if (view === 'reservation-detail') {
        const r = selectedReservation || { title: '부스/체험 이름', desc: '부스나 체험 활동에서 어떤 걸 활동하는지 더 자세하게 명시' };
        return (
          <div className="reservation-detail">
            <h3>예약 상세 정보</h3>
            <div className="detail-card">
              <div className="detail-thumb" />
              <div className="detail-info">
                <div className="detail-title">{r.title}</div>
                <p>{r.desc}</p>
                <dl>
                  <dt>예약자 성함</dt><dd>홍길동</dd>
                  <dt>예약한 날짜</dt><dd>2025-11-10</dd>
                  <dt>연락처</dt><dd>010-0000-0000</dd>
                </dl>
              </div>
            </div>
            <div className="detail-actions">
              <button className="btn-ghost" onClick={() => openConfirm('reservation-cancel')}>취소하기</button>
              <button className="btn-primary" onClick={() => setView('reservations')}>목록으로</button>
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
            <input 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
            />
          </label>
          <label>
            이메일
            <input 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })} 
            />
          </label>
          <label>
            전화번호
            <input 
              value={form.phone} 
              onChange={e => setForm({ ...form, phone: e.target.value })} 
            />
          </label>
          <div className="actions-right">
            <button type="submit" className="btn-primary">수정하기</button>
            <button type="button" className="btn-ghost" onClick={() => setView('info')}>취소</button>
          </div>
        </form>
      );
    }

    if (view === 'pwd') {
      return (
        <form className="mypage-edit" onSubmit={(e) => { 
          e.preventDefault(); 
          alert('비밀번호가 변경되었습니다.'); 
          setView('info');
        }}>
          <h3>비밀번호 변경</h3>
          <label>
            현재 비밀번호
            <div className="input-with-toggle">
              <input type={showOldPwd ? 'text' : 'password'} placeholder="현재 비밀번호" />
              <button type="button" className="toggle-btn" onClick={() => setShowOldPwd(s => !s)} aria-label="현재 비밀번호 보기">{showOldPwd ? '숨기기' : '보기'}</button>
            </div>
          </label>
          <label>
            새 비밀번호
            <div className="input-with-toggle">
              <input type={showNewPwd ? 'text' : 'password'} placeholder="새 비밀번호" />
              <button type="button" className="toggle-btn" onClick={() => setShowNewPwd(s => !s)} aria-label="새 비밀번호 보기">{showNewPwd ? '숨기기' : '보기'}</button>
            </div>
          </label>
          <label>
            새 비밀번호 확인
            <div className="input-with-toggle">
              <input type={showNewConfirm ? 'text' : 'password'} placeholder="새 비밀번호 확인" />
              <button type="button" className="toggle-btn" onClick={() => setShowNewConfirm(s => !s)} aria-label="새 비밀번호 확인 보기">{showNewConfirm ? '숨기기' : '보기'}</button>
            </div>
          </label>
          <div className="actions-right">
            <button className="btn-primary" type="submit">변경하기</button>
            <button type="button" className="btn-ghost" onClick={() => openConfirm('pwd-cancel')}>다음에 하기</button>
          </div>
        </form>
      );
    }

    if (view === 'delete') {
      return (
        <div className="mypage-delete">
          <h3>회원 탈퇴</h3>
          <p>계정 삭제를 위해 비밀번호를 입력해주세요.</p>
          <label>
            현재 비밀번호
            <input type="password" placeholder="비밀번호" />
          </label>
          <div className="actions-right">
            <button className="btn-danger" onClick={handleDelete}>삭제하기</button>
            <button type="button" className="btn-ghost" onClick={() => setView('info')}>취소</button>
          </div>
        </div>
      );
    }

    if (view === 'posts') {
      const mockPosts = [
        { id: 1, title: '2024 논산딸기축제 제7회 논산딸기 행사', date: '2025-11-04' },
        { id: 2, title: '2024 논산딸기축제 제7회 논산딸기 행사', date: '2025-11-04' },
        { id: 3, title: '2024 논산딸기축제 제7회 논산딸기 행사', date: '2025-11-04' }
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
                  <td className="post-title">{p.title}</td>
                  <td>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="posts-actions">
            <div className="pager">&nbsp;|&nbsp; &lt; 1 &gt; &nbsp;|&nbsp;</div>
            <button className="btn-primary">목록</button>
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
            <button 
              className={view === 'info' ? 'active' : ''} 
              onClick={() => setView('info')}
            >
              내 정보
            </button>
            <button 
              className={view === 'reservations' ? 'active' : ''} 
              onClick={() => setView('reservations')}
            >
              예약 목록
            </button>
            <button 
              className={view === 'posts' ? 'active' : ''} 
              onClick={() => setView('posts')}
            >
              내가 쓴 글
            </button>
            <button 
              className={view === 'pwd' ? 'active' : ''} 
              onClick={() => setView('pwd')}
            >
              비밀번호 변경
            </button>
            <button 
              className={view === 'delete' ? 'active' : ''} 
              onClick={() => setView('delete')}
            >
              회원 탈퇴
            </button>
          </nav>
        </aside>

        <main className="mypage-main">
          <header className="main-header">
            <div className="title">마이페이지</div>
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
