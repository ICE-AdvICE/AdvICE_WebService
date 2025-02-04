import axios from 'axios';
 
import moment from 'moment-timezone';

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const API_ADMIN_DOMAIN = `${DOMAIN}/api/admin1`;

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`; //로그인
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`; // 회원가입 
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






const GET_ARTICLE_LIST_URL = () => `${API_DOMAIN}/article/list`;








// 11.모든 게시글을 리스트 형태로 불러오는 API
export const getArticleListRequest = async () => {
    const result = await axios.get(GET_ARTICLE_LIST_URL())
        .then(response => {
            const responseBody = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response || !error.response.data) {
                console.log("API 응답에 문제가 발생했습니다.");
                return { message: "API 응답 오류", code: "API_ERROR" }; 
            }
            const responseBody = error.response.data;    
            if (responseBody.code === "DBE") {
                console.log("데이터베이스에 문제가 발생했습니다.");  
            }             
            return responseBody;
        })
    return result;
};







//5. 사용자 비밀번호 변경 API
export const pwUpdateRequest = async (userData) => { 
    try {
        const response = await axios.patch(PATCH_PW_URL(), userData, {
            
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return { code: "UN", message: "Unexpected error occurred." };
        return error.response.data;
    }
};

//9. 비밀번호 변경을 위한 이메일 인증 API
export const pwRequest = async (requestBody) => {
    
    const result = await axios.post(POST_PW_CHANGE_URL(), requestBody) 
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

//1. 사용자 회원가입을 위한 API
export const signUpRequest = async (requestBody) => {
    
    const result = await axios.post(SIGN_UP_URL(), requestBody)
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

//7. 이메일 인증 API
export const emailCertificationRequest = async (requestBody) => {
    
    const result = await axios.post(Email_Certification_URL(), requestBody) 
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

//8. 인증번호 확인 API
export const checkCertificationRequest = async (requestBody) => {
    
    const result = await axios.post(Check_Certification_URL(), requestBody) 
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

//2. 사용자 로그인을 위한 API
export const signInRequest = async (requestBody) => { 
    try {
        const response = await axios.post(SIGN_IN_URL(), requestBody);
        return response.data;  // 정상 응답 시 그대로 반환 (accessToken, refreshToken 포함)
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data; // API 에러 응답 반환
        }
        console.error('로그인 요청 실패:', error);
        return { code: 'ERROR', message: '로그인 요청 중 오류 발생' };
    }
};

//4. 사용자 정보 수정 API
export const updateMypageUserRequest = async (userData, accessToken) => { 
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

//3. 현재 로그인 된 사용자의 정보를 받아오는 API 
export const getMypageRequest = async (accessToken) => {
    if (!accessToken) {
        console.log("잘못된 접근입니다.");
        return null; 
    }
    try {
        const response = await axios.get(GET_MYPAGE_USER_URL(), {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log("Response:", response.data);  // 응답 로깅
        return response.data;
    } catch (error) {
        console.log('사용자 데이터를 가져오는 중 오류 발생:', error);
        return null;
    }
};

//6. 사용자 탈퇴 API
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



