import axios from 'axios';
import moment from 'moment';

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;
const API_ADMIN_DOMAIN = `${DOMAIN}/api/admin`;

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`; //로그인
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`; // 회원가입 
const GET_ARTICLE_LIST_URL = () => `${API_DOMAIN}/article/list`; 
const Email_Certification_URL = () => `${API_DOMAIN}/auth/email-certification`; //인증번호 전송
const Check_Certification_URL = () => `${API_DOMAIN}/auth/check-certification`; //인증번호 인증
const GET_MYPAGE_USER_URL = () => `${API_DOMAIN}/user`; //마이페이지_개인정보 
const PATCH_MYPAGE_USER_URL=() =>`${API_DOMAIN}/user`; //마이페이지_개인정보 수정
const POST_PW_CHANGE_URL =() => `${API_DOMAIN}/auth/password-change/email-certification`;
const PATCH_PW_URL=() =>`${API_DOMAIN}/user/password`;
const DELETE_USER =()=> `${API_DOMAIN}/user`; //회원탈퇴 
const GET_SIGN_IN_USER_URL =() =>`${API_DOMAIN}/user`;
const authorization = (accessToken) => {
    return {headers: {Authorization:`Bearer ${accessToken}`}}
};

const COMMENT_WRITE = (articleNum) => `${API_DOMAIN}/article/${articleNum}/comment`;
const EDIT_ARTICLE = (articleNum) => `${API_DOMAIN}/article/${articleNum}`;


// 1-10사용자 정지 부여 API
export const giveBanToUser = async (articleNum, token, banDuration, banReason) => {
    try {
        const banDetails = {
            banDuration: banDuration,
            banReason: banReason
        };
        const response = await axios.post(`${API_ADMIN_DOMAIN}/give-ban/${articleNum}`, banDetails, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            alert("정지가 성공적으로 부여되었습니다.");
            return { code: 'SU' };
        } else {
            alert(`사용자 정지 실패: ${response.data.message}`);
            return { code: response.data.code, message: response.data.message };
        }
    } catch (error) {
        if (error.response) {
            const errorCode = error.response.data.code;
            switch (errorCode) {
                case "AF":
                    alert("권한이 없습니다.");
                    break;
                case "VF":
                    alert("유효성 검사 실패.");
                    break;
                case "DBE":
                    alert("데이터베이스 오류가 발생했습니다.");
                    break;
                case "DE":
                    alert("이미 정지된 사용자입니다.");
                    break;
                case "WDE":
                    alert("탈퇴한 사용자입니다.");
                    break;
                case "NA":
                    alert("해당 게시글이 존재하지 않습니다.");
                    break;
                default:
                    alert("예기치 않은 오류가 발생했습니다.");
                    break;
            }
        }
        return false;
    }
};

//1-11사용자 정지확인 api
export const checkUserBanStatus = async (token) => {
    try {
        const response = await axios.post(`${API_DOMAIN}/auth/check-user-ban`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { data } = response; 
        if (data.email !== null) {
            return {
                banned: true,
                details: data
            };
        } else {
            return {
                banned: false
            };
        }
    } catch (error) {
        console.error('사용자 정지 확인 중 오류 발생:', error);
        if (error.response) {
            const errorCode = error.response.data.code;
            switch (errorCode) {
                case "DBE":
                    alert("데이터베이스 오류가 발생했습니다.");
            }
        }
        return {
            banned: false,
            error: true
        };
    }
};

//1. 게시물(일반,요청)을 등록하는 API
export const createArticleRequest = async (postData, accessToken) => {
    try {
        const response = await axios.post(`${API_DOMAIN}/article`, postData, authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};
//2.(Admin) 공지글을 등록하는 API
export const createNotificationArticleRequest = async (postData, token) => {
    try {
        const response = await axios.post(`${API_ADMIN_DOMAIN}/article`, postData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code == "SU"){
            return true;
        }
    } catch (error) {
        console.error('Error creating notification article:', error);
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    alert("로그인을 다시 해주세요");
                    break;
                case "AF":
                    alert("공지글 올릴 수 있는 권한이 없습니다.");
                    break;
                case "VF":
                    alert("Validation failed.");
                    break;
                case "DBE":
                    alert("데이터베이스에 문제가 발생했습니다");
                    break;
                default:
                    alert("예상치 못한 오류가 발생했습니다.");
                    break;
            }
        }
        return false;  
    }

};
/*3.특정 게시물을 불러오는 API
export const fetchArticle = async (articleNum) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/article`, postData, authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};
*/

// 4.게시글 수정 API
export const handleEdit = async (articleNum, token, navigate, setCanEdit, article) => {
    if (!article) {
        console.error("게시글을 다시 확인해주세요.");
    }
    const updatedArticle = {
        articleTitle: article.articleTitle,
        articleContent: article.body
    };
    try {
        const response = await axios.patch(EDIT_ARTICLE(articleNum), updatedArticle, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            console.log('게시글이 정상적으로 작성되었습니다.');
            setCanEdit(true);
            navigate(`/article-main/${articleNum}/edit`);
        } else if (response.data.code === "NA") {
            alert("This article does not exist.");
        } else if (response.data.code === "NU") {
            alert("This user does not exist.");
        } else if (response.data.code === "VF") {
            alert("Validation failed.");
        } else if (response.data.code === "DBE") {
            alert("데이터베이스에 문제가 발생했습니다");
        } else {
            console.error('Failed to update article:', response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error updating the article:', error);
    }
};

// 5.게시글 삭제 api
export const handleDelete = async (articleNum, token, navigate) => {  
    if (window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
        try {
            const response = await axios.delete(`${API_DOMAIN}/article/${articleNum}`, {
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
                        alert("존재하지 않는 게시글입니다.");
                        break;
                    case "NU":
                        alert("로그인을 다시해주세요.");
                        break;
                    case "VF":
                        alert("Validation failed.");
                        break;
                    case "NP":
                        alert("삭제할 수 있는 권한이 없습니다.");
                        break;
                    case "DBE":
                        alert("데이터베이스에 문제가 발생했습니다");
                        break;
                    default:
                        alert("예상치 못한 문제가 발생하였습니다.");
                        break;
                }
            } 
        }
    }
};
// 7.(Admin)게시글 댓글 작성 API
export const handleCommentSubmit = async (event, commentInput, setComments, setCommentInput, userEmail, articleNum, token) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!commentInput.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        const commentData = {
            content: commentInput,
            user_email: userEmail
        };
        try {
            const response = await axios.post(`${API_ADMIN_DOMAIN}/${articleNum}/comment`, commentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.code === "SU") {
                fetchComments(articleNum, token, setComments);
                setCommentInput("");
            } else {
                switch (response.data.code) {
                    case "NA":
                        alert("This article does not exist.");
                        break;
                    case "NU":
                        alert("This user does not exist.");
                        break;
                    case "VF":
                        alert("Validation failed.");
                        break;
                    case "DBE":
                        alert("데이터베이스에 문제가 발생했습니다");
                        break;
                    default:
                        alert("예상치 못한 문제가 발생하였습니다.");
                        break;
                }
            }
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    }
};
//10. (Admin)댓글 삭제 API
export const adminhandleDelete = async (articleNum, token, navigate) => {  
    if (window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
        try {
            const response = await axios.delete(`http://localhost:4000/api/admin1/${articleNum}`, {
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
                        alert("This article does not exist.");
                        break;
                    case "NU":
                        alert("This user does not exist.");
                        break;
                    case "VF":
                        alert("Validation failed.");
                        break;
                    case "NP":
                        alert("Do not have permission.");
                        break;
                    case "DBE":
                        alert("데이터베이스에 문제가 발생했습니다");
                        break;
                    default:
                        alert("예상치 못한 문제가 발생하였습니다.");
                        break;
                }
            } 
        }
    }
};
//11.모든 게시글을 리스트 형태로 불러오는 API
export const getArticleListRequest = async () => {
    const result = await axios.get(GET_ARTICLE_LIST_URL())
        .then(response => {
            const responseBody = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody = error.response.data;    
            if (responseBody.code === "DBE") {
                alert("Database error.");  
            }             
            return responseBody;
        })
    return result;
};


//수정
export const updateArticleRequest = async (articleNum, updateData, accessToken) => {
    try {
        const response = await axios.patch(`${API_DOMAIN}/article/${articleNum}`, updateData, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};


export const getSignInUserRequest = async (accessToken) => {
    try {
        const response = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};




export const signUpRequest = async (requestBody) => {
    
    const result = await axios.post(SIGN_UP_URL(), requestBody) //await은 요청의 응답이 돌아올 떄 까지 함수 실행을 멈추는 역할 한다(asyns함수 안에서만 사용가능)
    .then(response => {

        const responseBody = response.data;// responseBody의 key값들이: code, message, token, expirationTime
        
        return responseBody;
    })
    .catch(error => {
        if (!error.response || !error.response.data) return null; //예상하지못한 error를 0으로 반환
        const responseBody = error.response.data;                 //예상했던 error를 code와message로 반환
        return responseBody;
    });
return result;
};
export const fetchComments = (articleNum, token, setComments) => {
    axios.get(`http://localhost:4000/api/v1/article/${articleNum}/comment-list`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        const comments = response.data.commentList;
        const formattedComments = comments.map(comment => {
            return {
                commentNumber: comment.commentNumber,
                writeDatetime: moment.utc(comment.writeDatetime).local().format('YYYY-MM-DD HH:mm:ss'),  
                content: comment.content,
                user_email: comment.user_email,
            };
        });

        setComments(formattedComments || []);
    })
    .catch(err => {
        console.error("Error fetching comments:", err);
    });
};

export const emailCertificationRequest = async (requestBody) => {
    
    const result = await axios.post(Email_Certification_URL(), requestBody) //await은 요청의 응답이 돌아올 떄 까지 함수 실행을 멈추는 역할 한다(asyns함수 안에서만 사용가능)
    .then(response => {

        const responseBody = response.data;// responseBody의 key값들이: code, message, token, expirationTime
        
        return responseBody;
    })
    .catch(error => {
        if (!error.response || !error.response.data) return null; //예상하지못한 error를 0으로 반환
        const responseBody = error.response.data;                 //예상했던 error를 code와message로 반환
        return responseBody;
    });
return result;

};

export const checkCertificationRequest = async (requestBody) => {
    
    const result = await axios.post(Check_Certification_URL(), requestBody) //await은 요청의 응답이 돌아올 떄 까지 함수 실행을 멈추는 역할 한다(asyns함수 안에서만 사용가능)
    .then(response => {

        const responseBody = response.data;// responseBody의 key값들이: code, message, token, expirationTime
        
        return responseBody;
    })
    .catch(error => {
        if (!error.response || !error.response.data) return null; //예상하지못한 error를 0으로 반환
        const responseBody = error.response.data;                 //예상했던 error를 code와message로 반환
        return responseBody;
    });
return result;

};

export const updateMypageUserRequest = async (userData, accessToken) => { //MyPage 정보수정
    try {
        const response = await axios.patch(PATCH_MYPAGE_USER_URL(), userData, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return { code: "UN", message: "Unexpected error occurred." };
        return error.response.data;
    }
};

//USER API_(3)현재 로그인 된 사용자의 정보를 받아오는 API 
export const getMypageRequest = async (accessToken) => {
    if (!accessToken) {
        console.error("잘못된 접근입니다.");
        return null; 
    }
    try {
        const response = await axios.get(GET_MYPAGE_USER_URL(), {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log("Response:", response.data);  // 응답 로깅
        return response.data;
    } catch (error) {
        console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
        return null;
    }
};

export const checkArticleOwnership = async (articleNum, token) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/v1/article/own/${articleNum}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // 응답 데이터 반환
    } catch (error) {
        console.error('Error checking article ownership:', error);
        if (error.response && error.response.data) {
            const { data } = error.response;
            // data.code 값에 따라 오류 처리
            switch (data.code) {
                case "NA":
                    throw new Error("This article does not exist."); // 게시물이 없을 때
                case "NU":
                    throw new Error("This user does not exist."); // 사용자가 없을 때
                case "NP":
                    throw new Error("Do not have permission."); // 권한이 없을 때
                default:
                    throw new Error(data.message || "An unexpected error occurred."); // 기타 예외 처리
            }
        } else {
            // 응답 데이터가 없거나 네트워크 오류인 경우
            throw new Error(`Network or configuration error: ${error.message}`);
        }
    }
};

export const pwRequest = async (requestBody) => {
    
    const result = await axios.post(POST_PW_CHANGE_URL(), requestBody) //await은 요청의 응답이 돌아올 떄 까지 함수 실행을 멈추는 역할 한다(asyns함수 안에서만 사용가능)
    .then(response => {

        const responseBody = response.data;// responseBody의 key값들이: code, message, token, expirationTime
        
        return responseBody;
    })
    .catch(error => {
        if (!error.response || !error.response.data) return null; //예상하지못한 error를 0으로 반환
        const responseBody = error.response.data;                 //예상했던 error를 code와message로 반환
        return responseBody;
    });
return result;

};

export const pwUpdateRequest = async (userData) => { //MyPage 정보수정
    try {
        const response = await axios.patch(PATCH_PW_URL(), userData, {
            
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return { code: "UN", message: "Unexpected error occurred." };
        return error.response.data;
    }
};

export const deleteUserRequest = async (accessToken) => {
    try {
        const response = await axios.delete(DELETE_USER(), {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return { code: "UN", message: "예상치 못한 오류가 발생했습니다." };
        return error.response.data;
    }
}

//9.(Admin)댓글 수정 API
export const handleCommentEdit = async (commentNumber, newContent, token) => {
    const commentData = {
        content: newContent
    };
    try {
        const response = await axios.patch(`${DOMAIN}/api/admin1/comment/${commentNumber}`, commentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (err) {
        console.error("Error editing comment:", err);
        throw err;
    }
};
//10.(Admin)댓글 삭제 API
export const handleCommentDelete = async (articleNum, commentNumber, token) => {
    if (window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
        console.log(commentNumber)
        try {
            const response = await axios.delete(`http://localhost:4000/api/admin1/comment/${commentNumber}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.code === "SU") {
                alert("게시글이 삭제되었습니다.");
                return true;  
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.data.code) {
                    case "NU":
                        alert("This user does not exist.");
                        break;
                    case "VF":
                        alert("Validation failed.");
                        break;
                    case "NP":
                        alert("Do not have permission.");
                        break;
                    case "DBE":
                        alert("Database error.");
                        break;
                    default:
                        alert("예상치 못한 문제가 발생하였습니다.");
                        break;
                }
            }
            return false;  
        }
    }
    return false;  
};
export const checkAnonymousBoardAdmin = async (token) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/user/auth1-exist`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data.code)
        if (response.data.code == "SU"){
            return true;
        }
    } catch (error) {
        console.error('Error checking anonymous board admin:', error);
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    alert("This user does not exist.");
                    break;
                case "AF":
                    alert("No Permission");
                    break;
                case "DBE":
                    alert("데이터베이스에 문제가 발생했습니다");
                    break;
                default:
                    
                    break;
            }
        }
        return false;  
    }
};





export const signInRequest = async (requestBody) => { //asyns를 통해 비동기 함수 정의
    const result = await axios.post(SIGN_IN_URL(), requestBody) //await은 요청의 응답이 돌아올 떄 까지 함수 실행을 멈추는 역할 한다(asyns함수 안에서만 사용가능)
        .then(response => {
            const responseBody = response.data;// responseBody의 key값들이: code, message, token, expirationTime
            return responseBody;
        })
        .catch(error => {
            if (!error.response || !error.response.data) return null; //예상하지못한 error를 0으로 반환
            const responseBody = error.response.data;                 //예상했던 error를 code와message로 반환
            return responseBody;
        });
    return result;
};

//16.(Admin) 해결이 필요한 게시글을 해결된 게시글로 변경을 위한 API
export const handleResolveArticle = async (articleNum, token, navigate, setResolved) => {
    try {
        const response = await axios.put(`${API_ADMIN_DOMAIN}/${articleNum}/resolv`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { code } = response.data;
        
        if (code === "SU") {
            console.log('게시글이 정상적으로 해결되었습니다.');
            setResolved(true);
            navigate(`/article-main`);
        } else if (code === "AF") {
            alert("No Permission.");
        } else if (code === "NA") {
            alert("This article does not exist.");
        } else if (code === "NU") {
            alert("This user does not exist.");
        } else if (code === "VF") {
            alert("Validation failed.");
        } else if (code === "DBE") {
            alert("데이터베이스에 문제가 발생했습니다.");
        } 
    } catch (error) {
        console.error('Error resolving the article:', error);
    }
};
export const fetchUserArticles = async (token) => {
    try {
        const response = await axios.get('http://localhost:4000/api/v1/article/user-list', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            console.log("게시글 목록을 성공적으로 불러왔습니다.");
            return response.data.articleList;  
        } else {
            // 다른 응답 코드에 대한 처리
            console.error("응답 코드: ", response.data.code);
            alert(`Error: ${response.data.message}`);
            return null;  // 오류 발생 시 null 반환
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    alert("This user does not exist.");
                    break;
                case "VF":
                    alert("Validation failed.");
                    break;
                case "DBE":
                    alert("Database error.");
                    break;
                default:
                    alert("Unexpected error occurred.");
                    break;
            }
        } else {
            console.error("An error occurred: ", error);
            alert("An error occurred while fetching articles.");
        }
        return null;  
    }
};
