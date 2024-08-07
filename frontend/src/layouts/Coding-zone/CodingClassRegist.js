import React, { useState, useEffect } from 'react';
import '../css/codingzone/CodingClassRegist.css';
import { useCookies } from "react-cookie";
import { uploadGroupData, fetchGroupClasses, uploadClassForWeek } from '../../apis/Codingzone-api';
import MyModal from '../../MyModal';
import LoginForm from '../../Modals/LoginForm';

const ClassRegist = () => {
    const [boxes, setBoxes] = useState([{ day: '', time: '', assistant: '', className: '', grade: '', maxPers: '' }]);
    const [boxes2, setBoxes2] = useState([]);
    const [groupId, setGroupId] = useState('A');
    const [cookies] = useCookies(['accessToken']);
    const [activeCategory, setActiveCategory] = useState('registerClass');
    const [showLoginModal, setShowLoginModal] = useState(false); 

    const refreshPage = () => {
        window.location.reload();
      };

    const handleButtonClick = () => {
        handleSubmit();
        refreshPage();
      };  

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('.footer');
            const scrollPosition = window.scrollY + window.innerHeight;
            const footerPosition = footer.offsetTop;

            if (scrollPosition > footerPosition) {
                window.scrollTo({
                    top: footerPosition,
                    behavior: 'smooth'
                });
            }
        };
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, []);

    useEffect(() => {
        loadGroupClasses();
    }, [groupId]);

    const handleGroupUploadResponse = (response) => {
        if (!response) {
            alert('오류 발생: 네트워크 상태를 확인해주세요.');
            return;
        }
        const { code, message } = response;
        switch (code) {
            case 'SU':
                alert('성공적으로 등록되었습니다.');
                handleCategoryClick('registerClass')
                break;
            case 'AF':
                alert('권한이 없습니다.');
                break;
            case 'NU':
                alert('로그인 시간이 만료되었습니다. 다시 로그인 해주세요.');
                setShowLoginModal(true);
                break;
            case 'DBE':
                alert('데이터베이스 오류입니다.');
                break;
            default:
                alert('오류 발생: ' + message);
                break;
        }
    };

    const handleuploadClassForWeekResponse = (response) => {
        if (!response) {
            alert('오류 발생: 네트워크 상태를 확인해주세요.');
            return;
        }
        const { code, message } = response;
        switch (code) {
            case 'SU':
                alert('성공적으로 등록되었습니다.');
                handleCategoryClick('registerClass')
                break;
            case 'AF':
                alert('권한이 없습니다.');
                break;
            case 'NU':
                alert('로그인 시간이 만료되었습니다. 다시 로그인 해주세요.');
                setShowLoginModal(true);
                break;
            case 'DBE':
                alert('데이터베이스 오류입니다.');
                break;
            default:
                alert('오류 발생: ' + message);
                break;
        }
    };

    const loadGroupClasses = async () => {
        const data = await fetchGroupClasses(groupId, cookies.accessToken);
        if (!data) {
            alert('오류 발생: 네트워크 상태를 확인해주세요.');
            return;
        }
        const { code, message } = data;
        switch (code) {
            case 'SU':
                setBoxes2(data.groupList.map(group => ({
                    day: group.weekDay,
                    date: '',
                    time: group.classTime,
                    assistant: group.assistantName,
                    className: group.className,
                    grade: group.grade.toString(), // select에서 사용하기 위해 문자열로 변환
                    maxPers: group.maximumNumber.toString() // select에서 사용하기 위해 문자열로 변환
                })));
                break;
            case 'AF':
                alert('권한이 없습니다.');
                break;
            case 'NU':
                alert('로그인 시간이 만료되었습니다. 다시 로그인 해주세요.');
                setShowLoginModal(true);
                break;
            case 'NA':
                setBoxes2([{ day: '', date: '', time: '', assistant: '', className: '', grade: '', maxPers: '' }]);
                break;
            case 'DBE':
                alert('데이터베이스 오류입니다.');
                break;
            default:
                alert('오류 발생: ' + message);
                break;
        }
    };

    const addBox = () => {
        setBoxes([...boxes, { day: '', time: '', assistant: '', className: '', grade: '', maxPers: '' }]);
        setTimeout(() => {
            const footer = document.querySelector('.footer');
            const scrollPosition = window.scrollY + window.innerHeight;
            const footerPosition = footer.offsetTop;

            if (scrollPosition >= footerPosition) {
                window.scrollTo({
                    top: footerPosition,
                    behavior: 'smooth'
                });
            }
        }, 0);
    };

    const handleChange = (index, field, value) => {
        const newBoxes = [...boxes];
        newBoxes[index][field] = value;
        setBoxes(newBoxes);
    };

    const handleSubmit = async () => {
        const formattedData = boxes.map(box => ({
            groupId: groupId,
            assistantName: box.assistant,
            classTime: box.time,
            className: box.className,
            maximumNumber: parseInt(box.maxPers),
            weekDay: box.day,
            grade: parseInt(box.grade)
        }));
        const response = await uploadGroupData(formattedData, cookies.accessToken);
        handleGroupUploadResponse(response);
    };

    const addBox2 = () => {
        setBoxes2([...boxes2, { day: '', date: '', time: '', assistant: '', className: '', grade: '', maxPers: '' }]);
        setTimeout(() => {
            const footer = document.querySelector('.footer');
            const scrollPosition = window.scrollY + window.innerHeight;
            const footerPosition = footer.offsetTop;

            if (scrollPosition >= footerPosition) {
                window.scrollTo({
                    top: footerPosition,
                    behavior: 'smooth'
                });
            }
        }, 0);
    };

    const handleChange2 = (index, field, value) => {
        const newBoxes2 = [...boxes2];
        newBoxes2[index][field] = value;
        setBoxes2(newBoxes2);
    };

    const handleSubmit2 = async () => {
        const currentYear = new Date().getFullYear();
        const formattedData = boxes2.map(box => {
            const dateParts = box.date ? box.date.split('-') : ['01', '01']; // 기본값 설정
            const [month, day] = dateParts;
            const formattedDate = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
            return {
                assistantName: box.assistant,
                classDate: formattedDate,
                classTime: box.time,
                className: box.className,
                maximumNumber: parseInt(box.maxPers),
                weekDay: box.day,
                grade: parseInt(box.grade)
            };
        });
    
        const response = await uploadClassForWeek(formattedData, cookies.accessToken);
        handleuploadClassForWeekResponse(response);
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const closeModal = () => { //모달창 닫기위한 코드
        setShowLoginModal(false);
    };

    const isValidDate = (date) => {
        if (!date) return true; // 입력 값이 비어있으면 유효한 것으로 간주합니다.
        const regex = /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/; // 'MM-DD' 형식 검사
        if (!regex.test(date)) {
            return false;
        }
    
        const [month, day] = date.split('-').map(Number); // 문자열을 숫자로 변환
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return false;
        }
        return true;
    };

    const renderActiveSection = () => {
        if (activeCategory === 'registerGroupInfo') {
            return (
                <>
                    <div className="main-category-name-container">
                        <div className="separator"></div>
                        <div className="element-title">
                            <div className="part1-element-title">
                                <p className="weekDay">요일</p>
                                <p className="weekTime">시간</p>
                                <p className="assistent">조교</p>
                            </div>
                            <div className="part2-element-title">
                                <p className="className">과목명</p>
                            </div>
                            <div className="part3-element-title">
                                <p className="grade">학년</p>
                                <p className="maxPers">인원</p>
                            </div>
                        </div>
                        <div className="separator"></div>
                    </div>
                    <div className="class-input-container">
                        {boxes.map((box, index) => (
                            <div key={index} className="class-input-box">
                            <select className="Day-input" value={box.day} onChange={(e) => handleChange(index, 'day', e.target.value)}>
                                <option value="">Day</option>
                                <option value="월요일">MON</option>
                                <option value="화요일">TUE</option>
                                <option value="수요일">WED</option>
                                <option value="목요일">THU</option>
                                <option value="금요일">FRI</option>
                            </select>
                            <select className="Time-input" value={box.time} onChange={(e) => handleChange(index, 'time', e.target.value)}>
                                <option value="">Time</option>
                                <option value="09:00:00">09:00</option>
                                <option value="10:00:00">10:00</option>
                                <option value="11:00:00">11:00</option>
                                <option value="12:00:00">12:00</option>
                                <option value="13:00:00">13:00</option>
                                <option value="14:00:00">14:00</option>
                                <option value="15:00:00">15:00</option>
                                <option value="16:00:00">16:00</option>
                                <option value="17:00:00">17:00</option>
                                <option value="18:00:00">18:00</option>
                                <option value="19:00:00">19:00</option>
                                 <option value="20:00:00">20:00</option>
                             </select>
                            <input className="Assistant-input" placeholder="Assistant" value={box.assistant} onChange={(e) => handleChange(index, 'assistant', e.target.value)} />
                            <input className="ClassName-input" placeholder="Class Name" value={box.className} onChange={(e) => handleChange(index, 'className', e.target.value)} />
                            <select className="Grade-input" value={box.grade} onChange={(e) => handleChange(index, 'grade', e.target.value)}>
                                <option value="">Grade</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                            <input className="MaxPers-input" type="number" placeholder="MaxPers" min="1" step="1" value={box.maxPers} onChange={(e) => handleChange(index, 'maxPers', e.target.value)} />
                         </div>
                    ))}
                    </div>
                    <div className='button-area'>
                        <div className="add-button-container">
                            <button onClick={addBox}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                </svg>
                            </button>
                        </div>
                        <div className='class-submit-button'>
                            <button onClick={handleButtonClick}>등록</button>
                            
                        </div>
                    </div>
                </>
            );
        }else if(activeCategory === 'registerClass') {
            return (
                <>
                    <div className="main-category-name-container2">
                        <div className="separator2"></div>
                        <div className="element-title2">
                            <div className="part1-element-title2">
                                <p className="weekDay2">요일</p>
                                <p className="classDate2">날짜</p>
                                <p className="weekTime2">시간</p>
                                <p className="assistent2">조교</p>
                            </div>
                            <div className="part2-element-title2">
                                <p className="className2">과목명</p>
                            </div>
                            <div className="part3-element-title2">
                                <p className="grade2">학년</p>
                                <p className="maxPers2">인원</p>
                            </div>
                        </div>
                        <div className="separator"></div>
                    </div>
                    <div className="class-input-container">
                        {boxes2.map((box, index) => (
                            <div key={index} className="class-input-box">
                                <select className="Day-input" value={box.day} onChange={(e) => handleChange2(index, 'day', e.target.value)}>
                                    <option value="">Day</option>
                                    <option value="월요일">MON</option>
                                    <option value="화요일">TUE</option>
                                    <option value="수요일">WED</option>
                                    <option value="목요일">THU</option>
                                    <option value="금요일">FRI</option>
                                </select>
                                <input className={`Date-input ${box.date && !isValidDate(box.date) ? 'invalid-date' : ''}`} placeholder="예) 07-26" value={box.date} onChange={(e) => handleChange2(index, 'date', e.target.value)} />
                                <select className="Time-input" value={box.time} onChange={(e) => handleChange2(index, 'time', e.target.value)}>
                                    <option value="">Time</option>
                                    <option value="09:00:00">09:00</option>
                                    <option value="10:00:00">10:00</option>
                                    <option value="11:00:00">11:00</option>
                                    <option value="12:00:00">12:00</option>
                                    <option value="13:00:00">13:00</option>
                                    <option value="14:00:00">14:00</option>
                                    <option value="15:00:00">15:00</option>
                                    <option value="16:00:00">16:00</option>
                                    <option value="17:00:00">17:00</option>
                                    <option value="18:00:00">18:00</option>
                                    <option value="19:00:00">19:00</option>
                                    <option value="20:00:00">20:00</option>
                                </select>
                                <input className="Assistant-input" placeholder="Assistant" value={box.assistant} onChange={(e) => handleChange2(index, 'assistant', e.target.value)} />
                                <input className="ClassName-input" placeholder="Class Name" value={box.className} onChange={(e) => handleChange2(index, 'className', e.target.value)} />
                                <select className="Grade-input" value={box.grade} onChange={(e) => handleChange2(index, 'grade', e.target.value)}>
                                    <option value="">Grade</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                                <input className="MaxPers-input" type="number" placeholder="MaxPers" min="1" step="1" value={box.maxPers} onChange={(e) => handleChange2(index, 'maxPers', e.target.value)} />
                            </div>
                        ))}
                    </div>
                    <div className='button-area2'>
                        <div className="add-button-container2">
                            <button onClick={addBox2}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                </svg>
                            </button>
                        </div>
                        <div className='class-submit-button2'>
                            <button onClick={handleSubmit2}>등l록</button>
                        </div>
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <div className="class-regist-main-container">
            <MyModal
                open={showLoginModal}
                onCancel={closeModal}
                footer={[]}>
                <LoginForm onLogin={(loginSuccess) => {
                    closeModal();
                }} closeModal={closeModal} />
            </MyModal>
            <div className="header-select-container">
                <span> | </span>
                <button>코딩존 예약</button>
                <span> | </span>
                <button>출결 관리</button>
                <span> | </span>
                <button>문의 하기</button>
                <span> | </span>
            </div>
            <div className="img-container">
                <img src="/coding-zone-main.png" alt="Coding Zone" className="codingzonetop-image"/>
            </div>
            <div className="main-body-container">
                <div className="main-category-bar">
                    <button>출결 확인</button>
                    <span className="main-span"> | </span>
                    <button>출결 관리</button>
                    <span className="main-span"> | </span>
                    <button>수업 등록</button>
                </div>
                <div className="category-bar">
                    <div className="inner-category-bar">
                        <button className={`category-button ${activeCategory === 'registerGroupInfo' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('registerGroupInfo')}>
                            조 정보 등록
                        </button>
                        <span className="main-span"></span>
                        <button className={`category-button ${activeCategory === 'editGroupInfo' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('editGroupInfo')}>
                            조 정보 수정
                        </button>
                        <span className="main-span"></span>
                        <button className={`category-button ${activeCategory === 'registerClass' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('registerClass')}>
                            수업 등록
                        </button>
                    </div>
                    <div className="inner-category-bar2">
                    <button className={`Agroup-button ${groupId === 'A' ? 'active' : ''}`} onClick={() => setGroupId('A')}>A 조</button>
                    <span className="main-span"> | </span>
                    <button className={`Bgroup-button ${groupId === 'B' ? 'active' : ''}`} onClick={() => setGroupId('B')}>B 조</button>
                    </div>
                </div>
                {renderActiveSection()}
            </div>
        </div>
    );
};

export default ClassRegist;


