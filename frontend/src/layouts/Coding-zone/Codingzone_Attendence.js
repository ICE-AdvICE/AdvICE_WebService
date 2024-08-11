import React, { useEffect, useState } from 'react';
import { getczauthtypetRequest, getczattendlistRequest } from '../../apis/Codingzone-api.js';
import { useCookies } from 'react-cookie';
import '../css/codingzone/codingzone-main.css';
import '../css/codingzone/codingzone_attend.css';
import { useNavigate } from 'react-router-dom';

const Codingzone_Attendence = () => {
    const [authMessage, setAuthMessage] = useState('');
    const [attendList, setAttendList] = useState([]);
    const [showAdminButton, setShowAdminButton] = useState(false);
    const [showManageAllButton, setShowManageAllButton] = useState(false);
    const [showRegisterClassButton, setShowRegisterClassButton] = useState(false);
    const [cookies, setCookie] = useCookies(['accessToken']);
    const [activeButton, setActiveButton] = useState('check');
    const token = cookies.accessToken;
    const navigate = useNavigate();

    const handlecodingzoneattendence =  () => {
        navigate(`/coding-zone/Codingzone_Attendence`);
     };
    const handlecodingzonemanager = () => {
        navigate(`/coding-zone/Codingzone_Manager`);
    };

    const handleFullManagement = () => {
        navigate(`/coding-zone/Codingzone_All_Attend`);
    };

    const handleClassRegistration = () => {
        navigate(`/coding-zone/Class_Registration`);
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
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

    return (
        <div>
            <div className="codingzone-container">
                <div className='select-container'>
                    <span> | </span>
                    <button>코딩존 예약</button>
                    <span> | </span>
                    <button onClick={handlecodingzoneattendence}>출결 관리</button>
                    <span> | </span>
                    <button>문의 하기</button>
                    <span> | </span>
                </div>
                <div className="banner_img_container">
                    <img src="/codingzone_Attendence.png" className="banner" />
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
                    <button
                        className={`btn-attend ${activeButton === 'register' ? 'active' : ''}`}
                        onClick={handleClassRegistration}
                    >
                        수업 등록
                    </button>
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
                    <button
                        className={`btn-attend ${activeButton === 'manage-all' ? 'active' : ''}`}
                        onClick={handleFullManagement}
                    >
                        전체 관리
                    </button>
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
                {attendList.map((item, index) => (
                    <div key={index} className="info_data_inner">
                        <div className="info_data_date">{item.classDate}</div>
                        <div className="info_data_time">{formatTime(item.classTime)}</div>
                        <div className="info_data_bar"></div>
                        <div className="info_data_classname">{item.className}</div>
                        <div className="info_data_assistant">{item.assistantName}</div>
                        <div className="info_data_status">
                            {isFutureDate(item.classDate, item.classTime) ? '진행중' : (item.attendance === '1' ? 'Y' : 'N')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Codingzone_Attendence;
