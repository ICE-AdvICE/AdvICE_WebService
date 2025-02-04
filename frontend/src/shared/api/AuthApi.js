
import axios from 'axios';

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const GET_MYPAGE_USER_URL = () => `${API_DOMAIN}/user`; //마이페이지_개인정보 

const GET_SIGN_IN_USER_URL =() =>`${API_DOMAIN}/user`;
 
const GET_CZ_AUTH_TYPE = () => `${API_DOMAIN}/coding-zone/auth-type`;
const authorization = (accessToken) => {
    return {headers: {Authorization:`Bearer ${accessToken}`}}
};

// 3. 현재 로그인 된 사용자의 정보를 가져오는 API

export const getSignInUserRequest = async (accessToken) => {
    try {
        const response = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};





//3. 현재 로그인 된 사용자의 정보를 받아오는 API 
export const getMypageRequest = async (accessToken) => {
    if (!accessToken) {
        console.log("잘못된 접근입니다.");
        return null; 
    }
    try {
        const response = await axios.get(GET_MYPAGE_USER_URL(), {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log("Response:", response.data);  // 응답 로깅
        return response.data;
    } catch (error) {
        console.log('사용자 데이터를 가져오는 중 오류 발생:', error);
        return null;
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


