import React, { useState, useEffect } from 'react';
import '../css/codingzone/codingzone-main.css';
import czCard from '../../components/czCard'; // czCard 컴포넌트 임포트
import { getcodingzoneListRequest } from '../../apis/Codingzone-api.js'; // API 함수 임포트

// ClassList 컴포넌트 정의
const ClassList = ({ classList, handleCardClick }) => {
  return (
    <div className='cz-card'>
      {classList.map((classItem) => (
        <czCard
          key={classItem.classNum}
          assistantName={classItem.assistantName}
          classTime={classItem.classTime}
          className={classItem.className}
          weekDay={classItem.weekDay}
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

    useEffect(() => {
        const fetchData = async () => {
            let grade = '1';
            const classes = await getcodingzoneListRequest(token, grade);
            if (classes) {
                setClassList(classes);
            }
        };

        fetchData();
    }, [token, grade]); 
    const handleCardClick = (classItem) => {
        console.log("Class Clicked:", classItem);
        // 클릭된 클래스에 대한 추가 작업
    };

    return (
        <div className = "codingzone-container">
            <div className = "img-container">
                <img src="/coding-zone-main.png" className="codingzonetop-image"/>
            </div>
            <div className = 'codingzone-body-container'>
                <div className = "cz-category-date">
                    <button onClick={() => setGrade(1)}>category1 (1학년)</button>
                    <button onClick={() => setGrade(2)}>category2 (2학년)</button>
                </div>
                <div className = "codingzone-date">
                    <button>Mon</button>
                    <button>Tue</button>
                    <button>Wen</button>
                    <button>Thu</button>
                    <button>Fri</button>
                </div>
                <ClassList classList={classList} handleCardClick={handleCardClick} />
            </div>
        </div>
    );
};

export default CodingMain;
