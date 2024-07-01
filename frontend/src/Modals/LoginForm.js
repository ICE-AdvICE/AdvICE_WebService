import React, { useState } from 'react';
import { useCookies } from 'react-cookie'; // 수정된 임포트
import { useNavigate } from 'react-router-dom'; // 수정된 임포트
import { signInRequest } from '../apis/index.js';
import FindpasswordForm from '../Modals/findpassword';
import SignUpForm from '../Modals/SignupForm';
import MyModal from '../MyModal';

const LoginForm = ({ onLogin, setIsLoggedIn, openFindPasswordModal, openSignUpModal, closeModal }) => {
  
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserpassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(false); // 에러 상태 추가
  const [modalOpenfind, setModalOpenfind] = useState(false);
  const [cookies, setCookie] = useCookies(['accessToken']); //데베에 있는 데이터 호출 시 사용 예정
  const navigator = useNavigate();

  // 로그인 버튼 클릭 핸들러
  const onSignInButtonClickHandler = (e) => {
    e.preventDefault(); // 페이지 리로드 방지
    const requestBody = { email: userEmail, password: userPassword };
    signInRequest(requestBody).then(signInResponse);

  }
  const handleFindpassword = (e) => {
    e.preventDefault(); // 폼 제출 방지 // 로그인 모달 닫기
    openFindPasswordModal();
  };
  const handleSignUp = (e) => {
    e.preventDefault(); // 폼 제출 방지 // 로그인 모달 닫기
    openSignUpModal();
  };

  // signInResponse 처리 함수
  const signInResponse = (responseBody) => {
    console.log(responseBody);
    const { code, token, expirationTime } = responseBody;
    if (!responseBody) { //예상하지못한 error를 처리 함수
      alert('네트워크 이상입니다.');
      return;
    }
     //정상 응답 또는 예상한 error 반환 함수
    //alert(code);
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    else if (code === 'SF' || code === 'VF') setError(true);
    else if (code !== 'SU') {
      alert('네트워크 오류입니다.');
      return;
    }
    else if(responseBody.code === 'SU') {
      console.log("로그인 성공, 상태 변경 중...");
      setIsLoggedIn(true);
      closeModal();
      navigator('/');
    }
      
   
    const now = new Date().getTime();                      //현재 시간
    const expires = new Date(now + expirationTime * 1000); //서버에서 설정한 시간(expirationTime)을 현재시간에 더하여 로그인만료 시각을 반환

    setCookie('accessToken', token, { expires, path: '/' }); //path로 이 쿠키가 유효한 페이지를 설정한다(현재 "/"로 모든 페이지 접근 허영)
    navigator('/'); //리다이렉션 역할을 하며 로그인후 노출될 페이지의 경로를 지정해야함

    closeModal(); // 부모 컴포넌트에서 모달을 닫는 함수로 설정
  }

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(userEmail, userPassword);

    
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginFormContainer">
        
       
        <input
          type="text"
          error={error}
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          placeholder="학교 이메일을 입력해주세요."
          
        />
      </div>

      <div className="passwordCss" >
        
        <input
          type="password"
          value={userPassword}
          error={error}
          onChange={e => setUserpassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      <button className="findPasswordButton" onClick={handleFindpassword}>비밀번호찾기</button>
      <button type="submit" className="loginButton" onClick={onSignInButtonClickHandler}>로그인</button>
      <div className="signupPrompt">
      <p>아직 회원이 아니신가요?</p>
      <button className="signUpButton_Login" onClick={handleSignUp}>회원가입</button>
    </div>

      {error && 
      <div className='auth-sign-in-erro-box'>
        <div className='auth-sign-in-error-message'>
          {'이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.'}
        </div>
      </div>
      }
     
      
     <MyModal //비밀번호 찾기
          open={modalOpenfind}
              width={500} //모달 넓이 이게 적당 한듯
              header={[
                <p>비밀번호 찾기</p>
                ]}
              onCancel={e => setModalOpenfind(false)} //x 버튼
              footer={[]}
          >
          <FindpasswordForm onLogin={handleFindpassword} />
        
    </MyModal>

    <MyModal //회원가입 모달
            open={modalOpen}
              width={500} //모달 넓이 이게 적당 한듯
             
              onCancel={e => setModalOpen(false)} //x 버튼
              header={[
                <div className="image-container" style={{ textAlign: 'center' }}>
                    <img src="/img/hufslogo.gif" alt="HUFS Logo" style={{ height: '50px', marginTop: '70px', display: 'block' }} />
                </div>
              ]}
                footer={[]}
          >
            <SignUpForm onLogin={handleSignUp} />
          </MyModal>
    </form>
  );
};

export default LoginForm;
