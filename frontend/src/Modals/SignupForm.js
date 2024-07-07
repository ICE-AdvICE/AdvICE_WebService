import React, { useState,useEffect } from 'react';


const SignUpForm = ({ onSignUpForm }) => {
  const [user_email, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timer, setTimer] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUpForm(user_email, password);
  };

  const handleEmailVerification = (e) => {
    e.preventDefault();
    if (isTimerActive) {
      alert("60초 동안 인증 요청을 할 수 없습니다. 잠시 기다려 주세요.");
    } else {
      setIsTimerActive(true);
      onSignUpForm(user_email);  // 여기에서 이메일 전송 로직을 호출합니다.
      setTimer(60);  // 타이머를 초기화합니다.
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  useEffect(() => {
    if (timer === 0) {
      setIsTimerActive(false);
      setTimer(60);
    }
  }, [timer]);

  return (
    <div className="signUp">
    <form onSubmit={handleSubmit}>
      <div className="signUpContainer">
        <label htmlFor="user_email" ></label>
        <input
          type="text"
          id="user_email"
          value={user_email}
          onChange={e => setUseremail(e.target.value)}
          placeholder="학교 이메일을 입력해주세요."
        />
            <button 
            type="button"
            className="SignupFormpost"
            onClick={handleEmailVerification}
            disabled={isTimerActive}
          >
            인증요청
          </button>
          {isTimerActive && <div>{timer} 초 후에 다시 시도해주세요.</div>}
      </div>

      <div className="emailpost" >
      
        <label htmlFor="password"></label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="인증번호를 입력해주세요."
        />
        <button type="submit"  className="SignupFormpost">인증</button>
      </div>
     
      

        <button type="submit"  className="signupButton">다음단계</button>
      
    </form>
    </div>
  );
};


export default SignUpForm;