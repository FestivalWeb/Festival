import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const [agreeTerms, setAgreeTerms] = useState({ terms: false, privacy: false, marketing: false });
  const [form, setForm] = useState({ name: '', username: '', password: '', password2: '', email: '', code: '' });
  
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '', password2: '', email: '' });
  
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  
  const [sendingCode, setSendingCode] = useState(false);

  const onChange = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (k === 'username') {
      setIsIdChecked(false);
      setIdCheckMessage('');
      setIsIdAvailable(false);
      setFieldErrors(prev => ({ ...prev, username: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let msg = '';

    if (name === 'email') {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!value) msg = '이메일을 입력해주세요.';
      else if (!emailRegex.test(value)) msg = '올바른 이메일 형식이 아닙니다.';
    } 
    else if (name === 'password') {
        // [수정] 비밀번호 유효성 검사 강화 (영문, 숫자, 특수문자 포함 8자 이상)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        
        if (value.length < 8) {
            msg = '비밀번호는 8자 이상이어야 합니다.';
        } else if (!passwordRegex.test(value)) {
            msg = '영문, 숫자, 특수문자를 모두 포함해야 합니다.';
        }
    } 
    else if (name === 'password2') {
        if (value !== form.password) msg = '비밀번호가 일치하지 않습니다.';
    }

    if (name !== 'username') {
        setFieldErrors(prev => ({ ...prev, [name]: msg }));
    }
  };

  const handleIdCheck = async () => {
    if (!form.username) {
      setFieldErrors(prev => ({ ...prev, username: '아이디를 입력해주세요.' }));
      return;
    }

    const idRegex = /^[A-Za-z0-9]{8,30}$/; 
    if (!idRegex.test(form.username)) {
        setFieldErrors(prev => ({ ...prev, username: '아이디는 영문/숫자 포함 8~30자여야 합니다.' }));
        setIdCheckMessage('');
        return;
    }

    try {
      const response = await fetch(`/api/users/check-id?userId=${form.username}`, {
        method: 'GET',
      });

      if (response.ok) { 
        const msg = await response.text(); 
        setIdCheckMessage(msg);
        setIsIdAvailable(true);
        setIsIdChecked(true);
        setFieldErrors(prev => ({ ...prev, username: '' }));
      } else {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        setIsIdAvailable(false);
        setIsIdChecked(false);
        setFieldErrors(prev => ({ ...prev, username: '' }));
      }
    } catch (err) {
      console.error(err);
      setIdCheckMessage('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const nextFromTerms = () => {
    setGlobalError('');
    if (!agreeTerms.terms || !agreeTerms.privacy) {
      setGlobalError('필수 약관에 동의해주세요.');
      return;
    }
    setStep(1);
  };

  const onRequestCode = async () => {
    setGlobalError('');
    if (!form.name || !form.username || !form.email || !form.password || !form.password2) {
      setGlobalError('모든 필수 항목을 입력해주세요.');
      return;
    }
    if (fieldErrors.username) {
        setGlobalError('아이디를 확인해주세요.');
        return;
    }
    if (!isIdChecked) {
      setGlobalError('아이디 중복 확인을 해주세요.');
      return;
    }
    
    if (fieldErrors.email || fieldErrors.password || fieldErrors.password2) {
      setGlobalError('입력 정보를 다시 확인해주세요.');
      return;
    }

    setSendingCode(true);
    try {
      const response = await fetch('/api/users/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      if (response.ok) {
        setSendingCode(false);
        setStep(2);
        alert("인증번호가 발송되었습니다.\n메일이 오지 않는다면 이메일 주소를 확인해주세요.");
      } else {
        const errMsg = await response.text();
        setGlobalError(errMsg || "인증번호 발송 실패");
        setSendingCode(false);
      }
    } catch (err) {
      setGlobalError("서버 통신 오류");
      setSendingCode(false);
    }
  };

  const onVerifyCode = async () => {
    setGlobalError('');
    if (!form.code) {
      setGlobalError('인증번호를 입력하세요.');
      return;
    }
    try {
      const response = await fetch('/api/users/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: form.code }),
      });
      if (response.ok) setStep(3);
      else {
        const errMsg = await response.text();
        setGlobalError(errMsg || "인증번호가 일치하지 않습니다.");
      }
    } catch (err) {
      setGlobalError("서버 통신 오류");
    }
  };

  const onSignup = async () => {
    const signupData = {
      name: form.name,
      userId: form.username,
      password: form.password,
      email: form.email,
      sex: "None",
      nationality: "Korea",
      termsOfServiceAgreed: agreeTerms.terms,
      privacyPolicyAgreed: agreeTerms.privacy,
      marketingOptIn: agreeTerms.marketing
    };

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        setStep(4);
      } else {
        const errorData = await response.json();
        
        if (errorData.password) {
            setStep(1); 
            setFieldErrors(prev => ({
                ...prev,
                password: errorData.password
            }));
            alert("입력하신 비밀번호 형식이 올바르지 않습니다.\n다시 확인해주세요.");
        } else {
            let msg = errorData.message || "회원가입 실패";
            setGlobalError(msg);
        }
      }
    } catch (err) {
      setGlobalError("서버 통신 오류가 발생했습니다.");
    }
  };

  const errorStyle = {
    fontSize: '12px', 
    color: '#ff4d4f', 
    marginTop: '4px',    
    marginBottom: '8px', 
    paddingLeft: '4px',
    textAlign: 'left'
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container full-bleed">
        <div className="signup-form-area">
          <button type="button" className="signup-back-btn" onClick={() => navigate('/login')}>← 뒤로</button>
          <div className="signup-header"><h2>세계딸기축제</h2></div>

          {step === 0 && (
            <div className="signup-step">
              <div className="terms-card">
                <label className="term-row"><input type="checkbox" checked={agreeTerms.terms} onChange={(e)=>setAgreeTerms({...agreeTerms, terms: e.target.checked})} /> <strong>필수</strong> 홈페이지 이용약관</label>
                <label className="term-row"><input type="checkbox" checked={agreeTerms.privacy} onChange={(e)=>setAgreeTerms({...agreeTerms, privacy: e.target.checked})} /> <strong>필수</strong> 개인정보 수집 및 이용</label>
                <label className="term-row"><input type="checkbox" checked={agreeTerms.marketing} onChange={(e)=>setAgreeTerms({...agreeTerms, marketing: e.target.checked})} /> 선택 이벤트·혜택 정보 수신</label>
              </div>
              <div className="error" style={{visibility: globalError ? 'visible' : 'hidden', textAlign:'center', marginTop:'10px'}}>{globalError || '\u00A0'}</div>
              <div className="actions-row">
                <button type="button" className="signup-btn-green" onClick={nextFromTerms}>다음</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="signup-step">
              <form className="signup-form" onSubmit={(e)=>e.preventDefault()}>
                
                <input value={form.name} onChange={onChange('name')} type="text" placeholder="이름" className="signup-input" />

                <div style={{display:'flex', gap:8}}>
                  <input name="username" value={form.username} onChange={onChange('username')} onBlur={handleBlur} type="text" placeholder="아이디" className="signup-input" />
                  <button type="button" className="signup-small-btn" onClick={handleIdCheck}>중복확인</button>
                </div>
                {fieldErrors.username && <div style={errorStyle}>{fieldErrors.username}</div>}
                {!fieldErrors.username && idCheckMessage && (
                  <div style={{...errorStyle, color: isIdAvailable ? 'green' : 'red'}}>
                    {idCheckMessage}
                  </div>
                )}

                <input name="password" value={form.password} onChange={onChange('password')} onBlur={handleBlur} type="password" placeholder="비밀번호" className="signup-input" />
                {fieldErrors.password && <div style={errorStyle}>{fieldErrors.password}</div>}

                <input name="password2" value={form.password2} onChange={onChange('password2')} onBlur={handleBlur} type="password" placeholder="비밀번호 확인" className="signup-input" />
                {fieldErrors.password2 && <div style={errorStyle}>{fieldErrors.password2}</div>}

                <div style={{display:'flex', gap:8}}>
                  <input name="email" value={form.email} onChange={onChange('email')} onBlur={handleBlur} type="email" placeholder="이메일" className="signup-input" />
                  <button type="button" className="signup-small-btn" onClick={onRequestCode} disabled={sendingCode}>
                    {sendingCode ? '전송 중...' : '인증번호 발송'}
                  </button>
                </div>
                {fieldErrors.email && <div style={errorStyle}>{fieldErrors.email}</div>}

                <div className="error" style={{visibility: globalError ? 'visible' : 'hidden', textAlign:'center'}}>{globalError || '\u00A0'}</div>

                <div className="actions-row">
                  <button type="button" className="signup-btn-green" onClick={() => setStep(0)}>이전</button>
                  <button type="button" className="signup-btn-green" onClick={onRequestCode}>다음</button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="signup-step">
              <div className="verify-card">
                <p>이메일로 발송된 인증번호를 입력하세요.</p>
                <input value={form.code} onChange={onChange('code')} type="text" placeholder="인증번호" className="signup-input" />
              
                <div className="actions-row">
                  <button type="button" className="signup-btn-green" onClick={() => { setStep(1); setGlobalError(''); }}>이전</button>
                  <button type="button" className="signup-btn-green" onClick={onVerifyCode}>인증 확인</button>
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
                  <button type="button" className="signup-btn-green" onClick={() => setStep(2)}>이전</button>
                  <button type="button" className="signup-btn-green" onClick={onSignup}>회원가입</button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="signup-step">
              <div className="done-card">
                <p>회원가입이 완료되었습니다.</p>
                <div className="actions-row">
                  <button type="button" className="signup-btn-green" onClick={() => navigate('/login')}>로그인</button>
                </div>
              </div>
            </div>
          )}

          <div className="signup-footer">
            이미 계정이 있으신가요? <button type="button" className="signup-login-link" onClick={() => navigate('/login')}>로그인</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;