import axios from 'axios';
import { refreshTokenRequest } from '../../shared/api/AuthApi';
const DOMAIN = process.env.REACT_APP_API_DOMAIN;
const API_DOMAIN = `${DOMAIN}/api/v1`;
const DELETE_USER = () => `${API_DOMAIN}/user`; // 회원탈퇴
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`; // 로그인
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`; // 회원가입
const PATCH_MYPAGE_USER_URL = () => `${API_DOMAIN}/user`; // 마이페이지_개인정보 수정
const PATCH_PW_URL = () => `${API_DOMAIN}/user/password`;
const LOGOUT_URL = () => `${API_DOMAIN}/auth/logout`;

axios.defaults.withCredentials = true;


const requestWithTokenHandling = async (apiCall, accessToken, setCookie, navigate, retryData = null) => {
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
            console.warn("Access Token 만료됨. 토큰 재발급 시도 중...");
            const newToken = await refreshTokenRequest(setCookie, accessToken, navigate);

            if (newToken?.accessToken) {
                console.log("Access Token이 재발급됨. 다시 요청 수행...");
                return requestWithTokenHandling(apiCall, newToken.accessToken, setCookie, navigate, retryData);
            } else {

                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return null;
            }
        }

        return error.response.data;
    }
};


// 1. 사용자 회원가입 API
export const signUpRequest = async (requestBody) => {
    try {
        const response = await axios.post(SIGN_UP_URL(), requestBody);
        return response.data;
    } catch (error) {
        return error.response?.data || null;
    }
};

// 2. 사용자 로그인 API
export const signInRequest = async (requestBody, setCookie) => {
    try {
        const response = await axios.post(SIGN_IN_URL(), requestBody, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
        });
        const accessToken = response.data.accessToken;
        const refreshToken = response.headers['refresh-token'];

        setCookie('accessToken', accessToken, { path: '/', expires: new Date(Date.now() + 3600 * 1000) });
        if (refreshToken) {
            setCookie('refreshToken', refreshToken, { path: '/', httpOnly: true, secure: true });
        }

        return { data: response.data, headers: response.headers };
    } catch (error) {
        //alert('로그인 요청 중 오류 발생! 서버 응답: ' + JSON.stringify(error.response, null, 2));
        return { data: { code: 'ERROR', message: '로그인 요청 중 오류 발생' }, headers: {} };
    }
};

// 4. 사용자 정보 수정 API
export const updateMypageUserRequest = async (userData, accessToken, setCookie, navigate) => {
    return requestWithTokenHandling(
        (token) => axios.patch(PATCH_MYPAGE_USER_URL(), userData, { headers: { Authorization: `Bearer ${token}` } }),
        accessToken, setCookie, navigate, userData
    );
};

// 5. 사용자 비밀번호 변경 API
export const pwUpdateRequest = async (userData, accessToken, setCookie, navigate) => {
    return requestWithTokenHandling(
        (token) => axios.patch(PATCH_PW_URL(), userData, { headers: { Authorization: `Bearer ${token}` } }),
        accessToken, setCookie, navigate
    );
};

// 6. 사용자 탈퇴 API
export const deleteUserRequest = async (accessToken, setCookie, navigate) => {
    return requestWithTokenHandling(
        (token) => axios.delete(DELETE_USER(), { headers: { Authorization: `Bearer ${token}` } }),
        accessToken, setCookie, navigate
    );
};

// 7. 사용자 로그아웃 API
export const logoutRequest = async (accessToken, setCookie, navigate) => {
    try {
        const response = await axios.delete(LOGOUT_URL(), {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true
        });


        return response.data;
    } catch (error) {


        // Access Token이 만료된 경우 (ATE)
        if (error.response?.status === 401 || error.response?.data?.code === "ATE") {


            // 새로운 Access Token 요청 (refreshToken을 매개변수로 전달하지 않음)
            const newToken = await refreshTokenRequest(setCookie, accessToken, navigate);

            if (newToken?.accessToken) {
                console.log("새 Access Token을 사용하여 로그아웃 재시도...");
                return logoutRequest(newToken.accessToken, setCookie, navigate);
            } else {
                // alert("토큰 재발급 실패, 강제 로그아웃 실행");

                // 쿠키 삭제 개선 (expires 설정)
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                setCookie('refreshToken', '', { path: '/', expires: new Date(0) });

                navigate('/'); // 메인 페이지로 이동
                return { code: "RF_FAIL", message: "Token refresh failed, user logged out." };
            }
        }

        return error.response?.data || { code: "UN", message: "Unexpected error occurred." };
    }
};
