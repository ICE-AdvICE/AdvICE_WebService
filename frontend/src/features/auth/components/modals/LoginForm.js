import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
 
import FindpasswordForm from './findpassword.js';
import SignUpinfoForm from './Signupinfo.js';
import MyModal from '../../../../shared/components/BaseModal.js';
import './modules.css';
import { signInRequest } from '../../../../entities/api/UserApi.js';

const LoginForm = ({ onLogin }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserpassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false); // 체크박스 상태
  const [error, setError] = useState(false);
  const [modalOpenfind, setModalOpenfind] = useState(false);
  const [modalOpeninfo, setModalOpeninfo] = useState(false);
  const [cookies, setCookie] = useCookies(['accessToken']);
  const [modalOpenin, setModalOpenin] = useState(true);


  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
      setRememberEmail(true); // 체크박스 초기 상태 설정
    }
  }, []);

  const onSignInButtonClickHandler = (e) => {
    e.preventDefault();
    const requestBody = { email: userEmail, password: userPassword };
    signInRequest(requestBody)
      .then(response => {
        signInResponse(response);
        if (rememberEmail) {
          localStorage.setItem('userEmail', userEmail); // 체크박스가 선택된 경우에만 저장
        } else {
          localStorage.removeItem('userEmail'); // 체크박스가 선택되지 않은 경우 삭제
        }
      })
      .catch(error => {
        alert('로그인 요청 중 오류가 발생했습니다.');
        setError(true);
        onLogin(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'button') {
      onSignInButtonClickHandler(e);
    }
  };

  const handleFindpassword = (e) => {
    e.preventDefault();
    setModalOpenin(false);
    setModalOpenfind(true);
  };

  const handleSignupinfo = (e) => {
    e.preventDefault();
    setModalOpenin(false);
    setModalOpeninfo(true);
  };

  const signInResponse = (responseBody) => {
    if (!responseBody) {
      console.error('서버로부터 응답을 받지 못했습니다.');
      alert('네트워크 이상입니다.');
      setError(true);
      onLogin(false);
      return;
    }

    const { code, accessToken, refreshToken, expirationTime } = responseBody;

    if (code === 'SU' && accessToken && refreshToken && expirationTime) {
      const expires = new Date(Date.now() + expirationTime * 1000);
  
      
      setCookie('accessToken', accessToken, { expires, path: '/' });
  
      
      setCookie('refreshToken', refreshToken, { path: '/' });
  
      onLogin(true);
      window.location.reload();
    } else {
      setError(true);
      const messages = {
        DBE: '데이터베이스 오류입니다.',
        SF: '로그인 실패입니다. 이메일 또는 비밀번호를 확인해주세요.',
        VF: '로그인 실패입니다.',
      };
      alert(messages[code] || '네트워크 오류입니다.');
    }
  };

  const onSignUpSuccess = (success) => {
    if (success) {
      setModalOpeninfo(false);
    }
  };

  
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="loginHeaderContainer">
        <img src="header-name.png" alt="로그인 로고" className="responsiveLogo" />
      </div>
      <div className="loginFormContainer">
        <input
          type="text"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="학교 이메일을 입력해주세요."
        />
      </div>

      <div className="login_passwordCss">
        <input
          type="password"
          value={userPassword}
          onChange={e => setUserpassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="비밀번호를 입력해주세요."
        />
      </div>
      {error &&
        <div className='auth-sign-in-erro-box'>
          <div className='auth-sign-in-error-message'>
            {'이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.'}
          </div>
        </div>
      }
      <button className="findPasswordButton" onClick={handleFindpassword}>비밀번호 재설정</button>
      <div className="rememberMeCheckbox">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={e => setRememberEmail(e.target.checked)}
          />
          <label>아이디 기억하기</label>
        </div>
      <button type="submit" className="loginButton" onClick={onSignInButtonClickHandler}>로그인</button>
      <div className="signupPrompt">
        <p>아직 회원이 아니신가요?</p>
        <button className="signUpButton_Login" onClick={handleSignupinfo}>회원가입</button>
      </div>

      <MyModal
        open={modalOpenfind}
        width={500}
        header={[]}
        onCancel={e => setModalOpenfind(false)}
        footer={[]}
      >
        <FindpasswordForm onLogin={handleFindpassword} onClose={() => setModalOpenfind(false)} />
      </MyModal>

      <MyModal
        open={modalOpeninfo}
        onCancel={e => setModalOpeninfo(false)}
        header={[]}
        footer={[]}
      >
        <SignUpinfoForm onSignUpForm={onSignUpSuccess} />
      </MyModal>
    </form>
  );
};

export default LoginForm;