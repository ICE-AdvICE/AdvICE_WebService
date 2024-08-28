import React, { useState } from 'react';




const Newpassword = ({ onLogin }) => {
  const [Newpassword, setNewpassword] = useState('');
  const [Newpassword_1, setNewpassword_1] = useState('');
  


  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(Newpassword, Newpassword_1);
  };



  
  
  return (
    <form onSubmit={handleSubmit}>
        <div className="loginHeaderContainer">
        <img src="header-name.png" alt="로그인 로고" className="responsiveLogo" />
      </div>    
      <p>새로운 비밀번호</p>
        <label htmlFor="Newpassword" ></label>
        <input
          type="password"
          id="Newpassword"
          value={Newpassword}
          onChange={e => setNewpassword(e.target.value)}
          placeholder="새로운 비밀번호를 입력하세요."
        />


      <div className="passwordCss" >
      <p>새로 바꾼 비밀번호_추후수정예정</p>
        <label htmlFor="Newpassword_1"></label>
        <input
          type="password"
          id="Newpassword_1"
          value={Newpassword_1}
          onChange={e => setNewpassword_1(e.target.value)}
          placeholder="새로 바꾼 비밀번호를 입력하세요."
        />
        
         
      </div>
    
      <button type="submit"  className="signupButton">완료</button>
      
     
      
    </form>
    
  );
};


export default Newpassword;