import axios from 'axios';

const DOMAIN = process.env.REACT_APP_API_DOMAIN;
const API_DOMAIN = `${DOMAIN}/api/v1`;
const GET_MYPAGE_USER_URL = () => `${API_DOMAIN}/user`; // 마이페이지_개인정보
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_CZ_AUTH_TYPE = () => `${API_DOMAIN}/coding-zone/auth-type`;
const REFRESH_TOKEN_URL = () => `${API_DOMAIN}/auth/refresh`;

const authorization = (accessToken) => ({
    headers: { Authorization: `Bearer ${accessToken}` }
});

export const getSignInUserRequest = async (accessToken, setCookie, navigate) => {
    try {
        const response = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response) {
            return;
        }
        const { code } = error.response.data;
        switch (code) {
            case "NA":

                break;
            case "ATE": // Access Token 만료 처리
                console.warn("Access Token 만료됨. 토큰 재발급 시도 중...");
                const newToken = await refreshTokenRequest(setCookie, accessToken, navigate);
                if (newToken?.accessToken) {
                    return getSignInUserRequest(newToken.accessToken, setCookie, navigate);
                } else {

                    setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                    navigate('/');
                    return null;
                }
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다");
                break;
            default:
                console.log("예상치 못한 문제가 발생하였습니다.");
                break;
        }
    }
};

export const getMypageRequest = async (accessToken, setCookie, navigate, closeModal) => {
    try {
        const response = await axios.get(GET_MYPAGE_USER_URL(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response) {
            return;
        }
        const { code } = error.response.data;
        switch (code) {
            case "NA":
                break;
            case "ATE": // Access Token 만료 처리
                console.warn("Access Token 만료됨. 토큰 재발급 시도 중...");
                const newToken = await refreshTokenRequest(setCookie, accessToken, navigate);
                if (newToken?.accessToken) {
                    return getMypageRequest(newToken.accessToken, setCookie, navigate, closeModal);
                } else {
                    setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                    navigate('/');
                    closeModal(); // ✅ 모달 닫기 추가
                    return null;
                }
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다");
                break;
            default:
                console.log("예상치 못한 문제가 발생하였습니다.");
                break;
        }
    }
};

export const getczauthtypetRequest = async (accessToken, setCookie, navigate, closeModal) => {
    try {
        const response = await axios.get(GET_CZ_AUTH_TYPE(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response) {
            return;
        }
        const { code } = error.response.data;
        switch (code) {
            case "NA":
                alert("존재하지 않는 게시글입니다.");
                navigate(`/article-main`);
                break;
            case "ATE": // Access Token 만료 처리
                console.warn("Access Token 만료됨. 토큰 재발급 시도 중...");
                const newToken = await refreshTokenRequest(setCookie, accessToken, navigate);
                if (newToken?.accessToken) {
                    return getczauthtypetRequest(newToken.accessToken, setCookie, navigate, closeModal);
                } else {
                    setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                    navigate('/');
                    closeModal(); // ✅ 모달 닫기 추가
                    return null;
                }
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다");
                break;
            default:
                console.log("예상치 못한 문제가 발생하였습니다.");
                break;
        }
    }
};



let isRefreshing = false;
let refreshSubscribers = [];
export const refreshTokenRequest = async (setCookie, accessToken, navigate, apiName) => {
    if (isRefreshing) {
        return new Promise((resolve) => {
            refreshSubscribers.push((newToken) => resolve({ accessToken: newToken, apiName }));
        });
    }

    isRefreshing = true;
    try {
        if (!accessToken) {
            alert("액세스 토큰이 없습니다. 로그인 페이지로 이동합니다.");
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

        //alert(`서버 응답: ${JSON.stringify(response?.data)}`);

        if (response?.data?.code === "SU") {
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.headers['refresh-token'];

            setCookie('accessToken', newAccessToken, { path: '/', expires: new Date(Date.now() + 3600 * 1000) });
            if (newRefreshToken) {
                setCookie('refreshToken', newRefreshToken, { path: '/', httpOnly: true, secure: true });
            }

           // alert(`[${apiName}] 토큰 재발급 성공: ${newAccessToken}`);

            refreshSubscribers.forEach((callback) => callback(newAccessToken));
            refreshSubscribers = [];

            return { accessToken: newAccessToken, apiName };
        } else {
            //alert(`[${apiName}] 토큰 재발급 실패 - 코드: ${response?.data?.code}`);

            if (response?.data?.code === "NP") {
                alert("😵로그인 기간이 만료되었습니다. 재로그인 해주세요.😵");
                navigate('/');
                return null;
            } else if (response?.data?.code === "DBE") {
                alert("데이터베이스 오류 발생: " + response.data.message);
                return null;
            }
        }
    } catch (error) {
        //alert("토큰 갱신 중 오류 발생: " + error);

        if (error.response) {
            //alert(`에러 응답 데이터: ${JSON.stringify(error.response.data)}`);
            if (error.response.data?.code === "NP") {
                alert("😵로그인 기간이 만료되었습니다. 재로그인 해주세요.😵");
                navigate('/');
                return null;
            }
        }

        alert("다시 로그인해 주세요.");
        navigate('/');
        return null;
    } finally {
        isRefreshing = false;
    }
};
