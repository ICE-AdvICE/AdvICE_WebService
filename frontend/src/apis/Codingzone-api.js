import axios from 'axios';

const DOMAIN = 'http://localhost:4000';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const GET_CZ_AUTH_TYPE = () => `${API_DOMAIN}/coding-zone/auth-type`;
const GET_CZ_ATTEND_LIST = () => `${API_DOMAIN}/coding-zone/attend-list`;
const authorization = (accessToken) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};


// 11.모든 게시글을 리스트 형태로 불러오는 API
export const getcodingzoneListRequest = async (token, grade) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/coding-zone/class-list/${grade}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            console.log("성공: 수업 리스트를 성공적으로 가져왔습니다.");
            return response.data.classList;
        } else {
            console.log("알림: 해당 학년에 대한 수업 리스트가 없습니다.");
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
        } else {
            console.log("네트워크 오류가 발생하였습니다.");
        }
        return false;
    }
};

// 7.운영자 권한 종류 확인 API
export const getczauthtypetRequest = async (accessToken) => {
    try {
        const response = await axios.get(GET_CZ_AUTH_TYPE(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};
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


