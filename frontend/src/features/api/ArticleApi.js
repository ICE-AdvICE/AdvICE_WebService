
import axios from 'axios';
import { refreshTokenRequest } from '../../shared/api/AuthApi';
 

//const DOMAIN = 'http://localhost:8080';
const DOMAIN = 'http://54.180.165.91:8080'; 
const API_DOMAIN = `${DOMAIN}/api/v1`;

const CHECK_USER_BAN_STATUS_URL = () => `${API_DOMAIN}/auth/check-user-ban`;
const LIKE_ARTICLE_URL = (articleNum) => `${API_DOMAIN}/article/${articleNum}/like`;
const FETCH_USER_ARTICLES_URL = () => `${API_DOMAIN}/article/user-list`;
const GET_LIKE_STATUS_URL = (articleNum) => `${API_DOMAIN}/article/${articleNum}/like`;
const CHECK_OWNERSHIP_URL = (articleNum) => `${API_DOMAIN}/article/own/${articleNum}`;

const handleApiError = async (error, apiCall, token, setCookie, navigate, apiName) => {
    if (!error.response || !error.response.data) {
        alert(`🔴 ${apiName} 요청 실패: 네트워크 상태를 확인해주세요.`);
        return null;
    }

    const { code } = error.response.data;

    if (code === "ATE") {
        console.warn(`🔄 ${apiName}: Access Token 만료됨. 토큰 재발급 시도 중...`);
        const newToken = await refreshTokenRequest(setCookie, token, navigate);

        if (newToken?.accessToken) {
            alert(`🔄 ${apiName}: 토큰이 재발급되었습니다. 다시 시도합니다.`);
            return apiCall(newToken.accessToken);
        } else {
            alert(`🔴 ${apiName}: 토큰 재발급 실패. 다시 로그인해주세요.`);
            setCookie('accessToken', '', { path: '/', expires: new Date(0) });
            navigate('/');
            return null;
        }
    }

    return error.response.data;
};

// ✅ 1-11 사용자 정지 확인 API (공통 ATE 처리 적용)
export const checkUserBanStatus = async (token, setCookie, navigate) => {
    try {
        const response = await axios.post(CHECK_USER_BAN_STATUS_URL(), {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { data } = response;

        if (data.email !== null) {
            return {
                banned: true,
                details: data,
                banReason: data.banReason,
                banDuration: data.banDuration,
                banEndTime: data.banEndTime
            };
        } else {
            return { banned: false };
        }
    } catch (error) {
        return await handleApiError(error, (newToken) => checkUserBanStatus(newToken, setCookie, navigate), token, setCookie, navigate, "사용자 정지 확인");
    }
};

// ✅ 12. “내가 쓴” 모든 게시글 리스트 불러오기 API (공통 ATE 처리 적용)
export const fetchUserArticles = async (navigate, token, setCookie) => {
    try {
        const response = await axios.get(FETCH_USER_ARTICLES_URL(), {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            return response.data.userArticleList;
        }
        return false;
    } catch (error) {
        return await handleApiError(error, (newToken) => fetchUserArticles(navigate, newToken, setCookie), token, setCookie, navigate, "내가 쓴 게시글 불러오기");
    }
};
// ✅ 6. 게시글 좋아요 누르기/취소하기 API (ATE 처리 추가)
export const handleLike = async (navigate, articleNum, liked, token, setLiked, setLikes, setCookie) => {
    try {
        const response = await axios.put(LIKE_ARTICLE_URL(articleNum), {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { code } = response.data;
        if (code === "SU") {
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
        }
    } catch (error) {
        return await handleApiError(
            error, 
            (newToken) => handleLike(navigate, articleNum, liked, newToken, setLiked, setLikes, setCookie),
            token, 
            setCookie, 
            navigate, 
            "게시글 좋아요"
        );
    }
};

// ✅ 13. 특정 게시글 좋아요 여부 API (ATE 처리 추가)
export const fetchLikeStatus = async (articleNum, token, setLiked, setCookie, navigate) => {
    try {
        const response = await axios.get(GET_LIKE_STATUS_URL(articleNum), {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { code } = response.data;
        setLiked(code === "SU");
    } catch (error) {
        return await handleApiError(
            error, 
            (newToken) => fetchLikeStatus(articleNum, newToken, setLiked, setCookie, navigate),
            token, 
            setCookie, 
            navigate, 
            "좋아요 상태 조회"
        );
    }
};

// ✅ 14. 특정 게시글 소유 여부 API (ATE 처리 추가)
export const checkArticleOwnership = async (navigate, articleNum, token, setCookie) => {
    try {
        const response = await axios.get(CHECK_OWNERSHIP_URL(articleNum), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return await handleApiError(
            error, 
            (newToken) => checkArticleOwnership(navigate, articleNum, newToken, setCookie),
            token, 
            setCookie, 
            navigate, 
            "게시글 소유 여부 확인"
        );
    }
};
      
//정지 확인 API
const POST_CHECK_USER_BAN_URL = () => `${API_DOMAIN}/auth/check-user-ban`; 

export const checkuserbanRequest = async (email, token) => {
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const result = await axios.post(POST_CHECK_USER_BAN_URL(), { email }, { headers })
        .then(response => {
            const responseBody = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response || !error.response.data) return null;
            const responseBody = error.response.data;
            return responseBody;
        });
    return result;
};