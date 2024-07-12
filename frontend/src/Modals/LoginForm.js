import React, { useState } from 'react';
import { useCookies } from 'react-cookie'; // 수정된 임포트
import { useNavigate } from 'react-router-dom'; // 수정된 임포트
import { signInRequest } from '../apis/index.js';
import FindpasswordForm from '../Modals/findpassword';
import SignUpinfoForm from '../Modals/Signupinfo';
import MyModal from '../MyModal';
import './modules.css';


const LoginForm = ({ onLogin})=> {
  
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserpassword] = useState('');
  const [error, setError] = useState(false); // 에러 상태 추가
  const [modalOpenfind, setModalOpenfind] = useState(false);
  const [modalOpeninfo, setModalOpeninfo] = useState(false);
  const [cookies, setCookie] = useCookies(['accessToken']); //데베에 있는 데이터 호출 시 사용 예정
  const [modalOpenin, setModalOpenin] = useState(true); // 로그인 모달 상태
  const navigator = useNavigate();

  // 로그인 버튼 클릭 핸들러
  const onSignInButtonClickHandler = (e) => {
    e.preventDefault();
    const requestBody = { email: userEmail, password: userPassword };
    signInRequest(requestBody).then(signInResponse).catch(error => {
      console.error('Request failed', error);
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
    e.preventDefault(); // 폼 제출 방지 // 로그인 모달 닫기
    setModalOpenin(false); // 로그인 모달 닫기
    setModalOpenfind(true); // 회원가입 정보 모달 열기
  };
  


  const handleSignupinfo = (e) => {
    e.preventDefault(); // 폼 제출 방지 // 로그인 모달 닫기
    setModalOpenin(false); // 로그인 모달 닫기
    setModalOpeninfo(true); // 회원가입 정보 모달 열기
    
  };


  const signInResponse = (responseBody) => {
    // 서버로부터 응답이 없거나 예상치 못한 응답일 경우
    if (!responseBody) {
      console.error('서버로부터 응답을 받지 못했습니다.');
      alert('네트워크 이상입니다.');
      setError(false);  // 에러 상태를 false로 설정하여 메시지를 숨김
      return;
    }
  
    console.log(responseBody);
    const { code, token, expirationTime } = responseBody;
  
    // 로그인 과정 중 발생할 수 있는 다양한 경우를 처리
    if (code === 'DBE') {
      alert('데이터베이스 오류입니다.');
      setError(false);  // DBE는 서버 측 에러로, 입력 에러가 아니므로 false
    } else if (code === 'SF' || code === 'VF') {
      setError(true);  // SF (Security Failure) 또는 VF (Validation Failure) 발생 시 true
    } else if (code !== 'SU') {
      alert('네트워크 오류입니다.');
      setError(false);  // 네트워크 오류도 입력 에러가 아님
    } else if (code === 'SU') {
      if (token && expirationTime) {
        const now = new Date().getTime();
        const expires = new Date(now + expirationTime * 1000);
        setCookie('accessToken', token, { expires, path: '/' });
        navigator('/');  // 로그인 후 리다이렉트
        onLogin(true);  // 로그인 성공 상태를 NavBar로 전달하여 모달 닫기
      } else {
          console.error('토큰 또는 만료 시간이 제공되지 않았습니다.');
          setError(false);
      }
    } else {
        // 에러 핸들링
        alert('로그인 오류입니다. 다시 시도해 주세요.');
        setError(true);
        onLogin(false);  // 로그인 실패 상태를 전달
    } // 성공 시 에러 상태 초기화
   
  
    // 토큰과 만료 시간을 받았는지 확인
    if (token && expirationTime) {
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);
      setCookie('accessToken', token, { expires, path: '/' });
      navigator('/');  // 로그인 후 리다이렉트
    } else if (code === 'SU') {
      console.error('토큰 또는 만료 시간이 제공되지 않았습니다.');
      setError(false);  // 토큰이 없는 경우 에러 상태를 true로 설정
    }
  }
  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(userEmail, userPassword);

    
  };

  const onSignUpSuccess = (success) => {
    if (success) {
      setModalOpeninfo(false); // 회원가입 성공 시 모달 닫기
    }
  };

  return (
  
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="loginHeaderContainer">
        <img src="header-name.png" alt="로그인 로고" style={{ width: '220px', height: 'auto' }} />
      </div>
      <div className="loginFormContainer">
        <input
          type="text"
          error={error}
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="학교 이메일을 입력해주세요."
        />
      </div>

      <div className="login_passwordCss" >
        <input
          type="password"
          value={userPassword}
          error={error}
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
      <button type="submit" className="loginButton" onClick={onSignInButtonClickHandler}>로그인</button>
      <div className="signupPrompt">
      <p>아직 회원이 아니신가요?</p>
      <button className="signUpButton_Login" onClick={handleSignupinfo}>회원가입</button>
    </div>


 
      
     <MyModal //비밀번호 찾기
          open={modalOpenfind}
              width={500} //모달 넓이 이게 적당 한듯
              header={[]}
              onCancel={e => setModalOpenfind(false)} //x 버튼
              footer={[]}
          >
          <FindpasswordForm onLogin={handleFindpassword} onClose={() => setModalOpenfind(false)}/>
        
    </MyModal>

    <MyModal
      open={modalOpeninfo}
      
      onCancel={e => setModalOpeninfo(false)} 
      
      header={[]}
      footer={[]}
      >
      <SignUpinfoForm onSignUpForm={onSignUpSuccess} />
    </MyModal></form>
    
  );
};

export default LoginForm;
