import React, { useState, useEffect } from 'react';
import '../css/codingzone/codingzone-main.css';
import { useCookies } from "react-cookie";
import CzCard from '../../components/czCard';  
<<<<<<< HEAD
import { getcodingzoneListRequest } from '../../apis/Codingzone-api.js'; // API 함수 임포트
import { useNavigate } from 'react-router-dom';
=======
import { getAttendanceCount,deleteCodingZoneClass,reserveCodingZoneClass,getcodingzoneListRequest } from '../../apis/Codingzone-api.js'; // API 함수 임포트
>>>>>>> 54a139da8c8abaec5a87e2b30d63e2953cbce0ec

 
const ClassList = ({ classList, handleCardClick }) => {
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
        />
      ))}
    </div>
  );
};

const CodingMain = () => {
    const [classList, setClassList] = useState([]);
    const [token, setToken] = useState('');  
    const [grade, setGrade] = useState(1);  
    const [cookies] = useCookies('accessToken');
<<<<<<< HEAD
    const navigate = useNavigate();

    const handlecodingzoneattendence =  () => {
        navigate(`/coding-zone/Codingzone_Attendence`);
     };

    useEffect(() => {
        const fetchData = async () => {
            const token = cookies.accessToken; 
            let grade = '1';
            const classes = await getcodingzoneListRequest(token, grade);
            if (classes) {
                setClassList(classes);
=======
    const [originalClassList, setOriginalClassList] = useState([]); 
    const [attendanceCount, setAttendanceCount] = useState(0); 


    const filterByDay = (day) => {
        const filteredData = originalClassList.filter(classItem => {
            return classItem.weekDay.toLowerCase() === day.toLowerCase();
        });
        setClassList(filteredData);
        return filteredData;   
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = cookies.accessToken;
            try {
                const classes = await getcodingzoneListRequest(token, grade, weekDay);
    
                if (classes && classes.length > 0) {  
                    const updatedClasses = classes.map(classItem => ({
                        ...classItem,
                        isReserved: false  
                    }));
                    setOriginalClassList(updatedClasses); 
                    setClassList(updatedClasses);
                } else {
                    setOriginalClassList([]);
                    setClassList([]);
                }
            } catch (error) {  
                setOriginalClassList([]);
                setClassList([]);
>>>>>>> 54a139da8c8abaec5a87e2b30d63e2953cbce0ec
            }
        };

        fetchData();
<<<<<<< HEAD
    }, [token, grade]); 
=======
    }, [token, grade, weekDay]);  
    useEffect(() => {
        const fetchAttendance = async () => {
            const token = cookies.accessToken;
            if (token) {
                try {
                    const count = await getAttendanceCount(token, grade);
                    setAttendanceCount(count);
                } catch (error) {
                    console.error("Failed to fetch attendance count:", error);
                }
            }
        };
        fetchAttendance();
    }, [token, grade]);

    
>>>>>>> 54a139da8c8abaec5a87e2b30d63e2953cbce0ec
    const handleCardClick = (classItem) => {
        console.log("Class Clicked:", classItem);
        // 클릭된 클래스에 대한 추가 작업
    };

    return (
        <div className = "codingzone-container">
            <div className = 'select-container'>
                <span> | </span>
                <button>코딩존 예약</button>
                <span> | </span>
                <button onClick={handlecodingzoneattendence} >출결 관리</button>
                <span> | </span>
                <button>문의 하기</button>
                <span> | </span>
            </div>
            <div className = "img-container">
                <img src="/coding-zone-main.png" className="codingzonetop-image"/>
            </div>
<<<<<<< HEAD
            <div className = 'codingzone-body-container'>
                <div className = "cz-category-date">
                    <button onClick={() => setGrade(1)}>Coding Zone1  </button>
                    <button onClick={() => setGrade(2)}>Coding Zone2  </button>
                </div>
                
                <div className = "codingzone-date">
                    <button>Mon</button>
                    <button>Tue</button>
                    <button>Wen</button>
                    <button>Thu</button>
                    <button>Fri</button>
                </div>
                <div className='category-name-container'>
                    <div className="separator"></div> 
                    <div className="codingzone-title">
                        <div className = 'd-flex'>
                            <p className = 'weekDay'>요일</p> 
                            <p className = 'weekDate'>날짜</p>
                            <p className = 'weekTime'>시간</p>
                            <p className = 'weeksubject'>과목명</p>
                            <p className = 'weekperson'>조교</p>
                            <p className = 'weekcount'>인원</p>

=======
            <div className='codingzone-body-container'>
                <div className= "cz-category-top">
                    <div className="cz-category-date">
                        <button onClick={() => setGrade(1)}>Coding Zone1</button>
                        <button onClick={() => setGrade(2)}>Coding Zone2</button>
                    </div>
                    <div className='cz-count-container'>
                        출석횟수 : {attendanceCount}/6

                    </div>
                </div>
                
                
                <div className="codingzone-date">
                <button onClick={() => filterByDay('Monday')}>Mon</button>
                <button onClick={() => filterByDay('tuesday')}>Tue</button>
                <button onClick={() => filterByDay('wednesday')}>Wed</button>
                <button onClick={() => filterByDay('thursday')}>Thu</button>
                <button onClick={() =>filterByDay('friday')}>Fri</button>
            </div>
                <div className='category-name-container'>
                    <div className="separator"></div> 
                    <div className="codingzone-title">
                        <div className='d-flex'>
                            <p className='weekDay'>요일</p> 
                            <p className='weekDate'>날짜</p>
                            <p className='weekTime'>시간</p>
                            <p className='card-hidden-space '>시간</p>
                            <p className='weeksubject'>과목명</p>
                            <p className='weekperson'>조교</p>
                            <p className='weekcount'>인원</p>
                            <p className='registerbutton'></p>
                             
>>>>>>> 54a139da8c8abaec5a87e2b30d63e2953cbce0ec
                        </div>
                        
                    </div>
                    <div className="separator"></div>   
                </div>
                <div className = "codingzone-list">
                <ClassList classList={classList} handleCardClick={handleCardClick} />

                </div>
               
            </div>
        </div>
    );
};

<<<<<<< HEAD

export default CodingMain;
=======
export default CodingMain;
>>>>>>> 54a139da8c8abaec5a87e2b30d63e2953cbce0ec
