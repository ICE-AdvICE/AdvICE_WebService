import React, { useState } from 'react';


const SignUpForm = ({ onSignUpForm }) => {
  const [user_email, setUseremail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUpForm(user_email, password);
  };

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
        <button type="submit"  className="SignupFormpost">인증요청</button>
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