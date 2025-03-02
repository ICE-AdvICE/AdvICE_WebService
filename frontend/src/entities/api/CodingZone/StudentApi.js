import axios from 'axios';
import { refreshTokenRequest } from '../../../shared/api/AuthApi';
const DOMAIN = process.env.REACT_APP_API_DOMAIN; 
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
export const reserveCodingZoneClass = async (token, classNum, setCookie, navigate) => {
    try {
        const response = await axios.post(RESERVE_CODING_ZONE_CLASS_URL(classNum), {}, authorization(token));

        if (response.data.code === "SU") {
            return true;
        }
    } catch (error) {
        if (!error.response) {
            alert("네트워크 오류가 발생하였습니다.");
            return false;
        }

        const { code } = error.response.data; 

        if (code === "ATE") {
            console.warn("코딩존 수업 예약: Access Token 만료됨. 토큰 재발급 시도 중...");
            
            const newToken = await refreshTokenRequest(setCookie, token, navigate);
            if (newToken?.accessToken) {
                return reserveCodingZoneClass(newToken.accessToken, classNum, setCookie, navigate);
            } else {
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return false;
            }
        }

        switch (code) {
            case "FC":
                alert("예약 가능한 인원이 꽉 찼습니다.");
                return false;
            case "NU":
                alert("사용자가 존재하지 않습니다.");
                break;
            case "DBE":
                alert("데이터베이스 오류가 발생했습니다.");
                break;
            case "AR":
                alert("이미 예약한 학생입니다.");
                break; 
            default:
                alert("예상치 못한 오류가 발생했습니다.");
                break;
        }
    }
    return false;
};

// 12.  코딩존 수업 예약 취소 API
export const deleteCodingZoneClass = async (token, classNum, setCookie, navigate) => {
    try {
        const response = await axios.delete(DELETE_CODING_ZONE_CLASS_URL(classNum), authorization(token));

        if (response.data.code === "SU") {
            return true;
        }
    } catch (error) {
        if (!error.response) {
            alert("네트워크 오류가 발생하였습니다.");
            return false;
        }

        const { code } = error.response.data;

        if (code === "ATE") {
            console.warn("코딩존 수업 예약 취소: Access Token 만료됨. 토큰 재발급 시도 중...");

            const newToken = await refreshTokenRequest(setCookie, token, navigate);
            if (newToken?.accessToken) {
                return deleteCodingZoneClass(newToken.accessToken, classNum, setCookie, navigate);
            } else {
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return false;
            }
        }

        switch (code) {
            case "NR":
                alert("이미 취소된 수업입니다.");
                break;
            case "NU":
                alert("사용자가 존재하지 않습니다.");
                break;
            case "DBE":
                alert("데이터베이스 오류가 발생했습니다.");
                break;
            default:
                alert("예상치 못한 문제가 발생했습니다.");
                break;
        }
    }
    return false;
};