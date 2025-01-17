import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../css/codingzone/codingzone-main.css';
import '../css/codingzone/codingzone_attend.css';
import '../css/codingzone/codingzone_manager.css';
import { getczauthtypetRequest, getczattendlistRequest, getczreservedlistRequest, putczattendc1Request, putczattendc2Request } from '../../apis/Codingzone-api.js';
import InquiryModal from './InquiryModal';

const Codingzone_Manager = () => {
    const [attendList, setAttendList] = useState([]);
    const [reservedList, setReservedList] = useState([]);
    const [showAdminButton, setShowAdminButton] = useState(false);
    const [cookies, setCookie] = useCookies(['accessToken']);
    const [activeButton, setActiveButton] = useState('manage');
    const token = cookies.accessToken;
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedButton, setSelectedButton] = useState('attendence'); 

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlecodingzone = () => {
        setSelectedButton('codingzone');
        navigate('/coding-zone');
    };

    const handlecodingzoneattendence = () => {
        setSelectedButton('attendence');
        navigate(`/coding-zone/Codingzone_Attendance`);
    };

    const handleInquiry = () => {
        setSelectedButton('inquiry');
    };



    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const currentDate = new Date(selectedDate);
            console.log("Checking date:", now, currentDate); // Debugging log

           
        }, 10000); // Check every 10 seconds for debugging

        return () => clearInterval(timer); // Clear the timer when the component unmounts
    }, [selectedDate]);

    useEffect(() => {
        fetchAuthType();
        fetchAttendList();
    }, [token]);

    useEffect(() => {
        fetchReservedList();
    }, [token, selectedDate]);

    const fetchAuthType = async () => {
        const response = await getczauthtypetRequest(token);
        if (response) {
            switch (response.code) {
                case "SU":
                case "EA":
                case "NU":
                    alert('로그인 시간이 만료되었습니다. 다시 로그인 해주세요.');
                    navigate('/');
                    break;
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
        }
        else if (response && response.code === "NU") {


        }
        else {
            console.error(response.message);
        }
    };

    const fetchReservedList = async () => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await getczreservedlistRequest(token, formattedDate);
        if (response && response.code === "SU") {
            setReservedList(response.studentList.sort((a, b) => a.classTime.localeCompare(b.classTime)));
        } else if (response && response.code === "NU") {
        }
        else {
            console.error(response.message);
            setReservedList([]);
        }
    };



    const handleAttendanceUpdate = async (student, newState) => {
        const method = student.grade === 1 ? putczattendc1Request : putczattendc2Request;
        const response = await method(student.registrationId, token);
        if (response.code === "SU") {
            alert('처리가 완료되었습니다.');
            fetchReservedList(); // 새로고침 기능
        } else if (response && response.code === "NU") {
        
        }
        else {
            alert('오류가 발생했습니다. 다시 시도 해 주세요.');
        }
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    return (
        <div>
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
                <div className="banner_img_container">
                    <img src="/codingzone_attendance3.png" className="banner" />
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



            <div className="reserved_manager-list-container">
            <div className="czm_manager_container">
        <DatePicker
            selected={selectedDate}
            onChange={(date) => {
                const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                const koreaDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000)); // Correctly adjust for Korean timezone
                setSelectedDate(koreaDate);
            }}
            dateFormat="yyyy/MM/dd"
            className="custom_manager_datepicker"
        />
    </div>
    <h3 className="date_manager_title">
        {`${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}/${selectedDate.getDate()} 예약 리스트`}
    </h3>


                <div className="line-manager-container1">
                    {/* 실선 영역 */}
                </div>

                <div className="info-manager-container">
                    <div className="info_manager_inner">
                        <div className="info_manager_name">이름</div>
                        <div className="info_manager_studentnum ">학번</div>
                        <div className="info_manager_bar"></div>
                        <div className="info_manager_time ">시간</div>
                        <div className="info_manager_status">출결</div>
                    </div>
                </div>
                <div className="line-manager-container2">
                    {/* 실선 영역 */}
                </div>

                <div className="info_manager_container">
                    {reservedList.length > 0 ? (
                        reservedList.map((student, index, array) => {
                            const isNextTimeBlockDifferent = index === array.length - 1 || student.classTime !== array[index + 1].classTime;
                            return (
                                <div key={index}>
                                    <div className="info_manager_data_inner">
                                        <div className="info_manager_data_name">{student.userName}</div>
                                        <div className="info_manager_data_studentnum">{student.userStudentNum}</div>
                                        <div className="info_manager_data_bar"></div>
                                        <div className="info_manager_data_time">{formatTime(student.classTime)}</div>
                                        <div className="info_manager_data_status">
                                            {student.attendance === "1" ? (
                                                <button className="btn_manager_attendance" disabled>출석</button>
                                            ) : (
                                                <button className="btn_manager_attendance-disabled" onClick={() => handleAttendanceUpdate(student, "1")}>출석</button>
                                            )}
                                            {student.attendance === "0" ? (
                                                <button className="btn_manager_absence" disabled>결석</button>
                                            ) : (
                                                <button className="btn_manager_absence-disabled" onClick={() => handleAttendanceUpdate(student, "0")}>결석</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className={isNextTimeBlockDifferent ? "hr_manager_line_thick" : "hr_manager_line"}></div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-reservations">예약된 리스트가 없습니다.</p>
                    )}

                </div>


            </div>
        </div>
    );
};

export default Codingzone_Manager;
