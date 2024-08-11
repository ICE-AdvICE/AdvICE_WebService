import React, { useEffect, useState } from 'react';
import { getczauthtypetRequest, getczallattendRequest } from '../../apis/Codingzone-api.js';
import { useCookies } from 'react-cookie';
import '../css/codingzone/codingzone-main.css';
import '../css/codingzone/codingzone_attend.css';
import { useNavigate } from 'react-router-dom';

const Codingzone_All_Attend = () => {
    const [authMessage, setAuthMessage] = useState('');
    const [showAdminButton, setShowAdminButton] = useState(false);
    const [showManageAllButton, setShowManageAllButton] = useState(false);
    const [showRegisterClassButton, setShowRegisterClassButton] = useState(false);
    const [cookies, setCookie] = useCookies(['accessToken']);
    const [activeButton, setActiveButton] = useState('check');
    const [attendanceList, setAttendanceList] = useState([]);
    const token = cookies.accessToken;
    const navigate = useNavigate();

    const handlecodingzoneattendence = () => {
        navigate(`/Codingzone_Attendence`);
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
        const fetchAttendanceData = async () => {
            const response = await getczallattendRequest(token);
            if (response && response.code === "SU") {
                setAttendanceList(response.studentList);
            } else {
                console.error(response?.message || "Failed to fetch attendance data.");
            }
        };

        fetchAttendanceData();
    }, [token]);
    const aggregateAttendanceData = (attendanceList) => {
        const aggregatedData = {};
    
        attendanceList.forEach((record) => {
            const key = record.userStudentNum; // 학생별 구분을 학번으로 설정
            if (!aggregatedData[key]) {
                aggregatedData[key] = {
                    userName: record.userName,
                    userEmail: record.userEmail,
                    classDates: [],
                    presentCount: 0,
                    absentCount: 0
                };
            }
            aggregatedData[key].classDates.push(record.classDate);
            if (record.attendance === '0') {
                aggregatedData[key].absentCount++;
            } else {
                aggregatedData[key].presentCount++;
            }
        });
    
        return Object.values(aggregatedData);
    };


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
            <div className="cz_all_container" style={{ textAlign: 'center' }}>
                {attendanceList.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>학번</th>
                                <th>이름</th>
                                <th>Email</th>
                                <th>수업명</th>
                                <th>날짜</th>
                                <th>시간</th>
                                <th>조교</th>
                                <th>출결</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceList.map((student, index) => (
                                <tr key={index}>
                                    <td>{student.userStudentNum}</td>
                                    <td>{student.userName}</td>
                                    <td>{student.userEmail}</td>
                                    <td>{student.className}</td>
                                    <td>{student.classDate}</td>
                                    <td>{student.classTime}</td>
                                    <td>{student.assistantName}</td>
                                    <td>{student.attendance === '0' ? '출석' : '결석'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No attendance data available.</p>
                )}
            </div>
        </div>
    );
};

export default Codingzone_All_Attend;
