import React, { useState } from 'react';
//import {SignInRequestDto} from '../apis/request/auth/sign-in.request.dto.js';
import { signInRequest } from '../apis/index.js';
//import {SignInResponseDto} from '../apis/response/auth/sign-in.response.js'
//import {ResponseDto} from '../apis/response/response.dto.js'
import { useCookies } from 'react-cookie'; // 수정된 임포트
import { useNavigate } from 'react-router-dom'; // 수정된 임포트

import MyModal from '../MyModal';

const LoginForm = ({ onLogin }) => {
  // 상태 관리를 위한 useState 훅 사용
  const [user_studentnum, setUserstudentnum] = useState('');
  const [user_password, setUserpassword] = useState('');
  const [error, setError] = useState(false); // 에러 상태 추가
  const [modalOpenfind, setModalOpenfind] = useState(false);

  // 쿠키와 네비게이터 훅 사용은 컴포넌트 내부에서 정의
  const [cookies, setCookie] = useCookies(['accessToken']);
  const navigator = useNavigate();

  // 로그인 버튼 클릭 핸들러
  const onSignInButtonClickHandler = (e) => {
    e.preventDefault(); // 페이지 리로드 방지
    const requestBody = { email: user_studentnum, password: user_password };
    
    signInRequest(requestBody).then(signInResponse);

  }

  // signInResponse 처리 함수
  const signInResponse = (responseBody) => {
    if (!responseBody) {
      alert('네트워크 이상입니다.');
      return;
    }
    const { code } = responseBody;
    alert(code);
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    else if (code === 'SF' || code === 'VF') setError(true);
    else if (code !== 'SU') return;

    const { token, expirationTime } = responseBody;
    const now = new Date().getTime();
    const expires = new Date(now + expirationTime * 1000);

    setCookie('accessToken', token, { expires, path: '/' }); // MAIN_PATH() 대신 임시 경로 '/'
    navigator('/'); // MAIN_PATH() 대신 임시 경로 '/'
  }

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(user_studentnum, user_password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginFormContainer">
        <img className="signinIcon" src="./HufsLogo.png" />
        <p>이메일</p>
        <input
          type="text"
          value={user_studentnum}
          onChange={e => setUserstudentnum(e.target.value)} 
          placeholder="이메일을 입력해주세요."
        />
      </div>

      <div className="passwordCss" >
        <p>비밀번호</p>
        <input
          type="password"
          value={user_password}
          onChange={e => setUserpassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
      </div>
    
      <button onClick={e => setModalOpenfind(true)}>비밀번호찾기</button>
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
