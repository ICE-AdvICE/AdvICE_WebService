import axios from 'axios';

const DOMAIN = 'http://localhost:8080'; 
const API_DOMAIN = `${DOMAIN}/api/v1`;
const API_DOMAIN_ADMIN = `${DOMAIN}/api/admin`;
const RESERVE_CODING_ZONE_CLASS_URL = (classNum) => `${API_DOMAIN}/coding-zone/reserve-class/${classNum}`;
const DELETE_CODING_ZONE_CLASS_URL = (classNum) => `${API_DOMAIN}/coding-zone/cence-class/${classNum}`;

const authorization = (accessToken) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

//새로고침 함수
const refreshPage = () => {
    window.location.reload();
  };
// 11. 코딩존 수업 예약 API
export const reserveCodingZoneClass = async (token, classNum) => {
    try {
        const response = await axios.post(RESERVE_CODING_ZONE_CLASS_URL(classNum), {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            return true;
        }
        return false;
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "FC":
                    alert("예약가능한 인원이 꽉 찼습니다.");
                    refreshPage(); //마감된것을 확인 후 페이지 새로고침
                    break;
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                case "AR":
                    console.log("이미 예약한 학생입니다.");
                    break; 
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        } else {
            console.log("네트워크 오류가 발생하였습니다.");
        }
        return false;
    }
}
// 12.  코딩존 수업 예약 취소 API
export const deleteCodingZoneClass = async (token, classNum) => {
    try {
        const response = await axios.delete(DELETE_CODING_ZONE_CLASS_URL(classNum), authorization(token));
        if (response.data.code === "SU") {
            return true;
        }
        return false;
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NR":
                    console.log("이미 취소된 수업입니다.");
                    break;
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        } 
        return false;
    }
};
