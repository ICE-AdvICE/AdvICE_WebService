import axios from 'axios';
 
const DOMAIN = 'http://localhost:8080';

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

// 1-10 사용자 정지 부여 API
export const giveBanToUser = async (navigate,articleNum, token, banDuration, banReason) => {
    try {
        const banDetails = {
            banDuration: banDuration,
            banReason: banReason
        };
        const response = await axios.post(GIVE_BAN_URL(articleNum), banDetails, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            return { code: 'SU' };
        } else {
            return { code: response.data.code, message: response.data.message };
        }
    } catch (error) {
        if (error.response) {
            const errorCode = error.response.data.code;
            switch (errorCode) {
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
export const createNotificationArticleRequest = async (postData, token) => {
    try {
        const response = await axios.post(CREATE_NOTIFICATION_ARTICLE_URL(), postData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code == "SU"){
            return true;
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
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
                    console.log("데이터베이스에 문제가 발생했습니다");
                    break;
                default:
                    console.log("예상치 못한 오류가 발생했습니다.");
                    break;
            }
        }
        return false;  
    }

};
//15. (Admin)게시글 삭제 API
export const adminhandleDelete = async (articleNum, token, navigate) => {  
    if (window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
        try {
            const response = await axios.delete(ADMIN_DELETE_ARTICLE_URL(articleNum), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.code === "SU") {  
                alert("게시글이 삭제되었습니다.");
                navigate('/article-main');
            } 
        } catch (error) {
            if (error.response) {
                switch (error.response.data.code) {
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
                        console.log("데이터베이스에 문제가 발생했습니다");
                        break;
                    default:
                        console.log("예상치 못한 문제가 발생하였습니다.");
                        break;
                }
            } 
        }
    }
};
//16.(Admin) 해결이 필요한 게시글을 해결된 게시글로 변경을 위한 API
export const handleResolveArticle = async (navigate,articleNum, token) => {
    try {
        const response = await axios.put(RESOLVE_ARTICLE_URL(articleNum), {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { code } = response.data;
        if (code === "SU") {
            console.log('게시글이 정상적으로 해결되었습니다.');
            navigate('/article-main');
            return true;
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "AF":
                    alert("권한이 없습니다");
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
export const checkAnonymousBoardAdmin = async (token) => {
    try {
        const response = await axios.get(CHECK_ANONYMOUS_BOARD_ADMIN_URL(), {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code == "SU"){
            return true;
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
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
