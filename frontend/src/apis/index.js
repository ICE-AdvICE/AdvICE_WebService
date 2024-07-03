import axios from 'axios';
import moment from 'moment';

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;



const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`; //로그인
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`; // 회원가입 
const GET_ARTICLE_LIST_URL = () => `${API_DOMAIN}/article/list`; 
const Email_Certification_URL = () => `${API_DOMAIN}/auth/email-certification`; //인증번호 전송
const Check_Certification_URL = () => `${API_DOMAIN}/auth/check-certification`; //인증번호 인증
const GET_MYPAGE_USER_URL = () => `${API_DOMAIN}/user`; //마이페이지_개인정보 

const GET_SIGN_IN_USER_URL =() =>`${API_DOMAIN}/user`;
const authorization = (accessToken) => {
    return {headers: {Authorization:`Bearer ${accessToken}`}}
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

//댓글
export const addCommentRequest = async (articleNum, commentData, accessToken) => {
    try {
        const response = await axios.put(`${API_DOMAIN}/article/${articleNum}/comment`, commentData, authorization(accessToken));
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

//게시물 작성
export const createArticleRequest = async (postData, accessToken) => {
    try {
        const response = await axios.post(`${API_DOMAIN}/article`, postData, authorization(accessToken));
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

export const getArticleListRequest = async () => {
    const result = await axios.get(GET_ARTICLE_LIST_URL())
        .then(response => {
            const responseBody = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response || !error.response.data) return null; //예상하지못한 error를 0으로 반환
            const responseBody = error.response.data;                 //예상했던 error를 code와message로 반환
            return responseBody;
        })
    return result;
};

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
        const response = await axios.post(`http://localhost:4000/api/v1/article/${articleNum}/comment`, commentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Full Response:", response);
        console.log("Response data:", response.data);
        if (response.data.code === "SU") {
         
          fetchComments(articleNum, token, setComments);
          setCommentInput("");
 
        }
      } catch (err) {
        console.error("Error posting comment:", err);
      }
    }
};
export const fetchComments = (articleNum, token, setComments) => {
    axios.get(`http://localhost:4000/api/v1/article/${articleNum}/comment-list`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        setComments(response.data.commentList.map(comment => ({
            writeDatetime: moment.utc(comment.writeDatetime).local().format('YYYY-MM-DD HH:mm:ss'), // UTC를 로컬로 변환
            content: comment.content,
            user_email: comment.user_email
        })) || []);
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



export const getMypageRequest = async (accessToken)=>{
    try {
        const response = await axios.get(GET_MYPAGE_USER_URL (), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};

