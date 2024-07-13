import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; //
import LoginForm from "./Modals/LoginForm";
import Newpassword from './Modals/Newpassword';
import SignUpForm from './Modals/SignupForm';
import SignUpinfoForm from './Modals/Signupinfo';
import FindpasswordForm from './Modals/findpassword';
import MypageForm from './Modals/Mypage';
import MyModal from './MyModal';
import './MyModal.module.css';




function App(){
  const [modalOpen, setModalOpen] = useState(false); //회원가입 인증
  const [modalOpenin, setModalOpenin] = useState(false); //로그인
  const [modalOpenfind, setModalOpenfind] = useState(false); //비밀번호 찾기
  const [modalOpenNew, setModalOpennew] = useState(false); //비밀번호 수정
  const [modalOpeninfo, setModalOpeninfo] = useState(false); //회원가입 인증 후 정보 입력
  const [modalOpenMypage, setModalOpenmypage] = useState(false); //회원가입 인증 후 정보 입력
  const navigator = useNavigate(); //네비게이션 하기0    

  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

  const handleLogin = (email, password) => {
    console.log("Logging in with", email, password);
    setModalOpenin(false);  // 로그인 모달 닫기
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
    removeCookie('accessToken', { path: '/' }); // accessToken 쿠키 삭제
    navigator('/'); // 홈페이지로 리디렉트 (옵션)
  };

  const handleSignUp = (user_email, password) => {
    console.log("Logging in with", user_email, password);
    // 회원가입인증 로직 구현...
  };

  const handleFindpassword = (user_email, password) => {
    console.log("Logging in with", user_email, password);
    // 비밀번호 찾기 로직 구현...
  };

  const handleNewpassword = (Newpassword, Newpassword_1) => {
    console.log("Logging in with", Newpassword, Newpassword_1);
    setModalOpennew(false);
    // 비밀번호 수정.
  };

  const handleinfo = (user_name, user_studentnum,user_password, user_password_1) => {
    console.log("Logging in with",user_name, user_studentnum,user_password, user_password_1);
    setModalOpeninfo(false);
    
  };

  const handlemypage = (user_email, user_studentnum,user_name ) => {
    console.log("Logging in with",user_email, user_studentnum,user_name );
    // 비밀번호 수정.
  };
 
  const handlepwModalClose = () => {
    setModalOpenfind(false);  // 모달 상태를 false로 설정하여 닫습니다.
};


  
  return(
    <>
    
      {isLoggedIn ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <>
          <button onClick={e => setModalOpen(true)}>회원가입</button>
          <button onClick={e => setModalOpenin(true)}>로그인</button>
          <button onClick={e => setModalOpenfind(true)}>비밀번호찾기</button>
          <button onClick={e => setModalOpennew(true)}>비밀번호 수정하기</button>
          <button onClick={e => setModalOpeninfo(true)}>회원가입 정보입력</button>
          <button onClick={e => setModalOpenmypage(true)}>Mypage</button>
          <button onClick={() => navigator('/article-main')}>익명 게시판</button>
        </>
      )}
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
            <SignUpForm onSignUpForm={handleinfo} />
          </MyModal>

          <MyModal
          open={modalOpenin}
          onCancel={() => setModalOpenin(false)}
              header={[]}
              footer={[]}
          >
          <LoginForm onLogin={handleLogin} />


          </MyModal>

          <MyModal //비밀번호 찾기
          open={modalOpenfind}
              width={500} //모달 넓이 이게 적당 한듯
              header={[]}
              onCancel={e => setModalOpenfind(false)} //x 버튼
              footer={[]}
          >
          <FindpasswordForm onFind={handleFindpassword} onClose={handlepwModalClose} />
          </MyModal>


          <MyModal //비밀번호 찾기
          open={modalOpenNew}
              width={500} //모달 넓이 이게 적당 한듯
              header={[
                ]}
              onCancel={e => setModalOpennew(false)} //x 버튼
              footer={[]}
          >
            <Newpassword onLogin={handleNewpassword} onClose={handlepwModalClose} />


              
          </MyModal>

          <MyModal //회원가입 정보 입력
          open={modalOpeninfo}
              width={500} //모달 넓이 이게 적당 한듯
              header={[]}
              onCancel={e => setModalOpeninfo(false)} //x 버튼
              footer={[]}
          >
            <SignUpinfoForm onLogin={handleinfo} />
          </MyModal>

          <MyModal //마이페이지
          open={modalOpenMypage}
              width={500} //모달 넓이 이게 적당 한듯
              header={[
                <div className="image-container" style={{ textAlign: 'center' }}>
                    <img src="/img/hufslogo.gif" alt="HUFS Logo" style={{ height: '50px', marginTop: '70px', display: 'block' }} />
                </div>
                ]}
              onCancel={e => setModalOpenmypage(false)} //x 버튼
              footer={[]}
          >
            <MypageForm onLogin={handlemypage} />
          </MyModal>
          
      </>
  )
}


export default App;
