import React, { useState } from 'react';
import './FindId.css';
import './ForgotPassword.css';

const ForgotPassword = ({ onNavigate }) => {
  const [step, setStep] = useState(0); // 0: form, 1: reset form, 2: success, 3: not found
  const [form, setForm] = useState({ name: '', username: '', email: '', code: '', password: '', password2: '' });
  const [error, setError] = useState('');

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmitFind = () => {
    setError('');
    if (!form.name || !form.username || !form.email) {
      setError('이름, 아이디, 이메일을 모두 입력하세요.');
      return;
    }
    // Simulate API: if any field contains 'found' then treat as existing
    const isFound = (form.name + form.username + form.email).toLowerCase().includes('found');
    setTimeout(() => {
      if (isFound) {
        setStep(1);
      } else {
        setStep(3);
      }
    }, 400);
  };

  const onReset = () => {
    setError('');
    if (!form.password || !form.password2) {
      setError('새 비밀번호를 입력하세요.');
      return;
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.password2) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    // Simulate API success
    setTimeout(() => setStep(2), 400);
  };

  return (
    <div className="findid-wrapper no-bottom">
      <div className="findid-container full-bleed">
        <div className="findid-card">
          <div className="findid-header"><h2>비밀번호 찾기</h2></div>

          {step === 0 && (
            <div className="findid-form-area">
              <div className="findid-form-card">
                <label>이름</label>
                <input className="findid-input" value={form.name} onChange={onChange('name')} placeholder="이름" />
                <label>아이디</label>
                <input className="findid-input" value={form.username} onChange={onChange('username')} placeholder="아이디" />
                <label>이메일 주소</label>
                <div style={{display:'flex', gap:8}}>
                  <input className="findid-input" value={form.email} onChange={onChange('email')} placeholder="이메일" />
                  <button className="findid-small-btn" type="button">인증번호 발송</button>
                </div>
                <div className="error" style={{visibility: error ? 'visible' : 'hidden'}}>{error || '\u00A0'}</div>
              </div>
              <div className="actions-row">
                <button className="findid-btn" onClick={onSubmitFind}>다음</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="findid-form-area">
              <div className="verify-card">
                <p>새 비밀번호를 입력하세요.</p>
                <input className="findid-input" value={form.password} onChange={onChange('password')} type="password" placeholder="새 비밀번호(8자 이상)" />
                <input className="findid-input" value={form.password2} onChange={onChange('password2')} type="password" placeholder="새 비밀번호 확인" />
                <div className="error" style={{visibility: error ? 'visible' : 'hidden'}}>{error || '\u00A0'}</div>
                <div className="actions-row">
                  <button className="findid-btn" onClick={() => setStep(0)}>이전</button>
                  <button className="findid-btn" onClick={onReset}>비밀번호 변경</button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="findid-result">
              <p>비밀번호가 성공적으로 변경 되었습니다.</p>
              <div className="actions-row">
                <button className="findid-btn" onClick={() => onNavigate && onNavigate('login')}>로그인 하기</button>
                <button className="findid-btn-pink" onClick={() => onNavigate && onNavigate('home')}>홈으로 이동</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="findid-notfound">
              <p>회원님의 아이디를 찾을 수 없습니다.<br/>회원가입을 해주세요.</p>
              <div className="actions-row">
                <button className="findid-btn" onClick={() => { setStep(0); setError(''); }}>다시 찾기</button>
                <button className="findid-btn-pink" onClick={() => onNavigate && onNavigate('signup')}>회원가입</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
