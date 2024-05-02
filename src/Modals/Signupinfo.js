import React, { useState } from 'react';
import styles from './login.modules.css';


const SignUpinfoForm = ({ onSignUpForm }) => {
  const [user_name, setUsername] = useState('');
  const [user_studentnum, setUserstudentnum] = useState('');
  const [user_password, setUserpassword] = useState('');
  const [user_password_1, setUserpassword_1] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    SignUpinfoForm(user_name, user_studentnum,user_password, user_password_1 );
  };

  
  return (
    <form onSubmit={handleSubmit}>
      <div className="loginFormContainer">
            
      <p>이름</p>
        <label htmlFor="user_name" ></label>
        
        <input
          type="text"
          id="user_name"
          value={user_name}
          onChange={e => setUsername(e.target.value)}
          placeholder="이름을 입력해주세요."

        />
        
      </div>

      <div className="passwordCss" >
      <p>학번</p>
        <label htmlFor="user_studentnum"></label>
        <input
          type="text"
          id="user_studentnum"
          value={user_studentnum}
          onChange={e => setUserstudentnum(e.target.value)}
          placeholder="학번을 입력해주세요."
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
          placeholder="비밀번호를 입력해주세요."
        />
      </div>
      
      <div className="passwordCss" >
      <p>비밀번호</p>
        <label htmlFor="user_password_1"></label>
        <input
          type="password"
          id="user_password_1"
          value={user_password_1}
          onChange={e => setUserpassword_1(e.target.value)}
          placeholder="비밀번호를 입력해주세요."
        />
      </div>

       
      <button type="submit"  className="signupButton">완료</button>
     
      
    </form>
  );
};


export default SignUpinfoForm;