import React, { useState } from 'react';
import './MyPage.css';

const MyPage = ({ onNavigate, onLogout }) => {
  const usr = sessionStorage.getItem('user');
  const user = usr ? JSON.parse(usr) : null;

  const [view, setView] = useState('info');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    onLogout && onLogout();
    onNavigate && onNavigate('home');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...(user || {}), ...form };
    sessionStorage.setItem('user', JSON.stringify(updated));
    alert('정보가 저장되었습니다.');
    setView('info');
  };

  const handleDelete = () => {
    if (window.confirm('정말 계정을 삭제하시겠습니까?')) {
      sessionStorage.removeItem('user');
      alert('계정이 삭제되었습니다.');
      onNavigate && onNavigate('home');
    }
  };

  const renderContent = () => {
    if (!user) return <div className="mypage-center">로그인 후 이용해주세요.</div>;

    if (view === 'info') {
      return (
        <div className="mypage-info">
          <h3>내 정보</h3>
          <p className="hint">원하는 정보를 수정할 수 있습니다.</p>

          <div className="info-row">
            <span className="label">이름</span>
            <span className="value">{user.name || '-'}</span>
          </div>
          <div className="info-row">
            <span className="label">이메일</span>
            <span className="value">{user.email || '-'}</span>
          </div>
          <div className="info-row">
            <span className="label">전화번호</span>
            <span className="value">{user.phone || '-'}</span>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={() => setView('edit')}>수정하기</button>
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
          <div className="actions">
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
            <input type="password" placeholder="현재 비밀번호" />
          </label>
          <label>
            새 비밀번호
            <input type="password" placeholder="새 비밀번호" />
          </label>
          <label>
            새 비밀번호 확인
            <input type="password" placeholder="새 비밀번호 확인" />
          </label>
          <div className="actions">
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
          <p>계정 삭제를 위해 비밀번호를 입력해주세요.</p>
          <label>
            현재 비밀번호
            <input type="password" placeholder="비밀번호" />
          </label>
          <div className="actions">
            <button className="btn-danger" onClick={handleDelete}>삭제하기</button>
            <button type="button" className="btn-ghost" onClick={() => setView('info')}>취소</button>
          </div>
        </div>
      );
    }

    if (view === 'reservations') return (
      <div className="placeholder">
        <h3>예약 목록</h3>
        <p>예약 목록은 준비 중입니다.</p>
      </div>
    );
    
    if (view === 'posts') return (
      <div className="placeholder">
        <h3>내가 쓴 글</h3>
        <p>내가 쓴 글 목록은 준비 중입니다.</p>
      </div>
    );

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
          <div className="side-footer">
            <div className="socials">INSTAGRAM • YOUTUBE • EMAIL</div>
          </div>
        </aside>

        <main className="mypage-main">
          <header className="main-header">
            <div className="title">마이페이지</div>
            <div className="main-actions">
              <button className="btn-logout" onClick={handleLogout}>로그아웃</button>
            </div>
          </header>

          <section className="main-content">{renderContent()}</section>

          <div className="content-bottom">
            <div className="cb-left">
              <div className="avatar-small" />
              <div className="cb-links">
                <div>인스타그램</div>
                <div>유튜브</div>
                <div>이메일</div>
              </div>
            </div>

            <div className="cb-center">
              <div>instagram.com/nonsan.korea</div>
              <div>www.youtube.com/@Nonsan</div>
              <div>nonsan@nonsan.com</div>
            </div>

            <div className="cb-right">
              <a href="#">개인정보 취급 방침</a>
              <a href="#">저작권 정책</a>
              <a href="#">집단 이메일 수집 거부</a>
            </div>
          </div>

          <div className="container-copy">COPYRIGHT 2025 NONSAN CITY. ALL RIGHTS RESERVED</div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
