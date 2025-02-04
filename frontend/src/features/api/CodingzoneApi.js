
import axios from 'axios';

const DOMAIN = 'http://localhost:8080'; 
const API_DOMAIN = `${DOMAIN}/api/v1`;
const API_DOMAIN_ADMIN = `${DOMAIN}/api/admin`;
const authorization = (accessToken) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const GET_CZ_ATTEND_LIST = () => `${API_DOMAIN}/coding-zone/attend-list`;
const GET_ATTENDANCE_COUNT_URL = (grade) => `${API_DOMAIN}/coding-zone/count-of-attend/${grade}`;
const GET_CODING_ZONE_LIST_URL = (grade) => `${API_DOMAIN}/coding-zone/class-list/${grade}`;
//8.선택된 학년의 예약 가능한 수업 리스트로 반환 API
export const getcodingzoneListRequest  = async (token, grade, weekDay) => {
    try {
        const response = await axios.get(GET_CODING_ZONE_LIST_URL(grade), {
            headers: { Authorization: `Bearer ${token}` },
            params: { weekDay }
        });
        if (response.data.code === "SU") {
            return {
                classList: response.data.classList,
                registedClassNum: response.data.registedClassNum
            };
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
        return false;
    }
}
//10.출석 횟수 반환 API
export const getAttendanceCount = async (token, grade) => {
    try {
        const response = await axios.get(GET_ATTENDANCE_COUNT_URL(grade), authorization(token));
        if (response.data.code === "SU") {
            return response.data.numOfAttend;  
        } 
        return null;  
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    alert("로그인이 필요합니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                default:
                    break;
            }
        }
        return null;  
    }
}
// 12.특정 사용자의 출/결석된 수업 리스트로 반환 API 
export const getczattendlistRequest = async (accessToken) => {
    try {
        const response = await axios.get(GET_CZ_ATTEND_LIST(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};
;


