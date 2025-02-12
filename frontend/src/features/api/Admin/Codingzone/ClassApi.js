import axios from 'axios';

const DOMAIN = 'http://localhost:8080'; 
const API_DOMAIN = `${DOMAIN}/api/v1`;

const API_DOMAIN_ADMIN = `${DOMAIN}/api/admin`;
const authorization = (accessToken) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};


const GET_AVAILABLE_CLASSES_FOR_NOT_LOGIN_URL = (grade) => `${API_DOMAIN}/coding-zone/class-list/for-not-login/${grade}`;
const GET_CZ_ALL_ATTEND = () => `${DOMAIN}/api/admin/student-list`;
//6. 학기 초기화 API
export const resetCodingZoneData = async (token) => {
    try {
        const response = await axios.delete(`${API_DOMAIN_ADMIN}/delete-allinf`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; 
    } catch (error) {
        if (!error.response) {
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data;
    }
};

//13. 해당 학기에 출/결한 모든 학생들 리스트로 반환 API
export const getczallattendRequest = async (accessToken) => {
    try {
        const response = await axios.get(GET_CZ_ALL_ATTEND(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};

// 9. 선택 학년의 예약 가능한 수업 리스트로 반환 API (ForNotLogIn)
export const getAvailableClassesForNotLogin = async (grade) => {
    try {
        const response = await axios.get(GET_AVAILABLE_CLASSES_FOR_NOT_LOGIN_URL(grade));
        if (response.data.code === "SU") {
            return response.data.classList; 
        } else {
            console.log(response.data.message);
            return [];
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
                    break;
                case "NA":
                    console.log("등록된 수업이 없습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        }  
        return [];
    }
};
// 14.특정 날짜에 1학년/2학년 코딩존 수업 예약한 학생들 리스트로 반환 API
export const getczreservedlistRequest =  async (accessToken, classDate) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/coding-zone/reserved-list/${classDate}`, authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};

//16. 해당 학기 모든 학생들의 출결 정보를 Excel 파일로 반환하는 API 
export const downloadAttendanceExcel = async (accessToken, grade) => {
    try {
        const response = await axios.get(`${API_DOMAIN_ADMIN}/excel/attendance/grade${grade}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `attendance_grade${grade}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "ATE":
                    alert("로그인 시간이 만료되었습니다. 다시 로그인 해주세요.");
                    break;
                case "AF":
                    alert("권한이 없습니다. 학과 조교 권한이 필요합니다.");
                    break;
                case "ISE":
                    alert("서버 문제로 인해 파일 생성에 실패했습니다. 다시 시도해주세요.");
                    break;
                case "DBE":
                    alert("데이터베이스 오류가 발생했습니다. 관리자에게 문의하세요.");
                    break;
                default:
                    alert("다운로드 실패: 네트워크 상태를 확인해주세요.");
                    break;
            }
        } else {
            alert("다운로드 실패: 네트워크 상태를 확인해주세요.");
        }
    }
};