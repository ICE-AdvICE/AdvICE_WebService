
import axios from 'axios';
 
 

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const CHECK_USER_BAN_STATUS_URL = () => `${API_DOMAIN}/auth/check-user-ban`;
const LIKE_ARTICLE_URL = (articleNum) => `${API_DOMAIN}/article/${articleNum}/like`;
const FETCH_USER_ARTICLES_URL = () => `${API_DOMAIN}/article/user-list`;
const GET_LIKE_STATUS_URL = (articleNum) => `${API_DOMAIN}/article/${articleNum}/like`;
const CHECK_OWNERSHIP_URL = (articleNum) => `${API_DOMAIN}/article/own/${articleNum}`;
// 6.게시글 좋아요 누르기/취소하기  API
export const handleLike = async (navigate,articleNum, liked, token, setLiked, setLikes) => {
    try {
        const response = await axios.put(LIKE_ARTICLE_URL(articleNum), {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { code } = response.data;
        if (code === "SU") {
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
        }
    } catch (err) {
        if (err.response) {
            const { code } = err.response.data;
            switch (code) {
                case "NA":
                    alert("존재하지 않는 게시글입니다.");
                    navigate('/article-main');
                    break;
                case "DBE":
                    console.log("데이터베이스 오류가 발생했습니다.");
                    break;
                case "NU":
                    alert("로그인이 필요합니다.");
                    navigate('/');
                    break;
                case "VF":
                    console.log("유효성 검사 실패하였습니다.");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        } 
    }
};
//1-11 사용자 정지확인 api
export const checkUserBanStatus = async (token) => {
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
                banEndTime: data.badEndTime

            };
        } else {
            return {
                banned: false
            };
        }
    } catch (error) {     
        if (error.response) {
            const errorCode = error.response.data.code;
            switch (errorCode) {
                case "DBE":
                    console.log("데이터베이스 오류가 발생했습니다.");
                    break;
                default:
                    console.log("알 수 없는 오류 코드:", errorCode);
            }
        }
        return {
            banned: false,
            error: true
        };
    }
};
// 12.“내가 쓴” 모든 게시글 리스트 불러오기 API
export const fetchUserArticles = async (navigate,token) => {
    try {
        const response = await axios.get(FETCH_USER_ARTICLES_URL(), {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            return response.data.userArticleList; 
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    alert("로그인이 필요합니다.");
                    navigate('/');
                    break;
                case "VF":
                    console.log("유효성 검사 실패했습니다.");
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
// 13.특정 게시글 좋아요 여부 API
export const fetchLikeStatus = async (articleNum, token, setLiked) => {
    try {
        const response = await axios.get(GET_LIKE_STATUS_URL(articleNum), {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { code } = response.data;
        setLiked(code === "SU");  
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "SN":
                    console.log("이 계정은 좋아요를 누르지 않음")
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
            }
        }
        return false;    
    }
};
// 14. 특정 게시글 소유 여부 API
export const checkArticleOwnership = async (navigate,articleNum, token) => {
    try {
        const response = await axios.get(CHECK_OWNERSHIP_URL(articleNum), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; 
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NA":
                    console.log("해당 게시글이 없습니다.");
                    navigate('/article-main');
                    break;
                case "NU":
                    console.log("로그인이 필요합니다.");
                    navigate('/');
                    break;
                case "NP":
                    console.log("게시글 작성자가 아닙니다.");
                    break;
                    
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
              
            }
        }
        return false;  
        
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