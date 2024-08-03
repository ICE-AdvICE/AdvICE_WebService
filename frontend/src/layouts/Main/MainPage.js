import React from 'react';
import '../css/MainPage.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const MainPage = () => {
  const [cookies] = useCookies('accessToken');
  const navigate = useNavigate();
  const handleMoreClick = () => {
    navigate('/article-main');  
  };

  const handlecodingzone = () => {
    const token = cookies.accessToken; 
    
    if (!token) {
      alert('로그인이 필요합니다.');
    } else {
      navigate(`/coding-zone`);
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1>ICE</h1>
        <p>This is an integrated service for students in the Department of Information and Communication Engineering.<br />
          Try the coding zone reservation, anonymous bulletin board, and study room reservation service for the Department of Information and Communication Engineering.
          <br />Try your best rather than be the best.
        </p>
      </div>
      <div className="buttons-container">
        <div className="service-box coding-box">
          <p>정보통신공학과에서 운영하는 <br />코딩존 예약/관리 시스템 입니다.</p>
          <button onClick={handlecodingzone} className="btn coding">Coding Zone</button>
        </div>
        <div className="service-box icebreaker-box">
          <p>ICEbreaker 익명게시판을 통해<br /> 학과 사람들과 소통해 보세요.</p>
          <button onClick={handleMoreClick} className="btn icebreaker">ICEbreaker</button>
        </div>
        <div className="service-box study-box">
          <p>정보통신공학과 스터디룸<br /> 예약 오픈채팅방 입니다.</p>
          <button className="btn study">Study Room</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
