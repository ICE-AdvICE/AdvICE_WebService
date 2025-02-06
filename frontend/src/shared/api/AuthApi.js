
import axios from 'axios';

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const GET_MYPAGE_USER_URL = () => `${API_DOMAIN}/user`; //마이페이지_개인정보 

const GET_SIGN_IN_USER_URL =() =>`${API_DOMAIN}/user`;
 
const GET_CZ_AUTH_TYPE = () => `${API_DOMAIN}/coding-zone/auth-type`;
const REFRESH_TOKEN_URL = () => `${API_DOMAIN}/auth/refresh`;
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
export const getMypageRequest = async (accessToken, refreshToken, setCookie, navigate) => {
    if (!accessToken && !refreshToken) {
        alert("🚨 잘못된 접근입니다. 다시 로그인해주세요.");
        navigate('/'); 
        return null; 
    }

    if (!accessToken && refreshToken) {
        alert("🔄 Access Token이 없습니다. 자동으로 재발급 중...");
        const tokenResponse = await refreshTokenRequest(refreshToken, accessToken);

        if (tokenResponse) {
            alert("✅ Access Token이 재발급되었습니다.");
            setCookie('accessToken', tokenResponse.accessToken, { path: '/' });
            setCookie('refreshToken', tokenResponse.refreshToken, { path: '/' });

            return await getMypageRequest(tokenResponse.accessToken, tokenResponse.refreshToken, setCookie, navigate);
        } else {
            alert("⛔️ 토큰 재발급 실패. 다시 로그인해주세요.");
            setCookie('accessToken', '', { path: '/' });
            setCookie('refreshToken', '', { path: '/' });
            navigate('/');
            return null;
        }
    }

    try {
        const response = await axios.get(GET_MYPAGE_USER_URL(), authorization(accessToken));
        return response.data;
    } catch (error) {
        console.error("❌ [마이페이지 데이터 가져오기 실패] 응답:", error.response ? error.response.data : error);

        if (error.response && error.response.data.code === "ATE") {
            console.log("🔄 [Access Token 만료] 토큰 재발급 시도...");
            const tokenResponse = await refreshTokenRequest(refreshToken, accessToken);

            if (tokenResponse) {
                alert("✅ Access Token이 재발급되었습니다.");
                setCookie('accessToken', tokenResponse.accessToken, { path: '/' });
                setCookie('refreshToken', tokenResponse.refreshToken, { path: '/' });

                return await getMypageRequest(tokenResponse.accessToken, tokenResponse.refreshToken, setCookie, navigate);
            } else {
                alert("⛔️ 토큰 재발급 실패. 다시 로그인해주세요.");
                setCookie('accessToken', '', { path: '/' });
                setCookie('refreshToken', '', { path: '/' });
                navigate('/');
                return null;
            }
        }

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


export const refreshTokenRequest = async (refreshToken, accessToken) => {
    try {
        console.log("🔄 [토큰 재발급 시도] refreshToken:", refreshToken);
        const response = await axios.post(REFRESH_TOKEN_URL(), 
            { refreshToken }, 
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.data.code === "SU") {
            console.log("✅ [토큰 재발급 성공] 새로운 accessToken:", response.data.accessToken);
            return {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            };
        } else {
            console.error("⛔️ [토큰 재발급 실패] 응답:", response.data.message);
            return null;
        }
    } catch (error) {
        console.error("❌ [토큰 재발급 중 오류 발생]:", error.response ? error.response.data : error);
        return null;
    }
};



