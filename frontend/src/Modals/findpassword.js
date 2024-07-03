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
      <div className="signUpContainer">
      <img
                    className="signinIcon"
                    src="./HufsLogo.png"
                  />       
      <p>이메일</p>
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

      <div className="emailpost" >
      <p>인증번호</p>
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
    
      

        <button type="submit"  className="signupButton">다음단계</button>
      
     
      
    </form>
  );
};


export default FindpasswordForm;