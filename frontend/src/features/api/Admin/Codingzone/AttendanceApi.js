import axios from 'axios';
import { refreshTokenRequest } from '../../../../shared/api/AuthApi';

const DOMAIN = process.env.REACT_APP_API_DOMAIN;

// 1학년 출/결석 처리 API (ATE 대응)
export const putczattendc1Request = async (registNum, accessToken, setCookie, navigate) => {
    try {
        const response = await axios.put(`${DOMAIN}/api/admin-c1/attendance/${registNum}`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;

        const { code } = error.response.data;

        if (code === "ATE") {
            console.warn("1학년 출/결석 처리: Access Token 만료됨. 토큰 재발급 시도 중...");
            const newToken = await refreshTokenRequest(setCookie, accessToken, navigate);

            if (newToken?.accessToken) {

                return putczattendc1Request(registNum, newToken.accessToken, setCookie, navigate);
            } else {
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return { code: 'TOKEN_EXPIRED', message: '토큰이 만료되었습니다. 다시 로그인해주세요.' };
            }
        }

        return error.response.data;
    }
};

// 2학년 출/결석 처리 API (ATE 대응)
export const putczattendc2Request = async (registNum, accessToken, setCookie, navigate) => {
    try {
        const response = await axios.put(`${DOMAIN}/api/admin-c2/attendance/${registNum}`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;

        const { code } = error.response.data;

        if (code === "ATE") {
            console.warn("2학년 출/결석 처리: Access Token 만료됨. 토큰 재발급 시도 중...");
            const newToken = await refreshTokenRequest(setCookie, accessToken, navigate);

            if (newToken?.accessToken) {
    
                return putczattendc2Request(registNum, newToken.accessToken, setCookie, navigate);
            } else {
        
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return { code: 'TOKEN_EXPIRED', message: '토큰이 만료되었습니다. 다시 로그인해주세요.' };
            }
        }

        return error.response.data;
    }
};
