import React, { useState, useEffect } from 'react';
import '../css/codingzone/codingzone-main.css';
import { useCookies } from "react-cookie";
import CzCard from '../../components/czCard';  
import { deleteCodingZoneClass,reserveCodingZoneClass,getcodingzoneListRequest } from '../../apis/Codingzone-api.js'; // API 함수 임포트

const ClassList = ({ classList, handleCardClick,handleToggleReservation }) => {
  return (
    <div className='cz-card'>
      {classList.map((classItem) => (
        <CzCard
          key={classItem.classNum}
          assistantName={classItem.assistantName}
          classTime={classItem.classTime}
          className={classItem.className}
          weekDay={classItem.weekDay}
          classDate={classItem.classDate}
          currentNumber={classItem.currentNumber}
          maximumNumber={classItem.maximumNumber}
          category={`[${classItem.grade}학년]`}
          onClick={() => handleCardClick(classItem)}
          onReserveClick={() => handleToggleReservation(classItem)}
          isReserved={classItem.isReserved} 

        />
      ))}
    </div>
  );
};

const CodingMain = () => {
    const [classList, setClassList] = useState([]);
    const [token, setToken] = useState('');  
    const [grade, setGrade] = useState(1);  
    const [weekDay, setWeekDay] = useState('');  
    const [cookies] = useCookies('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            const token = cookies.accessToken; 
            const classes = await getcodingzoneListRequest(token, grade, weekDay); // API 요청 시 요일 추가
            if (classes) {
                const updatedClasses = classes.map(classItem => ({
                    ...classItem,
                    isReserved: false
                }));
                setClassList(updatedClasses);
            }
        };
        fetchData();
    }, [token, grade, weekDay]); // weekDay 의존성 추가
    
    const handleCardClick = (classItem) => {
        console.log("Class Clicked:", classItem);
    };
    const handleToggleReservation = async (classItem) => {
        const token = cookies.accessToken;
        if (!token) {
            alert("You are not logged in.");
            return;
        }
        // 예약 상태에 따라 함수 분기
        if (classItem.isReserved) {
            const result = await deleteCodingZoneClass(token, classItem.classNum);
            if (result) {
                alert("예약 취소가 완료되었습니다.");
                updateClassItem(classItem.classNum, false);  
            }
        } else {
            const result = await reserveCodingZoneClass(token, classItem.classNum);
            if (result) {
                alert("예약이 완료되었습니다.");
                updateClassItem(classItem.classNum, true);  
            }
        }
    };


    const updateClassItem = (classNum, isReserved) => {
        const updatedList = classList.map(item =>
          item.classNum === classNum ? { ...item, isReserved } : item
        );
        setClassList(updatedList);
        

      };
    return (
        <div className="codingzone-container">
            <div className='select-container'>
                <span> | </span>
                <button>코딩존 예약</button>
                <span> | </span>
                <button>출결 관리</button>
                <span> | </span>
                <button>문의 하기</button>
                <span> | </span>
            </div>
            <div className="img-container">
                <img src="/coding-zone-main.png" className="codingzonetop-image"/>
            </div>
            <div className='codingzone-body-container'>
                <div className="cz-category-date">
                    <button onClick={() => setGrade(1)}>Coding Zone1</button>
                    <button onClick={() => setGrade(2)}>Coding Zone2</button>
                </div>
                
                <div className="codingzone-date">
                    <button onClick={() => setWeekDay('Monday')}>Mon</button>
                    <button onClick={() => setWeekDay('Tuesday')}>Tue</button>
                    <button onClick={() => setWeekDay('Wednesday')}>Wed</button>
                    <button onClick={() => setWeekDay('Thursday')}>Thu</button>
                    <button onClick={() => setWeekDay('Friday')}>Fri</button>
                </div>
                <div className='category-name-container'>
                    <div className="separator"></div> 
                    <div className="codingzone-title">
                        <div className='d-flex'>
                            <p className='weekDay'>요일</p> 
                            <p className='weekDate'>날짜</p>
                            <p className='weekTime'>시간</p>
                            <p className='weeksubject'>과목명</p>
                            <p className='weekperson'>조교</p>
                            <p className='weekcount'>인원</p>
                             
                        </div>
                    </div>
                    <div className="separator"></div>   
                </div>
                <div className="codingzone-list">
                    <ClassList classList={classList} handleCardClick={handleCardClick} handleToggleReservation={handleToggleReservation} />
                </div>
            </div>
        </div>
    );
};

export default CodingMain;
