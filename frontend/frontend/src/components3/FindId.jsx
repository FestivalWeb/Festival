import React, { useState } from 'react';
import './FindId.css';

const FindId = ({ onNavigate }) => {
  const [step, setStep] = useState(0); // 0: form, 1: success, 2: not found
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = () => {
    setError('');
    if (!form.name || !form.email) {
      setError('이름과 이메일을 입력해주세요.');
      return;
    }

    // Simulate API: if name or email contains "found" => success, else not found
    const isFound = (form.name + form.email).toLowerCase().includes('found');
    setTimeout(() => {
      if (isFound) {
        setStep(1);
      } else {
        setStep(2);
      }
    }, 500);
  };

  return (
    <div className="findid-wrapper">
      <div className="findid-container full-bleed">
        <div className="findid-card">
          <div className="findid-header"><h2>아이디 찾기</h2></div>

          {step === 0 && (
            <div className="findid-form-area">
              <div className="findid-form-card">
                <label>이름</label>
                <input className="findid-input" value={form.name} onChange={onChange('name')} placeholder="이름을 입력하세요" />
                <label>이메일 주소</label>
                <div style={{display:'flex', gap:8}}>
                  <input className="findid-input" value={form.email} onChange={onChange('email')} placeholder="이메일을 입력하세요" />
                  <button className="findid-small-btn" type="button">인증번호 발송</button>
                </div>
                <div className="error" style={{visibility: error ? 'visible' : 'hidden'}}>{error || '\u00A0'}</div>
              </div>
              <div className="actions-row">
                <button className="findid-btn" onClick={onSubmit}>다음</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="findid-result">
              <p>아이디 찾기가 완료 되었습니다.</p>
              <input className="findid-id" value={'123156456'} readOnly />
              <div className="actions-row">
                <button className="findid-btn" onClick={() => onNavigate && onNavigate('login')}>로그인</button>
                <button className="findid-btn-pink" onClick={() => onNavigate && onNavigate('forgotPassword')}>비밀번호 찾기</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="findid-notfound">
              <p>회원님의 아이디를 찾을 수 없습니다.<br/>회원가입을 해주세요.</p>
              <div className="actions-row">
                <button className="findid-btn" onClick={() => { setStep(0); setError(''); }}>다시 찾기</button>
                <button className="findid-btn-pink" onClick={() => onNavigate && onNavigate('home')}>홈으로 이동</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FindId;
