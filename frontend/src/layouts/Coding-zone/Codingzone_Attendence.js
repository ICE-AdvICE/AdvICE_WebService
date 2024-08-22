import React, { useEffect, useState } from 'react';
import { getczauthtypetRequest, getczattendlistRequest } from '../../apis/Codingzone-api.js';
import { useCookies } from 'react-cookie';
import '../css/codingzone/codingzone-main.css';
import '../css/codingzone/codingzone_attend.css';
import { useNavigate,useLocation } from 'react-router-dom';
import InquiryModal from './InquiryModal';

const Codingzone_Attendence = () => {
    const [authMessage, setAuthMessage] = useState('');
    const [attendList, setAttendList] = useState([]);
    const [showAdminButton, setShowAdminButton] = useState(false);
    const [showManageAllButton, setShowManageAllButton] = useState(false);
    const [showRegisterClassButton, setShowRegisterClassButton] = useState(false);
    const [cookies, setCookie] = useCookies(['accessToken']);
    const [activeButton, setActiveButton] = useState('check');
    const token = cookies.accessToken;
    const [selectedButton, setSelectedButton] = useState('attendance'); 
    const navigate = useNavigate();
    const location = useLocation();  
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    useEffect(() => {
        if (location.pathname.includes('Codingzone_Attendence')) {
          setSelectedButton('attendence');
        }
      }, [location]);
    const handlecodingzoneattendence =  () => {
        navigate(`/coding-zone/Codingzone_Attendance`);
     };
    const handlecodingzonemanager = () => {
        navigate(`/coding-zone/Codingzone_Manager`);
    };

    const handleFullManagement = () => {
        navigate(`/coding-zone/Codingzone_All_Attend`);
    };

    const handleClassRegistration = () => {
        navigate(`/coding-zone/coding-class-regist`);
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;  // getMonth()는 0부터 시작하므로 1을 더해줍니다.
        const day = date.getDate();
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;  // 두 자리 숫자로 유지
    };

    const isFutureDate = (classDate, classTime) => {
        const now = new Date();
        const classDateTime = new Date(`${classDate}T${classTime}`);
        return classDateTime > now;
    };

    useEffect(() => {
        const fetchAuthType = async () => {
            const response = await getczauthtypetRequest(token);
            if (response) {
                switch (response.code) {
                    case "CA":
                        setShowAdminButton(true);
                       
                        break;
                    case "EA":
                        setShowRegisterClassButton(true);
                        setShowManageAllButton(true); // Also show '전체 관리' for EA
                        break;
                    default:
                        setShowAdminButton(false);
                        setShowManageAllButton(false);
                        setShowRegisterClassButton(false);
                        break;
                }
            }
        };

        fetchAuthType();
    }, [token, authMessage]);

    useEffect(() => {
        const fetchAttendList = async () => {
            const response = await getczattendlistRequest(token);
            if (response && response.code === "SU") {
                setAttendList(response.attendList);
            } else {
                console.error(response.message);
            }
        };

        fetchAttendList();
    }, [token]);
    const handlecodingzone = () => {
         
        navigate(`/coding-zone`);
      };
    return (
        <div>
            <div className="codingzone-container">
                <div className='select-container'>
                    <span> | </span>
                    <button onClick={handlecodingzone}  >코딩존 예약</button>
                    <span> | </span>
                    <button 
                    onClick={handlecodingzoneattendence} 
                    className={selectedButton === 'attendence' ? 'selected' : ''}
                    >
                    출결 관리
                    </button>
                    <span> | </span>
                    <button onClick={handleOpenModal}>문의하기</button>
{showModal && <InquiryModal isOpen={showModal} onClose={handleCloseModal} />}
                    <span> | </span>
                </div>
                <div className="banner_img_container">
                    <img src="/codingzone_attendance2.png" className="banner" />
                </div>
            </div>
            <div className="cza_button_container" style={{ textAlign: 'center' }}>
                <button
                    className={`btn-attend ${activeButton === 'check' ? 'active' : ''}`}
                    onClick={() => setActiveButton('check')}
                >
                    출결 확인
                </button>
                {showRegisterClassButton && (
                    <>
                    <div className="divider"></div>
                    <button
                        className={`btn-attend ${activeButton === 'manage_class' ? 'active' : ''}`}
                        onClick={handleClassRegistration}
                    >
                        수업 등록
                    </button>
                    </>
                )}
                {showAdminButton && (
                    <>
                        <div className="divider"></div>
                        <button
                            className={`btn-attend ${activeButton === 'manage' ? 'active' : ''}`}
                            onClick={handlecodingzonemanager}
                        >
                            출결 관리
                        </button>
                    </>
                )}
                {showManageAllButton && (
                    <>
                    <div className="divider"></div>
                    <button
                        className={`btn-attend ${activeButton === 'manage_all' ? 'active' : ''}`}
                        onClick={handleFullManagement}
                    >
                        전체 관리
                    </button>
                    </>
                )}
            </div>

            <div className="line-container1">
                {/* 실선 영역 */}
            </div>

            <div className="info-container">
                <div className="info_inner">
                    <div className="info_date">날짜</div>
                    <div className="info_time">시간</div>
                    <div className="info_bar"></div>
                    <div className="info_classname">과목명</div>
                    <div className="info_assistant">조교</div>
                    <div className="info_status">출결</div>
                </div>
            </div>
            <div className="line-container2">
                {/* 실선 영역 */}
            </div>

            <div className="info_data_container">
    {attendList.length > 0 ? (
        attendList.map((item, index) => (
            <div key={index}>
                <div className="info_data_inner">
                    <div className="info_data_date">{formatDate(item.classDate)}</div>
                    <div className="info_data_time">{formatTime(item.classTime)}</div>
                    <div className="info_data_bar"></div>
                    <div className="info_data_classname">{item.className}</div>
                    <div className="info_data_assistant">{item.assistantName}</div>
                    <div className="info_data_status">
                        {isFutureDate(item.classDate, item.classTime) ? '진행중' : (item.attendance === '1' ? 'Y' : 'N')}
                    </div>
                </div>
                <div className="hr-line"></div> {/* Horizontal line after each item */}
            </div>
        ))
    ) : (
        <div className="empty-list-message">신청한 수업 리스트가 없습니다.</div>
    )}
</div>
        </div>
    );
};

export default Codingzone_Attendence;
