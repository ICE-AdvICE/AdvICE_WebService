import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../css/codingzone/codingzone-main.css';
import '../css/codingzone/codingzone_attend.css';
import '../css/codingzone/codingzone_manager.css';
import { getczauthtypetRequest, getczattendlistRequest, getczreservedlistRequest, putczattendc1Request, putczattendc2Request } from '../../apis/Codingzone-api.js';

const Codingzone_Manager = () => {
    const [authMessage, setAuthMessage] = useState('');
    const [attendList, setAttendList] = useState([]);
    const [reservedList, setReservedList] = useState([]);
    const [showAdminButton, setShowAdminButton] = useState(false);
    const [cookies, setCookie] = useCookies(['accessToken']);
    const [activeButton, setActiveButton] = useState('manage');
    const token = cookies.accessToken;
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handlecodingzoneattendence = () => {
        navigate(`/coding-zone/Codingzone_Attendence`);
    };

    useEffect(() => {
        fetchAuthType();
        fetchAttendList();
    }, [token]);

    const fetchAuthType = async () => {
        const response = await getczauthtypetRequest(token);
        if (response) {
            switch (response.code) {
                case "SU":
                case "EA":
                case "NU":
                case "DBE":
                    break;
                case "CA":
                    setShowAdminButton(true);
                    break;
                default:
                    setShowAdminButton(false);
                    break;
            }
        }
    };

    const fetchAttendList = async () => {
        const response = await getczattendlistRequest(token);
        if (response && response.code === "SU") {
            setAttendList(response.attendList);
        } else {
            console.error(response.message);
        }
    };

    const fetchReservedList = async () => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await getczreservedlistRequest(token, formattedDate);
        if (response && response.code === "SU") {
            setReservedList(response.studentList);
        } else {
            console.error(response.message);
            setReservedList([]);
        }
    };

    useEffect(() => {
        fetchReservedList();
    }, [token, selectedDate]);

    const handleAttendanceUpdate = async (student, newState) => {
        const method = student.grade === 1 ? putczattendc1Request : putczattendc2Request;
        const response = await method(student.registrationId, token);
        if (response.code === "SU") {
            alert('처리가 완료되었습니다.');
            fetchReservedList(); // 새로고침 기능
        } else {
            alert(`오류: ${response.message}`);
        }
    };

    return (
        <div>
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
                <div className="banner_img_container">
                    <img src="/codingzone_Attendence.png" className="banner" />
                </div>
            </div>
            <div className="cza_button_container" style={{ textAlign: 'center' }}>
                <button
                    className={`btn-attend ${activeButton === 'check' ? 'active' : ''}`}
                    onClick={() => { setActiveButton('check'); handlecodingzoneattendence(); }}
                >
                    출결 확인
                </button>
                {showAdminButton && (
                    <>
                        <div className="divider"></div>
                        <button
                            className={`btn-attend ${activeButton === 'manage' ? 'active' : ''}`}
                            onClick={() => setActiveButton('manage')}
                        >
                            출결 관리
                        </button>
                    </>
                )}
            </div>
            <div className="czm_container">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy/MM/dd"
                />
            </div>
            <div className="reserved-list-container">
                <h3>{selectedDate.toISOString().split('T')[0]} 예약 리스트</h3>
                {reservedList.length > 0 ? (
                    <ul>
                        {reservedList.map((student, index) => (
                            <li key={index}>
                                이름: {student.userName}, 이메일: {student.userEmail}, 수업명: {student.className}, 수업시간: {student.classTime},
                                {student.attendance === "1" ? (
                                    <button className="btn-attendance" onClick={() => { }} disabled>출석</button>
                                ) : (
                                    <button className="btn-attendance-disabled" onClick={() => handleAttendanceUpdate(student, "1")}>출석</button>
                                )}
                                {student.attendance === "0" ? (
                                    <button className="btn-absence" onClick={() => { }} disabled>결석</button>
                                ) : (
                                    <button className="btn-absencebtn-absence-disabled" onClick={() => handleAttendanceUpdate(student, "0")}>결석</button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>예약된 리스트가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default Codingzone_Manager;
