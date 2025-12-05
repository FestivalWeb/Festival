import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

// 회원가입은 PM 요구사항에 맞춰 다단계로 구현됨 (약관 -> 정보 -> 인증 -> 완료)
const Signup = () => {
  const [step, setStep] = useState(0);

  // 폼 상태
  const [agreeTerms, setAgreeTerms] = useState({ terms: false, privacy: false, marketing: false });
  const [form, setForm] = useState({ name: '', username: '', password: '', password2: '', email: '', code: '' });
  const [error, setError] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const nextFromTerms = () => {
    setError('');
    if (!agreeTerms.terms || !agreeTerms.privacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }
    setStep(1);
  };

  const validateInfo = () => {
    setError('');
    if (!form.name || !form.username || !form.email || !form.password || !form.password2) {
      setError('모든 필수 항목을 입력해주세요.');
      return false;
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }
    if (form.password !== form.password2) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(form.email)) {
      setError('유효한 이메일을 입력하세요.');
      return false;
    }
    return true;
  };

  const onRequestCode = () => {
    if (!validateInfo()) return;
    setError('');
    setSendingCode(true);
    // 인증번호 발송 API 호출을 시뮬레이션
    setTimeout(() => {
      setSendingCode(false);
      setCodeSent(true);
      setStep(2);
    }, 800);
  };

  const onVerifyCode = () => {
    if (!form.code) {
      setError('인증번호를 입력하세요.');
      return;
    }
    // 인증번호 검증을 시뮬레이션
    if (form.code === '123456') {
      setError('');
      setStep(3);
    } else {
      setError('인증번호가 올바르지 않습니다. (테스트 코드: 123456)');
    }
  };

  const onSignup = () => {
    if (!validateInfo()) return;
    // TODO: 실제 백엔드 호출로 교체 (POST /api/auth/signup)
    setError('');
    // 가짜 성공 처리
    setTimeout(() => setStep(4), 600);
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container full-bleed">
        <div className="signup-form-area">
          <button className="signup-back-btn" onClick={() => navigate('/login')}>
            ← 뒤로
          </button>

          <div className="signup-header">
            <h2>세계딸기축제</h2>
          </div>

          {step === 0 && (
            <div className="signup-step">
              <div className="terms-card">
                <label className="term-row"><input type="checkbox" checked={agreeTerms.terms} onChange={(e)=>setAgreeTerms({...agreeTerms, terms: e.target.checked})} /> <strong>필수</strong> 홈페이지 이용약관</label>
                <label className="term-row"><input type="checkbox" checked={agreeTerms.privacy} onChange={(e)=>setAgreeTerms({...agreeTerms, privacy: e.target.checked})} /> <strong>필수</strong> 개인정보 수집 및 이용</label>
                <label className="term-row"><input type="checkbox" checked={agreeTerms.marketing} onChange={(e)=>setAgreeTerms({...agreeTerms, marketing: e.target.checked})} /> 선택 이벤트·혜택 정보 수신</label>
              </div>
              <div className="actions-row">
                <button className="signup-btn-green" onClick={nextFromTerms}>다음</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="signup-step">
              <form className="signup-form" onSubmit={(e)=>e.preventDefault()}>
                <input value={form.name} onChange={onChange('name')} type="text" placeholder="이름" className="signup-input" />
                <div style={{display:'flex',gap:8}}>
                  <input value={form.username} onChange={onChange('username')} type="text" placeholder="아이디" className="signup-input" />
                  <button type="button" className="signup-small-btn">중복확인</button>
                </div>
                <input value={form.password} onChange={onChange('password')} type="password" placeholder="비밀번호" className="signup-input" />
                <input value={form.password2} onChange={onChange('password2')} type="password" placeholder="비밀번호 확인" className="signup-input" />
                <div style={{display:'flex',gap:8}}>
                  <input value={form.email} onChange={onChange('email')} type="email" placeholder="이메일" className="signup-input" />
                  <button type="button" className="signup-small-btn" onClick={onRequestCode} disabled={sendingCode}>{sendingCode? '보내는 중...' : '인증번호 발송'}</button>
                </div>

                <div className="error" style={{visibility: error? 'visible' : 'hidden'}}>{error || '\u00A0'}</div>

                <div className="actions-row">
                  <button className="signup-btn-green" onClick={() => setStep(0)}>이전</button>
                  <button className="signup-btn-green" onClick={onRequestCode}>다음</button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="signup-step">
              <div className="verify-card">
                <p>이메일로 발송된 인증번호를 입력하세요. (테스트 코드: 123456)</p>
                <input value={form.code} onChange={onChange('code')} type="text" placeholder="인증번호" className="signup-input" />
                <div className="actions-row">
                  <button className="signup-btn-green" onClick={() => setStep(1)}>이전</button>
                  <button className="signup-btn-green" onClick={onVerifyCode}>인증 확인</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="signup-step">
              <div className="complete-card">
                <p>회원가입 정보를 확인하세요.</p>
                <div className="summary-row">이름: <strong>{form.name}</strong></div>
                <div className="summary-row">아이디: <strong>{form.username}</strong></div>
                <div className="summary-row">이메일: <strong>{form.email}</strong></div>
                <div className="actions-row">
                  <button className="signup-btn-green" onClick={() => setStep(2)}>이전</button>
                  <button className="signup-btn-green" onClick={onSignup}>회원가입</button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="signup-step">
              <div className="done-card">
                <p>회원가입이 완료되었습니다.</p>
                <div className="actions-row">
                  <button className="signup-btn-green" onClick={() => navigate('/login')}>로그인</button>
                </div>
              </div>
            </div>
          )}

          <div className="signup-footer">
            이미 계정이 있으신가요?
            <button className="signup-login-link" onClick={() => navigate('/login')}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

