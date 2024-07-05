import React, { useState } from 'react';
import styles from './modules.css';


const FindpasswordForm = ({ onFindpassForm }) => {
  const [user_email, setUseremail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    FindpasswordForm(user_email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginHeaderContainer">
        <img src="header-name.png" alt="로그인 로고" style={{ width: '220px', height: 'auto' }} />
      </div>
      <div className="pw_emailpost">   
        <label htmlFor="user_email" ></label>
        <input
          type="text"
          id="user_email"
          value={user_email}
          onChange={e => setUseremail(e.target.value)}
          placeholder="학교 이메일을 입력해주세요."
        />
        <button type="submit"  className="findpasswordpost">인증요청</button>
      </div>
      <div className="pw_emailpost" >
        <label htmlFor="password"></label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="인증번호를 입력해주세요."
        />
        <button type="submit"  className="findpasswordpost">인증</button>
      </div>
    
      

        <button type="submit"  className="signupButton">완료</button>
      
     
      
    </form>
  );
};


export default FindpasswordForm;