import React, { useState } from 'react';
//import {SignInRequestDto} from '../apis/request/auth/sign-in.request.dto.js';
import { signInRequest } from '../apis/index.js';
//import {SignInResponseDto} from '../apis/response/auth/sign-in.response.js'
//import {ResponseDto} from '../apis/response/response.dto.js'
import { useCookies } from 'react-cookie'; // 수정된 임포트
import { useNavigate } from 'react-router-dom'; // 수정된 임포트

import MyModal from '../MyModal';

const LoginForm = ({ onLogin }) => {
  const [user_email, setUserEmail] = useState('');
  const [user_password, setUserpassword] = useState('');

  const [error, setError] = useState(false); // 에러 상태 추가
  const [modalOpenfind, setModalOpenfind] = useState(false);
  const [cookies, setCookie] = useCookies(['accessToken']);
  const navigator = useNavigate();

  // 로그인 버튼 클릭 핸들러
  const onSignInButtonClickHandler = (e) => {
    e.preventDefault(); // 페이지 리로드 방지
    const requestBody = { email: user_email, password: user_password };
    
    signInRequest(requestBody).then(signInResponse);

  }

  // signInResponse 처리 함수
  const signInResponse = (responseBody) => {
    if (!responseBody) { //예상하지못한 error를 처리 함수
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody; //정상 응답 또는 예상한 error 반환 함수
    //alert(code);
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    else if (code === 'SF' || code === 'VF') setError(true);
    else if (code !== 'SU') return;

    const { token, expirationTime } = responseBody;
    const now = new Date().getTime();                      //현재 시간
    const expires = new Date(now + expirationTime * 1000); //서버에서 설정한 시간(expirationTime)을 현재시간에 더하여 로그인만료 시각을 반환

    setCookie('accessToken', token, { expires, path: '/' }); //path로 이 쿠키가 유효한 페이지를 설정한다(현재 "/"로 모든 페이지 접근 허영)
    navigator('/'); //리다이렉션 역할을 하며 로그인후 노출될 페이지의 경로를 지정해야함
  }

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(user_email, user_password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginFormContainer">
        <img className="signinIcon" src="./HufsLogo.png" />
        <p>이메일</p>
        <input
          type="text"
          error={error}
          value={user_email}
          onChange={e => setUserEmail(e.target.value)}
          placeholder="이메일을 입력해주세요."
        />
      </div>

      <div className="passwordCss" >
        <p>비밀번호</p>
        <input
          type="password"
          value={user_password}
          error={error}
          onChange={e => setUserpassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
      </div>
    
      <button onClick={e => setModalOpenfind(true)}>비밀번호찾기</button>
      {error && 
      <div className='auth-sign-in-erro-box'>
        <div className='auth-sign-in-error-message'>
          {'이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.'}
        </div>
      </div>
      }
      <button type="submit" className="loginButton" onClick={onSignInButtonClickHandler}>로그인</button>
      
      <MyModal //비밀번호 찾기
        open={modalOpenfind}
        width={500} //모달 넓이
        header={[<p key="header">비밀번호 찾기</p>]}
        onCancel={e => setModalOpenfind(false)} //x 버튼
        footer={[]}
      >
        
      </MyModal>
    </form>
  );
};

export default LoginForm;
