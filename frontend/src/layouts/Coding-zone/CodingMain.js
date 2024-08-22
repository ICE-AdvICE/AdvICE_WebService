import React, { useState, useEffect } from 'react';
import '../css/codingzone/codingzone-main.css';
import { useCookies } from "react-cookie";
import CzCard from '../../components/czCard';  
import { deleteClass,checkAdminType, getAvailableClassesForNotLogin, getAttendanceCount, deleteCodingZoneClass, reserveCodingZoneClass, getcodingzoneListRequest } from '../../apis/Codingzone-api.js'; 
import { useNavigate, useLocation } from 'react-router-dom';

const ClassList = ({ userReservedClass,onDeleteClick,classList, handleCardClick, handleToggleReservation, isAdmin }) => {
  return (
    <div className='cz-card'>
      {classList.map((classItem) => (
        <CzCard
          key={classItem.classNum}
          isAdmin={isAdmin}
          onDeleteClick={() => onDeleteClick(classItem.classNum)}
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
          disableReserveButton={
            userReservedClass && 
            (userReservedClass.classNum !== classItem.classNum && userReservedClass.grade === classItem.grade)
          }
         
        />
        
      ))}
    </div>
  );
};

const CodingMain = () => {
  const [classList, setClassList] = useState([]);
  const [grade, setGrade] = useState(1);  
  const [weekDay, setWeekDay] = useState('');  
  const [cookies] = useCookies(['accessToken']);
  const [originalClassList, setOriginalClassList] = useState([]); 
  const [attendanceCount, setAttendanceCount] = useState(0); 
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();  
  const [selectedZone, setSelectedZone] = useState(1);
  const [selectedButton, setSelectedButton] = useState(''); 
  const [noClassesMessage, setNoClassesMessage] = useState('');
  const [userReservedClass, setUserReservedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');  // 현재 선택된 요일을 저장하는 상태


  useEffect(() => {
    const fetchUserRole = async () => {
      const token = cookies.accessToken;
      if (token) {
        const response = await checkAdminType(token);
        if (response === "EA") {
          setIsAdmin(true);
        } 
      }
    };
    fetchUserRole();
  }, [cookies.accessToken]);

  useEffect(() => {
    if (window.location.pathname.includes("coding-zone")) {
      const dFlexPElements = document.querySelectorAll('.d-flex p');
      dFlexPElements.forEach(element => {
        element.style.flexBasis = '150px'; 
      });
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes('coding-zone')) {
      setSelectedButton('codingzone');
    } 
  }, [location]);

  const daysOfWeek = ['월요일', '화요일', '수요일', '목요일', '금요일'];

  const handleDelete = async (classNum) => {
    const token = cookies.accessToken;
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }
    const result = await deleteClass(classNum, token);
    if (result) {
        alert("수업이 삭제되었습니다.");
        setClassList(prevClassList => {
            const updatedList = prevClassList.filter(item => item.classNum !== classNum);
            if (updatedList.length === 0) {
                setNoClassesMessage('등록된 코딩존 수업이 없습니다.');
            }
            return updatedList;
        });
    } else {
        alert("수업 삭제에 실패했습니다.");
    }
};

  const timeToNumber = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;   
  };

  const sortClassList = (classList) => {
    return classList.sort((a, b) => {
      const dayComparison = daysOfWeek.indexOf(a.weekDay) - daysOfWeek.indexOf(b.weekDay);
      if (dayComparison !== 0) {
        return dayComparison;
      }
      return timeToNumber(a.classTime) - timeToNumber(b.classTime);
    });
  };

  const filterByDay = (day) => {
    const filteredData = originalClassList.filter(classItem => {
      return classItem.weekDay.toLowerCase() === day.toLowerCase();
    });
    setClassList(filteredData);
    return filteredData;   
  };
  useEffect(() => {
    const fetchData = async () => {
        try {
            let classes = [];

            if (cookies.accessToken) {
                const response = await getcodingzoneListRequest(cookies.accessToken, grade, weekDay);
                if (response) {
                    if (response.registedClassNum !== 0) {
                        classes = response.classList.map(classItem => ({
                            ...classItem,
                            isReserved: classItem.classNum === response.registedClassNum   
                        }));
                        const reservedClass = classes.find(classItem => classItem.isReserved);
                        if (reservedClass) {
                            setUserReservedClass(reservedClass);
                        }
                    } else {
                        classes = response.classList.map(classItem => ({
                            ...classItem,
                            isReserved: false   
                        }));
                    }
                }
            } 
            else {
                const response = await getAvailableClassesForNotLogin(grade);
                if (response && response.length > 0) {
                    classes = response.map(classItem => ({
                        ...classItem,
                        isReserved: undefined 
                    }));
                }
            }
            if (classes && classes.length > 0) {
                const sortedClasses = sortClassList(classes);
                setOriginalClassList(sortedClasses);
                setClassList(sortedClasses);
                setNoClassesMessage('');  
            } else {
                setOriginalClassList([]);
                setClassList([]);
                setNoClassesMessage('등록된 코딩존 수업이 없습니다.');
            }
        } catch (error) {
            setOriginalClassList([]);
            setClassList([]);
            setNoClassesMessage('등록된 코딩존 수업이 없습니다.');
        }
    };
    fetchData();
}, [cookies.accessToken, grade, weekDay]);


  useEffect(() => {
    const fetchAttendance = async () => {
      const token = cookies.accessToken;
      if (token) {
          const count = await getAttendanceCount(token, grade);  
          setAttendanceCount(count);
        } 
    };
    fetchAttendance();
  }, [cookies.accessToken, grade]);

  const handleCardClick = (classItem) => {
    console.log('');
  };

  const handleToggleReservation = async (classItem) => {
    const token = cookies.accessToken;
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }
    try {
        let result;
        if (classItem.isReserved) {
            result = await deleteCodingZoneClass(token, classItem.classNum);
            if (result) {
                alert("예약 취소가 완료되었습니다.");
                updateClassItem(classItem.classNum, false, classItem.currentNumber - 1);
                setUserReservedClass(null);  // 예약 취소 시 userReservedClass를 null로 설정
            }
        } else {
            result = await reserveCodingZoneClass(token, classItem.classNum);
            if (result) {
                alert("예약이 완료되었습니다.");
                updateClassItem(classItem.classNum, true, classItem.currentNumber + 1); 
                setUserReservedClass(classItem);  // 예약 시 userReservedClass를 해당 수업으로 설정
            }
        }
    } catch (error) {
        console.log("예약 처리 중 오류 발생:", error);
        alert("예약 처리 중 오류가 발생했습니다.");
    }
};

  const handlecodingzone = () => {
    setSelectedButton('codingzone');   
    navigate('/coding-zone');
  };

  const handlecodingzoneattendence = () => {
    setSelectedButton('attendence');   
    navigate('/coding-zone/Codingzone_Attendence');
  };

  const handleInquiry = () => {
    setSelectedButton('inquiry');   
  };

  const updateClassItem = (classNum, isReserved, newCurrentNumber) => {
    const updatedList = classList.map(item =>
      item.classNum === classNum ? { ...item, isReserved, currentNumber: newCurrentNumber } : item
    );
    setClassList(updatedList);
};

  return (
    <div className="codingzone-container">
      <div className='select-container'>
        <span> | </span>
        <button 
          onClick={handlecodingzone} 
          className={selectedButton === 'codingzone' ? 'selected' : ''}
        >
          코딩존 예약
        </button>
        <span> | </span>
        <button 
          onClick={handlecodingzoneattendence} 
          className={selectedButton === 'attendence' ? 'selected' : ''}
        >
          출결 관리
        </button>
        <span> | </span>
        <button 
          onClick={handleInquiry} 
          className={selectedButton === 'inquiry' ? 'selected' : ''}
        >
          문의 하기
        </button>
        <span> | </span>
      </div>
      <div className="codingzone-top-container">
        <img src="/coding-zone-main.png" className="codingzonetop2-image"/>
      </div>
      <div className='codingzone-body-container'>
        <div className="cz-category-top">
          <div className="cz-category-date">
            <button 
              className={`cz-1 ${selectedZone === 1 ? 'selected' : ''}`} 
              onClick={() => {
                setGrade(1);
                setSelectedZone(1);
              }}>
              Coding Zone1
            </button>
            <button 
              className={`cz-2 ${selectedZone === 2 ? 'selected' : ''}`} 
              onClick={() => {
                setGrade(2);
                setSelectedZone(2);
              }}>
              Coding Zone2
            </button>
          </div>
          {cookies.accessToken && (
            <div className='cz-count-container'>
              출석횟수 : {attendanceCount}/6
            </div>
          )}
        </div>
        
        <div className="codingzone-date">
        <button 
          onClick={() => {
            filterByDay('월요일');
            setSelectedDay('월요일');  
          }}
          className={selectedDay === '월요일' ? 'selected' : ''}
        >
        <p>Mon</p>  
        </button>
        <span> | </span>
        <button 
          onClick={() => {
          filterByDay('화요일');
            setSelectedDay('화요일');  
          }}
          className={selectedDay === '화요일' ? 'selected' : ''}
        >
        <p>Tue</p>  
        </button>
          <span> | </span>
          <button 
          onClick={() => {
          filterByDay('수요일');
          setSelectedDay('수요일');  
          }}
          className={selectedDay === '수요일' ? 'selected' : ''}
        >
        <p>Wed</p>  
        </button>
          <span> | </span>
          <button 
          onClick={() => {
          filterByDay('목요일');
          setSelectedDay('목요일');  
          }}
          className={selectedDay === '목요일' ? 'selected' : ''}
        >
        <p>Thu</p>  
        </button>
          <span> | </span>
          <button 
          onClick={() => {
          filterByDay('금요일');
          setSelectedDay('금요일');   
          }}
          className={selectedDay === '금요일' ? 'selected' : ''}
        >
        <p>Fri</p>  
        </button>
        </div>
        
        <div className='category-name-container'>
          <div className="codingzone-title">
            <p className='weekDay'>요일</p> 
            <p className='weekDate'>날짜</p>
            <p className='weekTime'>시간</p>
            <p className='card-hidden-space'></p>
            <p className='weeksubject'>과목명</p>
            <p className='weekperson'>조교</p>
            <p className='weekcount'>인원</p>

            {(cookies.accessToken || isAdmin) && (
              <p className='registerbutton'></p>
            )}
          </div>
        </div>
        
        <div className="codingzone-list">
          {noClassesMessage ? (
             <div className="no-classes-message" style={{ textAlign: 'center', marginTop: '20px' }}>
             {noClassesMessage}
           </div> 
          ) : (
            <ClassList 
              classList={classList} 
              handleCardClick={handleCardClick} 
              handleToggleReservation={handleToggleReservation} 
              isAdmin={isAdmin}  
              onDeleteClick={handleDelete} 
              userReservedClass={userReservedClass} 
            />
          )}
        </div>
       
      </div>
    </div>
  );
};

export default CodingMain;