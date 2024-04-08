import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from "./Modals/LoginForm";
import Newpassword from './Modals/Newpassword';
import SignUpForm from './Modals/SignupForm';
import SignUpinfoForm from './Modals/Signupinfo';
import FindpasswordForm from './Modals/findpassword';
import MyModal from './MyModal';
import './MyModal.module.css';



function App(){
  const [modalOpen, setModalOpen] = useState(false); //회원가입 인증
  const [modalOpenin, setModalOpenin] = useState(false); //로그인
  const [modalOpenfind, setModalOpenfind] = useState(false); //비밀번호 찾기
  const [modalOpenNew, setModalOpennew] = useState(false); //비밀번호 수정
  const [modalOpeninfo, setModalOpeninfo] = useState(false); //회원가입 인증 후 정보 입력
  const navigator = useNavigate();


  const handleLogin = (user_studentnum, user_password) => {
    console.log("Logging in with", user_studentnum, user_password);
    // 로그인
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
    // 비밀번호 수정.
  };

  const handleinfo = (user_name, user_studentnum,user_password, user_password_1) => {
    console.log("Logging in with",user_name, user_studentnum,user_password, user_password_1);
    // 비밀번호 수정.
  };
  
  return(
    <>
          <button onClick={e => setModalOpen(true)}>회원가입</button>  {/*버튼*/}
          <button onClick={e => setModalOpenin(true)}>로그인</button>  {/*버튼*/}
          <button onClick={e => setModalOpenfind(true)}>비밀번호찾기</button>  {/*버튼*/}
          <button onClick={e => setModalOpennew(true)}>비밀번호 수정하기</button>  {/*버튼*/}
          <button onClick={e => setModalOpeninfo(true)}>회원가입 정보입력</button>  {/*버튼*/}
          <button onClick={() => navigator('/article-main')}>익명 게시판</button> {/*전체 게시글 페이지*/}
          <MyModal //회원가입 모달
            open={modalOpen}
              width={500} //모달 넓이 이게 적당 한듯
              onCancel={e => setModalOpen(false)} //x 버튼
              header={[
                <button  onClick={e => setModalOpenin(true) }>로그인</button>
                ,
                <button  onClick={e => setModalOpen(true) }>회원가입</button>
                ]}
                footer={[]}
          >
            <SignUpForm onSignUpForm={handleSignUp} />
          </MyModal>

          <MyModal
          open={modalOpenin}
              width={500} //모달 넓이 이게 적당 한듯
              header={[
                <button onClick={e => setModalOpenin(true) }>로그인</button>,
                <button  onClick={e => setModalOpen(true) }>회원가입</button>
                ]}
              onCancel={e => setModalOpenin(false)} //x 버튼

              footer={[]}
          >
          <LoginForm onLogin={handleLogin} />

          </MyModal>

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


          <MyModal //비밀번호 찾기
          open={modalOpenNew}
              width={500} //모달 넓이 이게 적당 한듯
              header={[
                <p>비밀번호 수정하기</p>
                ]}
              onCancel={e => setModalOpennew(false)} //x 버튼
              footer={[]}
          >
            <Newpassword onLogin={handleNewpassword} />


              
          </MyModal>

          <MyModal //비밀번호 찾기
          open={modalOpeninfo}
              width={500} //모달 넓이 이게 적당 한듯
              header={[
                <p>회원가입</p>
                ]}
              onCancel={e => setModalOpeninfo(false)} //x 버튼
              footer={[]}
          >
            <SignUpinfoForm onLogin={handleinfo} />



              
          </MyModal>
          
      </>
  )
}


export default App;
