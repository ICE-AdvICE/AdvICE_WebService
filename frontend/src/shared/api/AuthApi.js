
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const GET_MYPAGE_USER_URL = () => `${API_DOMAIN}/user`; //마이페이지_개인정보 
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_CZ_AUTH_TYPE = () => `${API_DOMAIN}/coding-zone/auth-type`;
const REFRESH_TOKEN_URL = () => `${API_DOMAIN}/auth/refresh`;

const authorization = (accessToken) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
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
export const getMypageRequest = async (accessToken, setCookie, navigate) => {
    if (!accessToken) {
        alert("잘못된 접근입니다. 다시 로그인해주세요.");
        navigate('/');
        return null;
    }

    try {
        const response = await axios.get(GET_MYPAGE_USER_URL(), authorization(accessToken));
        return response.data;
    } catch (error) {
        console.error("[마이페이지 데이터 가져오기 실패] 응답:", error.response ? error.response.data : error);

        if (!error.response || !error.response.data) {
            alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
            return null;
        }

        const { code, message } = error.response.data;

        switch (code) {
            case "ATE":
                console.log("[Access Token 만료] 토큰 재발급 시도...");
                const newToken = await refreshTokenRequest(setCookie, accessToken, navigate);
                if (newToken?.accessToken) {
                    alert("Access Token이 재발급되었습니다.");
                    return await getMypageRequest(newToken.accessToken, setCookie, navigate);
                } else {
                    alert("토큰 재발급 실패. 다시 로그인해주세요.");
                    setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                    navigate('/');
                    return null;
                }
            
            case "NU":
                alert("존재하지 않는 사용자입니다. 다시 로그인해주세요.");
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return null;

            case "NP":
                alert("권한이 없습니다. 관리자에게 문의하세요.");
                navigate('/'); // 권한 문제 발생 시 홈으로 이동
                return null;

            case "DBE":
                alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                return null;

            default:
                alert(`오류 발생: ${message}`);
                return null;
        }
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

//13 토큰 재발급 API
export const refreshTokenRequest = async (setCookie, accessToken, navigate) => {
    try {
        if (!accessToken) {
            alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
            navigate('/');
            return null;
        }

        const response = await axios.post(
            REFRESH_TOKEN_URL(),
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}` // AT를 헤더에 포함
                },
                withCredentials: true // 쿠키 자동 포함 (refresh_token 포함됨)
            }
        );

        if (response.data.code === "SU") {
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.headers['refresh-token']; // 헤더에서 RT 추출

            setCookie('accessToken', newAccessToken, { path: '/', expires: new Date(Date.now() + 3600 * 1000) });
            if (newRefreshToken) {
                setCookie('refreshToken', newRefreshToken, { path: '/', httpOnly: true, secure: true });
            }

            alert("[토큰 재발급 성공]:", newAccessToken);
            return { accessToken: newAccessToken };
        } else {
            console.error("[토큰 재발급 실패] 응답:", response.data.message);
            alert("토큰 재발급에 실패했습니다. 다시 로그인해주세요.");
            navigate('/');
            return null;
        }
    } catch (error) {
        alert("토큰 재발급 중 오류가 발생했습니다. 다시 로그인해주세요.");
        navigate('/');
        return null;
    }
};
