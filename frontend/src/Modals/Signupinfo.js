import React, { useState } from 'react';
//import styles from './login.modules.css';
import { useCookies } from 'react-cookie'; // 수정된 임포트
import { useNavigate } from 'react-router-dom'; // 수정된 임포트
import { signUpRequest, emailCertificationRequest , checkCertificationRequest } from '../apis/index.js';




const SignUpinfoForm = ({ onSignUpForm }) => {
  const [userCertificationNumber, setUsercertificationNumber] = useState('');
  const [userName, setUsername] = useState('');
  const [userStudentnum, setUserstudentnum] = useState('');
  const [userPassword, setUserpassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userReenteredPassword, setUserReenteredPassword] = useState(''); // 비밀번호 재입력을 위한 새로운 상태
  const [isCertified, setIsCertified] = useState(false); // 이메일 인증 여부를 확인하는 상태 추가
  const [error, setError] = useState(false); // 에러 상태 추가
  const navigator = useNavigate();
  const [cookies, setCookie] = useCookies(['accessToken']); //데베에 있는 데이터 호출 시 사용 예정

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isCertified) {
      alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }
    onSignUpButtonClickHandler();
  };

  const onSignUpButtonClickHandler = () => {
    if (userPassword !== userReenteredPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    const requestBody = { email: userEmail, name: userName, studentNum: userStudentnum, password: userPassword };
    signUpRequest(requestBody).then(response => {
      if (response.code === 'SU') {
        navigator('/'); // 성공적인 가입 후 홈페이지나 대시보드로 이동
      } else {
        console.error('회원가입 실패:', response);
      }
    });
  };

  const onCheckCertificationHandler = (e) => {
    e.preventDefault();
    const requestBody = { email: userEmail, certificationNumber: userCertificationNumber };
    checkCertificationRequest(requestBody).then(response => {
      if (response.code === 'SU') {
        setIsCertified(true);
        alert('인증이 완료되었습니다.');
      } else {
        alert('인증번호가 잘못되었습니다.');
      }
    });
  };

  const onEmailCertificationHandler = (e) => {
    e.preventDefault();
    const requestBody = { email: userEmail };
    emailCertificationRequest(requestBody).then(response => {
      if (response.code === 'SU') {
        alert('인증번호가 전송되었습니다.');
      } else {
        alert('이메일 전송 실패');
      }
    });
  };

  const signUpResponse = (responseBody) => {
    if (!responseBody) { //예상하지못한 error를 처리 함수
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody; //정상 응답 또는 예상한 error 반환 함수
    //alert(code);
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    else if (code === 'SF' || code === 'VF') setError(true);
    else if (code !== 'SU') 
      return;
    navigator('/'); //리다이렉션 역할을 하며 로그인후 노출될 페이지의 경로를 지정해야함
  }
  // 폼 제출 핸들러

  const emailCertificationResponse= (responseBody) => { //이메일 인증
    if (!responseBody) { //예상하지못한 error를 처리 함수
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody; //정상 응답 또는 예상한 error 반환 함수
    //alert(code);
    if (code === 'DE') alert('이미 회원가입된 이메일 입니다');
    else if (code === 'MF') alert('이메일 전송 실패');
    else if (code === 'DBE') alert('데이터베이스 오류');
    else if (code === 'SF' || code === 'VF') setError(true);
    else if (code !== 'SU');
    else if(code === 'SU') alert('인증번호가 전송이 되었습니다.');
      return;
    navigator('/'); //리다이렉션 역할을 하며 로그인후 노출될 페이지의 경로를 지정해야함
  }
  // 폼 제출 핸들러

  const checkCertificationResponse= (responseBody) => { //이메일 인증
    if (!responseBody) { //예상하지못한 error를 처리 함수
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody; //정상 응답 또는 예상한 error 반환 함수
    //alert(code);
    if (code === 'DBE');
    else if (code === 'VF') alert('인증번호가 잘못되었음요.');
    else if (code !== 'SU');
    else if(code === 'SU') alert('인증이 완료 되었습니다.');
      return;
    navigator('/'); //리다이렉션 역할을 하며 로그인후 노출될 페이지의 경로를 지정해야함
  }
 
  
  return (
   
    <form onSubmit={handleSubmit}>
      <div className="loginFormContainer">

      
      <label htmlFor="user_email" ></label>
      <p>이메일 인증</p> 
      <div className="signUpContainer">
        <label htmlFor="user_email" ></label>
        <input
          type="text"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          placeholder="학교 이메일을 입력해주세요."

        />
        <button type="button"  className="SignupFormpost" onClick={onEmailCertificationHandler}>인증요청</button>
      </div>

      <div className="emailpost" >  
        <label htmlFor="password"></label>
        <input
          type="text"
          value={userCertificationNumber}
          onChange={e => setUsercertificationNumber(e.target.value)}
          placeholder="인증번호를 입력해주세요."
        />
        <button type="button"  className="SignupFormpost" onClick={onCheckCertificationHandler}>인증</button>
      </div>


      <p>이름</p>
        <input
          type="text"
          
          value={userName}
          onChange={e => setUsername(e.target.value)}
          placeholder="이름을 입력해주세요."

        />
        
      </div>

      <div className="passwordCss" >
      <p>학번</p>
        
        <input
          type="text"
          
          value={userStudentnum}
          onChange={e => setUserstudentnum(e.target.value)}
          placeholder="학번을 입력해주세요."
        />
      </div>

      <div className="passwordCss" >
      <p>비밀번호</p>
        <input
          type="password"
          value={userPassword}
          onChange={e => setUserpassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요."
        />
      </div>
      
      <div className="passwordCss" >
      <p>비밀번호 확인</p>
        <input
          type="password"
          value={userReenteredPassword}
          onChange={e => setUserReenteredPassword(e.target.value)}
          placeholder="비밀번호 재입력"
        />
        {userPassword && userReenteredPassword && userPassword !== userReenteredPassword && (
          <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>
        )}
      </div>

       
      <button type="submit"  className="signupButton" onClick={onSignUpButtonClickHandler}>회원가입 완료</button>
     
      
    </form>
  
  );
};


export default SignUpinfoForm;