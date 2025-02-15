import React, { useState, useEffect } from 'react';
import '../css/codingzone/codingzone-main.css';
import { useCookies } from "react-cookie";
import CzCard from '../../widgets/layout/CzCard/czCard';  
 
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { deleteClass } from '../../entities/api/CodingZone/AdminApi.js';
import { checkAdminType } from '../../features/api/Admin/UserApi.js';
import { getAvailableClassesForNotLogin } from '../../features/api/Admin/Codingzone/ClassApi.js';
import InquiryModal from './InquiryModal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { getAttendanceCount, getcodingzoneListRequest } from '../../features/api/CodingzoneApi.js';
import { deleteCodingZoneClass, reserveCodingZoneClass } from '../../entities/api/CodingZone/StudentApi.js';
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
  const [cookies] = useCookies(['accessToken']);
  const [originalClassList, setOriginalClassList] = useState([]); 
  const [attendanceCount, setAttendanceCount] = useState(0); 
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();  
  const [selectedZone, setSelectedZone] = useState(1);
  const [selectedButton, setSelectedButton] = useState('codingzone'); 
  const [userReservedClass, setUserReservedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');  
  const [isRendered, setIsRendered] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showNoClassesImage, setShowNoClassesImage] = useState(false);

  const [pngLoadTime, setPngLoadTime] = useState(null);
  const [webpLoadTime, setWebpLoadTime] = useState(null);

  useEffect(() => {
    if (cookies.accessToken  ) {
      setIsRendered(true);  
    } else {
      setIsRendered(false);  
    }
  }, [cookies.accessToken]);

// 로그인 여부와 관리자 유형을 확인하는 부분을 하나의 useEffect로 정리
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = cookies.accessToken;
      if (token) {
        const response = await checkAdminType(token);
        if (response === "EA") {
          setIsAdmin(true);
        } 
        else if (response === "SU") {
          setUserRole('SU');
        }
        else if (response === "CA") {
          setUserRole('CA');
        }
      }
    };
    fetchUserRole();
  }, [cookies.accessToken]);

  // 요일과 슬라이더 설정을 상수로 정의
  const daysOfWeek = ['월요일', '화요일', '수요일', '목요일', '금요일'];

  // [과사 권한이 있는 계정] 삭제 버튼
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
              setShowNoClassesImage(true);
          } else {
              setShowNoClassesImage(false);
          }
            return updatedList;
        });
    } else {
        alert("수업 삭제에 실패했습니다.");
    }
};

  // 시간 문자열을 분 단위 숫자로 변환하여 정렬
  const timeToNumber = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;   
  };
  // 수업 목록을 요일과 시간 순으로 정렬
  const sortClassList = (classList) => {
    return classList.sort((a, b) => {
      const dayComparison = daysOfWeek.indexOf(a.weekDay) - daysOfWeek.indexOf(b.weekDay);
      if (dayComparison !== 0) {
        return dayComparison;
      }
      return timeToNumber(a.classTime) - timeToNumber(b.classTime);
    });
  };

  // 요일 필터링 기능
  const filterByDay = (day) => {
    if (selectedDay === day) {
      setClassList(originalClassList);
      setSelectedDay('');
    } else {
      const filteredData = originalClassList.filter(classItem => {
        return classItem.weekDay.toLowerCase() === day.toLowerCase();
      });
      setClassList(filteredData);
      setSelectedDay(day);  
    }
  };

    useEffect(() => {
    if (location.pathname === '/coding-zone') {
      setSelectedButton('codingzone');
    } else if (location.pathname.includes('/coding-zone/Codingzone_Attendance')) {
      setSelectedButton('attendence');
    }
  }, [location.pathname]);

  
  /// 코딩존 수업 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
        try {
            let classes = [];
            if (cookies.accessToken) {
                const response = await getcodingzoneListRequest(cookies.accessToken, grade);
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
              setShowNoClassesImage(false);  
          } else {
              setOriginalClassList([]);
              setClassList([]);
              setShowNoClassesImage(true);
          }
        } catch (error) {
          setOriginalClassList([]);
          setClassList([]);
          setShowNoClassesImage(true);
      }
    };
    fetchData();
}, [cookies.accessToken, grade]);

  // 출석 횟수 가져오기
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

// 예약 기능 토글
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
                setUserReservedClass(null);   
            }
        } else {
            result = await reserveCodingZoneClass(token, classItem.classNum);
            if (result) {
                alert("예약이 완료되었습니다.");
                updateClassItem(classItem.classNum, true, classItem.currentNumber + 1); 
                setUserReservedClass(classItem);  
            }
        }
    } catch (error) {
        alert("예약 처리 중 오류가 발생했습니다.");
    }
};

  const handlecodingzone = () => {
    setSelectedButton('codingzone');   
    navigate('/coding-zone');
  };

  const handlecodingzoneattendence = () => {
    const token = cookies.accessToken;
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return; 
    }
    setSelectedButton('attendence');
    navigate(`/coding-zone/Codingzone_Attendance`);
  };

  const handleInquiry = () => {
    setSelectedButton('codingzone');   
  };

  const handleCardClick = (classItem) => {
  };
  // 수업 목록 업데이트
  const updateClassItem = (classNum, isReserved, newCurrentNumber) => {
    const updatedList = classList.map(item =>
      item.classNum === classNum ? { ...item, isReserved, currentNumber: newCurrentNumber } : item
    );
    setClassList(updatedList);
};

const [showModal, setShowModal] = useState(false);

const handleOpenModal = () => {
    setShowModal(true);
};

const handleCloseModal = () => {
    setShowModal(false);
};

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,         
  autoplaySpeed: 4000,   
  pauseOnHover: true      
};

/*출석률 체크바 */
const renderAttendanceProgress = (count) => {
  const cappedCount = Math.min(count, 4);
  const percentage = (cappedCount / 4) * 100;
  return (
    <div className="attendance-progress-container">
      <span className="attendance-label">출석률({percentage}%)</span>
      <div 
        className="attendance-progress-bar" 
        aria-label={`출석 ${percentage}% 완료`}
      >
        <div 
          className="attendance-progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

 // 이미지 로딩 시간 측정 함수
 const measureImageLoadTime = (imageSrc, setLoadTime) => {
  const img = new Image();
  const startTime = performance.now();

  img.src = imageSrc;
  img.onload = () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    setLoadTime(loadTime);
    console.log(`✅ ${imageSrc} 로딩 시간: ${loadTime.toFixed(2)} ms`);
  };

  img.onerror = () => {
    console.error(`❌ ${imageSrc} 로드 실패!`);
    setLoadTime(null);
  };
};

// 개별적인 WebP & PNG 로드 테스트 버튼
const handleWebpTest = () => {
  measureImageLoadTime("/codingzone_main_v5.webp", setWebpLoadTime);
};

const handlePngTest = () => {
  measureImageLoadTime("/codingzone_main_v5.png", setPngLoadTime);
};

useEffect(() => {
  if (pngLoadTime !== null && webpLoadTime !== null) {
    const improvement = ((pngLoadTime - webpLoadTime) / pngLoadTime) * 100;
    alert(`🚀 WebP는 PNG보다 ${improvement.toFixed(2)}% 더 빠르게 로드됩니다.`);
  }
}, [pngLoadTime, webpLoadTime]);

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
        onClick={() => {
          handleInquiry();
          handleOpenModal();
        }}
          className={selectedButton === 'inquiry' ? 'selected' : ''}
        >
          문의 하기
        </button>
        {showModal && <InquiryModal isOpen={showModal} onClose={handleCloseModal} />}
        <span> | </span>
      </div>

      <div className="image-performance-test">
        <h2>이미지 성능 비교</h2>
        <button onClick={handleWebpTest}>WebP 로딩 테스트</button>
        {webpLoadTime !== null && <p>WebP 로딩 시간: {webpLoadTime.toFixed(2)} ms</p>}

        <button onClick={handlePngTest}>PNG 로딩 테스트</button>
        {pngLoadTime !== null && <p>PNG 로딩 시간: {pngLoadTime.toFixed(2)} ms</p>}
      </div>
      <Slider {...sliderSettings}> 
         <div className="codingzone-top-container">
         <img src="/codingzone_main_v5.png" className="codingzonetop2-image"/>
        </div>
        <div className="codingzone-top-container">
        <img src="/coding-zone-main2.png" className="codingzonetop2-image"/>
        </div>
        <div className="codingzone-top-container">
        <img src="/coding-zone-main3.png" className="codingzonetop2-image"/>
        </div>
      </Slider>
      <div className='codingzone-body-container'>
        <div className="cz-category-top">
          <div className="cz-category-date">
            <button 
              className={`cz-1 ${selectedZone === 1 ? 'selected' : ''}`} 
              onClick={() => {
                setGrade(1);
                setSelectedZone(1);
                setSelectedDay('');  
                setClassList(originalClassList);   
              }}>
              코딩존 1
            </button>
            <button 
              className={`cz-2 ${selectedZone === 2 ? 'selected' : ''}`} 
              onClick={() => {
                setGrade(2); setSelectedZone(2);
                setSelectedDay(''); setClassList(originalClassList);   
              }}>
              코딩존 2
            </button>
          </div>
          <Link to="/coding-zone/Codingzone_Attendance" className='cz-count-container'>
            {renderAttendanceProgress(attendanceCount)}
          </Link>
        </div>
        <div className="codingzone-date">
          <button 
            onClick={() => filterByDay('월요일')}
            className={selectedDay === '월요일' ? 'selected' : ''}
          >
            <p>Mon</p>
          </button>
          <span> | </span>
          <button 
            onClick={() => filterByDay('화요일')}
            className={selectedDay === '화요일' ? 'selected' : ''}
          >
            <p>Tue</p>
          </button>
          <span> | </span>
          <button 
            onClick={() => filterByDay('수요일')}
            className={selectedDay === '수요일' ? 'selected' : ''}
          >
            <p>Wed</p>
          </button>
          <span> | </span>
          <button 
            onClick={() => filterByDay('목요일')}
            className={selectedDay === '목요일' ? 'selected' : ''}
          >
            <p>Thu</p>
          </button>
          <span> | </span>
          <button 
            onClick={() => filterByDay('금요일')}
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
            {(cookies.accessToken || isAdmin) && isRendered && (
            <p className='registerbutton'></p>
          )}
          </div>
        </div>
        
        <div className="codingzone-list">
        {showNoClassesImage ? (
          <div className="no-classes-image" style={{ textAlign: 'center', marginTop: '20px' }}>
            <img src="/Codingzone-noregist.png" alt="수업이 없습니다" className="no-classes-img" />
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