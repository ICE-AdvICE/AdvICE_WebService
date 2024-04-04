import React, { useState } from 'react';

import MyModal from '../MyModal';
import FindpasswordForm from './findpassword';


const LoginForm = ({ onLogin }) => {
  const [user_studentnum, setUserstudentnum] = useState('');
  const [user_password, setUserpassword] = useState('');
  const [modalOpenfind, setModalOpenfind] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(user_studentnum, user_password);
  };

  const handleFindpassword = (user_email, password) => {
    console.log("Logging in with", user_email, password);
    // 비밀번호 찾기 로직 구현...
  };

  
  
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginFormContainer">
      <img
                    className="signinIcon"
                    src="./HufsLogo.png"
                  /> 
      <p>학번</p>
        <label htmlFor="user_studentnum" ></label>
        <input
          type="text"
          id="user_studentnum"
          value={user_studentnum}
          onChange={e => setUserstudentnum(e.target.value)}
          placeholder="학번을 입력하세요."
        />
      </div>

      <div className="passwordCss" >
      <p>비밀번호</p>
        <label htmlFor="user_password"></label>
        <input
          type="password"
          id="user_password"
          value={user_password}
          onChange={e => setUserpassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
        
         
      </div>
    
 
      <button onClick={e => setModalOpenfind(true)}>비밀번호찾기</button>
      
        <button type="submit"  className="loginButton">로그인</button>
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
     
      
    </form>
    
  );
};


export default LoginForm;