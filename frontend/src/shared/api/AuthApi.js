import axios from 'axios';

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const GET_MYPAGE_USER_URL = () => `${API_DOMAIN}/user`; // 마이페이지_개인정보
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_CZ_AUTH_TYPE = () => `${API_DOMAIN}/coding-zone/auth-type`;
const REFRESH_TOKEN_URL = () => `${API_DOMAIN}/auth/refresh`;

const authorization = (accessToken) => ({
    headers: { Authorization: `Bearer ${accessToken}` }
});


const requestWithTokenHandling = async (apiCall, accessToken, setCookie, navigate, apiName) => {
    try {
        const response = await apiCall(accessToken);
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) {
            alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
            return null;
        }

        const { code } = error.response.data;

        if (code === "ATE") {
            console.warn(`🔄 [${apiName}] Access Token 만료됨. 토큰 재발급 시도 중...`);
            const newToken = await refreshTokenRequest(setCookie, accessToken, navigate, apiName);

            if (newToken?.accessToken) {
                console.log(`✅ [${apiName}] Access Token이 재발급됨. 다시 요청 수행...`);
                return requestWithTokenHandling(apiCall, newToken.accessToken, setCookie, navigate, apiName);
            } else {
                alert("토큰 재발급 실패. 다시 로그인해주세요.");
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return null;
            }
        }

        return error.response.data;
    }
};



export const getSignInUserRequest = async (accessToken, setCookie, navigate) => {
    return requestWithTokenHandling(
        (token) => axios.get(GET_SIGN_IN_USER_URL(), authorization(token)),
        accessToken, setCookie, navigate, "getSignInUserRequest"
    );
};

export const getMypageRequest = async (accessToken, setCookie, navigate) => {
    return requestWithTokenHandling(
        (token) => axios.get(GET_MYPAGE_USER_URL(), authorization(token)),
        accessToken, setCookie, navigate, "getMypageRequest"
    );
};

export const getczauthtypetRequest = async (accessToken, setCookie, navigate) => {
    return requestWithTokenHandling(
        (token) => axios.get(GET_CZ_AUTH_TYPE(), authorization(token)),
        accessToken, setCookie, navigate, "getczauthtypetRequest"
    );
};


export const refreshTokenRequest = async (setCookie, accessToken, navigate, apiName) => {
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
                    "Authorization": `Bearer ${accessToken}`
                },
                withCredentials: true
            }
        );

        if (response.data.code === "SU") {
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.headers['refresh-token'];

            setCookie('accessToken', newAccessToken, { path: '/', expires: new Date(Date.now() + 3600 * 1000) });
            if (newRefreshToken) {
                setCookie('refreshToken', newRefreshToken, { path: '/', httpOnly: true, secure: true });
            }

            console.log(`✅ [${apiName}] 토큰 재발급 성공:`, newAccessToken);
            return { accessToken: newAccessToken, apiName };
        } else {
            console.error(`[${apiName}] [토큰 재발급 실패] 응답:`, response.data.message);
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

