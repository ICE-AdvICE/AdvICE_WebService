import React, { useState,useEffect } from 'react';
import './modules.css';
import { useCookies } from 'react-cookie'; // 수정된 임포트
import { useNavigate } from 'react-router-dom'; // 수정된 임포트
import { signUpRequest, emailCertificationRequest , checkCertificationRequest } from '../apis/index.js';




const SignUpinfoForm = ({closeModal}) => {
  const [userCertificationNumber, setUsercertificationNumber] = useState('');
  const [userName, setUsername] = useState('');
  const [userStudentnum, setUserstudentnum] = useState('');
  const [userPassword, setUserpassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userReenteredPassword, setUserReenteredPassword] = useState(''); // 비밀번호 재입력을 위한 새로운 상태
  const [isCertified, setIsCertified] = useState(false); // 이메일 인증 여부를 확인하는 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState(false); // 에러 상태 추가
  const navigator = useNavigate();
  const [cookies, setCookie] = useCookies(['accessToken']); //데베에 있는 데이터 호출 시 사용 예정
  const [emailRegistered, setEmailRegistered] = useState(false);


  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (buttonDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            clearInterval(timer);
            setButtonDisabled(false);
            return 60;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [buttonDisabled]);


  
 

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onSignUpButtonClickHandler = () => {
    if (userPassword !== userReenteredPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isCertified) {
      alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    if (userStudentnum.length < 5) {
      alert('학번을 다시 입력해주세요.');
      return;
    }


    const requestBody = { email: userEmail, name: userName, studentNum: userStudentnum, password: userPassword };
    signUpRequest(requestBody)
      .then(response => signUpResponse(response))
  };

  const onCheckCertificationHandler = (e) => {
    e.preventDefault();
    const requestBody = { email: userEmail, certificationNumber: userCertificationNumber };
    checkCertificationRequest(requestBody)
      .then(response => checkCertificationResponse(response))
      .catch(error => {
        console.error('인증 확인 요청 중 오류 발생:', error);
        alert('네트워크 이상입니다.');
      });
  };

  const onEmailCertificationHandler = (e) => {
    e.preventDefault();
    if (!buttonDisabled) {
      setButtonDisabled(true);
      const requestBody = { email: userEmail };
      emailCertificationRequest(requestBody)
        .then(response => emailCertificationResponse(response))
        .catch(error => {
          console.error('이메일 인증 요청 중 오류 발생:', error);
          alert('네트워크 이상입니다.');
          setButtonDisabled(false);
          setCountdown(60);
        });
    }
  };

const signUpResponse = (responseBody) => {
  if (!responseBody) {
    alert('네트워크 이상입니다.');
    return;
  }
  const { code } = responseBody;

  switch (code) {
    case 'SU':
      alert('회원가입이 성공적으로 완료되었습니다.');
      navigator('/');  // 로그인 후 리다이렉트
      closeModal();
       // 모달 창 닫기
       // 성공적으로 회원가입을 완료했다는 상태 업데이트를 부모에 전달
      break; // 함수 종료를 확실하게 함
    case 'DBE':
      alert('데이터베이스 오류입니다.');
      break;
    case 'SF':
    case 'VF':
      setError(true);
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      break;
    default:
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      break;
  }
};
    

  const emailCertificationResponse= (responseBody) => { //이메일 인증
    if (!responseBody) { //예상하지못한 error를 처리 함수
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody; //정상 응답 또는 예상한 error 반환 함수
    //alert(code);
    if (code === 'DE') alert('이미 회원가입된 이메일 입니다');
    else if (code === 'MF') alert('이메일 전송 실패');
    else if (code === 'DBE') alert('데이터베이스 오류임');
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
    else if(code === 'SU') {
      setIsCertified(true); 
      alert('인증이 완료 되었습니다.');
    }
      return;
    navigator('/'); //리다이렉션 역할을 하며 로그인후 노출될 페이지의 경로를 지정해야함
  }

  
  return (
   
    <form onSubmit={handleSubmit}>
     <div className="signupHeaderContainer">
     <img src="header-name.png" alt="로그인 로고" style={{ width: '220px', height: 'auto' }} />
    </div>

     
      <label htmlFor="user_email" ></label>
      <p>이메일 인증</p> 

      <div className="signUpContainer">
        <label htmlFor="user_email" ></label>
        <input
          type="text"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          placeholder="학교 이메일"
        />
        <span className="emailDomain">@hufs.ac.kr</span>
        <button type="button"  className="SignupFormpost" onClick={onEmailCertificationHandler}>인증요청</button>
      </div>
      {buttonDisabled && <span className="countdown-timer">{countdown}초 후에 다시 시도 가능합니다.</span>}

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


      
      <div className="signup_name" >
      <p>이름</p>
        <input
          
          value={userName}
          onChange={e => setUsername(e.target.value)}
          placeholder=" 이름을 입력해주세요."
        />
        </div>
        
      <div className="signup_pw" >
      <p>학번</p>
        <input
          
          value={userStudentnum}
          onChange={e => setUserstudentnum(e.target.value)}
          placeholder=" 학번을 입력해주세요. (ex.2020XXXXX)"
          minLength={6} 
        />
      </div>

      <div className="signup_pw" >
      <p>비밀번호</p>
        <input
          type="password"
          value={userPassword}
          onChange={e => setUserpassword(e.target.value)}
          placeholder=" 비밀번호는 8자 이상 20자 미만이어야합니다."
        />
      </div>
      
      <div className="signup_pw" >
      <p>비밀번호 확인</p>
        <input
          type="password"
          value={userReenteredPassword}
          onChange={e => setUserReenteredPassword(e.target.value)}
          placeholder=" 비밀번호 재입력"
        />
        {userPassword && userReenteredPassword && userPassword !== userReenteredPassword && (
          <div className="pw-mismatch-error" style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>
        )}
      </div>
      <button type="submit"  className="signupButton" onClick={onSignUpButtonClickHandler}>회원가입 완료</button>
    </form>
  
  );
};


export default SignUpinfoForm;