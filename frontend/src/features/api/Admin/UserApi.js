import axios from 'axios';
import { refreshTokenRequest } from '../../../shared/api/AuthApi';
const DOMAIN = process.env.REACT_APP_API_DOMAIN;

const API_ADMIN_DOMAIN = `${DOMAIN}/api/admin1`;
const API_DOMAIN = `${DOMAIN}/api/v1`;
const authorization = (accessToken) => {
    return {headers: {Authorization:`Bearer ${accessToken}`}}
};
const CREATE_NOTIFICATION_ARTICLE_URL = () => `${API_ADMIN_DOMAIN}/article`;

const GIVE_BAN_URL = (articleNum) => `${API_ADMIN_DOMAIN}/give-ban/${articleNum}`;
const ADMIN_DELETE_ARTICLE_URL = (articleNum) => `${API_ADMIN_DOMAIN}/${articleNum}`;
const RESOLVE_ARTICLE_URL = (articleNum) => `${API_ADMIN_DOMAIN}/${articleNum}/resolv`;
const CHECK_ANONYMOUS_BOARD_ADMIN_URL = () => `${API_DOMAIN}/user/auth1-exist`;
const CHECK_ADMIN_TYPE_URL = () => `${API_DOMAIN}/coding-zone/auth-type`;



// 1-10 사용자 정지 부여 API
export const giveBanToUser = async (navigate, articleNum, token, banDuration, banReason, setCookie) => {
    try {
        const banDetails = { banDuration, banReason };
        const response = await axios.post(GIVE_BAN_URL(articleNum), banDetails, authorization(token));

        if (response.data.code === "SU") {
            return { code: 'SU' };
        }
    } catch (error) {
        if (error.response) {
            const errorCode = error.response.data.code;
            switch (errorCode) {
                case "ATE":
                    console.warn("🔄 Access Token 만료됨. 토큰 재발급 시도 중...");
                    const newToken = await refreshTokenRequest(setCookie, token, navigate);
                    if (newToken?.accessToken) {
                      
                        return giveBanToUser(navigate, articleNum, newToken.accessToken, banDuration, banReason, setCookie);
                    } else {
                        alert("❌ 토큰 재발급 실패. 다시 로그인해주세요.");
                        setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                        navigate('/');
                        return false;
                    }
                case "AF":
                    console.log("권한이 없습니다.");
                    break;
                case "VF":
                    console.log("유효성 검사 실패하였습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스 오류가 발생했습니다.");
                    break;
                case "DE":
                    alert("이미 정지된 사용자입니다.");
                    break;
                case "WDE":
                    alert("탈퇴한 사용자입니다.");
                    break;
                case "NA":
                    alert("해당 게시글이 존재하지 않습니다.");
                    navigate('/article-main');
                    break;
                default:
                    console.log("예기치 않은 오류가 발생했습니다.");
                    break;
            }
        }
        return false;
    }
};



//2.(Admin) 공지글을 등록하는 API
export const createNotificationArticleRequest = async (postData, token, setCookie, navigate) => {
    try {
        const response = await axios.post(CREATE_NOTIFICATION_ARTICLE_URL(), postData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.code === "SU") {
            return response.data;
        }
    } catch (error) {
        if (!error.response) return false;
        const { code } = error.response.data;

        if (code === "ATE") {
            console.warn("🔄 공지글 등록: Access Token 만료됨. 토큰 재발급 시도 중...");
            const newToken = await refreshTokenRequest(setCookie, token, navigate);

            if (newToken?.accessToken) {
                alert("🔄 공지글 등록: 토큰이 재발급되었습니다. 다시 시도합니다.");
                return createNotificationArticleRequest(postData, newToken.accessToken, setCookie, navigate);
            } else {
                alert("❌ 공지글 등록: 토큰 재발급 실패. 다시 로그인해주세요.");
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return false;
            }
        }
        switch (code) {
            case "NU":
                alert("로그인이 필요합니다.");
                break;
            case "AF":
                alert("공지글 올릴 수 있는 권한이 없습니다.");
                break;
            case "VF":
                console.log("유효성 검사 실패하였습니다.");
                break;
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다.");
                break;
            default:
                console.log("예상치 못한 오류가 발생했습니다.");
                break;
        }
    }
    return false;
};

//15. (Admin)게시글 삭제 API
export const adminhandleDelete = async (articleNum, token, navigate, setCookie) => {
    try {
        const response = await axios.delete(ADMIN_DELETE_ARTICLE_URL(articleNum), {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.code === "SU") {
            if (window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
                alert("게시글이 삭제되었습니다.");
                navigate('/article-main');
            }
            return true;
        }
    } catch (error) {
        if (!error.response) return false;
        const { code } = error.response.data;

        if (code === "ATE") {
            console.warn("🔄 게시글 삭제: Access Token 만료됨. 토큰 재발급 시도 중...");
            const newToken = await refreshTokenRequest(setCookie, token, navigate);

            if (newToken?.accessToken) {
                alert("🔑 게시글 삭제: 토큰이 재발급되었습니다. 다시 시도합니다.");
                return adminhandleDelete(articleNum, newToken.accessToken, navigate, setCookie);
            } else {
                alert("❌ 게시글 삭제: 토큰 재발급 실패. 다시 로그인해주세요.");
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return false;
            }
        }

        switch (code) {
            case "NA":
                alert("해당 게시글이 존재하지 않습니다.");
                navigate('/article-main');
                break;
            case "AF":
                alert("게시글 삭제 권한이 없습니다.");
                break;
            case "NU":
                alert("로그인이 필요합니다.");
                navigate('/');
                break;
            case "VF":
                console.log("유효성 검사 실패하였습니다.");
                break;
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다.");
                break;
            default:
                console.log("예상치 못한 오류가 발생했습니다.");
                break;
        }
    }
    return false;
};


//16.(Admin) 해결이 필요한 게시글을 해결된 게시글로 변경을 위한 API
export const handleResolveArticle = async (navigate, articleNum, token, setCookie) => {
    try {
        const response = await axios.put(RESOLVE_ARTICLE_URL(articleNum), {}, authorization(token));
        const { code } = response.data;
        if (code === "SU") {
            console.log('✅ 게시글이 정상적으로 해결되었습니다.');
            navigate('/article-main');
            return true;
        }
    } catch (error) {
        if (error.response) {
            const errorCode = error.response.data.code;
            switch (errorCode) {
                case "ATE":
                    console.warn("🔄 Access Token 만료됨. 토큰 재발급 시도 중...");
                    const newToken = await refreshTokenRequest(setCookie, token, navigate);
                    if (newToken?.accessToken) {
                        alert("🔑 토큰이 성공적으로 재발급되었습니다. 다시 시도합니다.(해결)");
                        return handleResolveArticle(navigate, articleNum, newToken.accessToken, setCookie);
                    } else {
                        alert("❌ 토큰 재발급 실패. 다시 로그인해주세요.");
                        setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                        navigate('/');
                        return false;
                    }
                case "AF":
                    alert("권한이 없습니다.");
                    break;
                case "NA":
                    alert("해당 게시글이 존재하지 않습니다.");
                    navigate('/article-main');
                    break;
                case "NU":
                    alert("로그인이 필요합니다.");
                    navigate('/');
                    break;
                case "VF":
                    console.log("유효성 검사 실패하였습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        }
        return false;
    }
};

//17. "익명게시판" 운영자 판별 API
export const checkAnonymousBoardAdmin = async (token, setCookie, navigate) => {
    try {
        const response = await axios.get(CHECK_ANONYMOUS_BOARD_ADMIN_URL(), authorization(token));
        if (response.data.code === "SU") {
            return true;
        }
    } catch (error) {
        if (error.response) {
            const errorCode = error.response.data.code;
            switch (errorCode) {
                case "ATE":
                    console.warn("Access Token 만료됨. 토큰 재발급 시도 중...");
                    const newToken = await refreshTokenRequest(setCookie, token, navigate);
                    if (newToken?.accessToken) {
                        return checkAnonymousBoardAdmin(newToken.accessToken, setCookie, navigate);
                    } else {
                        setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                        navigate('/');
                        return false;
                    }
                case "SN":
                    console.log("익명게시판 권한이 없습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        }
        return false;
    }
};


// 7. 운영자 권한 종류 확인 API
// ✅ 운영자 권한 종류 확인 API (ATE 처리 추가)
export const checkAdminType = async (token, setCookie, navigate) => {
    try {
        const response = await axios.get(CHECK_ADMIN_TYPE_URL(), authorization(token));

        if (response.data.code === "SU") {
            return "SU";
        } else if (response.data.code === "EA") {
            return "EA";  
        } else if (response.data.code === "CA") {
            return "CA";  
        }
    } catch (error) {
        if (!error.response) {
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }

        const { code } = error.response.data;

        if (code === "ATE") {
            console.warn("🔄 운영자 권한 확인: Access Token 만료됨. 토큰 재발급 시도 중...");
            const newToken = await refreshTokenRequest(setCookie, token, navigate);

            if (newToken?.accessToken) {
                alert("🔄 운영자 권한 확인: 토큰이 재발급되었습니다. 다시 시도합니다.");
                return checkAdminType(newToken.accessToken, setCookie, navigate);
            } else {
                alert("❌ 운영자 권한 확인: 토큰 재발급 실패. 다시 로그인해주세요.");
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return { code: 'TOKEN_EXPIRED', message: '토큰이 만료되었습니다. 다시 로그인해주세요.' };
            }
        }

        switch (code) {
            case "NU":
                console.log("사용자가 존재하지 않습니다.");
                break;
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다.");
                break;
            default:
                console.log("예상치 못한 문제가 발생하였습니다.");
                break;
        }
    }
    return false;   
};


