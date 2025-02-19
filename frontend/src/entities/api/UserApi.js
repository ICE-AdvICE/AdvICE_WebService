import axios from 'axios';
const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const DELETE_USER =()=> `${API_DOMAIN}/user`; //회원탈퇴 
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`; //로그인
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`; // 회원가입 
const PATCH_MYPAGE_USER_URL=() =>`${API_DOMAIN}/user`; //마이페이지_개인정보 수정
const PATCH_PW_URL=() =>`${API_DOMAIN}/user/password`; 


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

//2. 사용자 로그인을 위한 API

export const signInRequest = async (requestBody) => { 
    try {
        const response = await axios.create({
            baseURL: 'http://localhost:8080', // 백엔드 서버 주소
            withCredentials: true, // 쿠키 전송 활성화 (서버가 HttpOnly 쿠키를 설정할 수 있도록)
        }).post("/api/v1/auth/sign-in", requestBody);

        console.log(" 로그인 응답:", response);  
        console.log(" 응답 데이터:", response.data);
        console.log(" 응답 헤더:", response.headers);

        // Refresh Token은 HttpOnly 쿠키에 저장되므로 클라이언트에서 직접 접근 불가능
        // document.cookie를 통해 가져오는 것이 아니라, 요청 시 자동으로 전송됨

        return response.data; // ✅ response.data를 직접 반환
    } catch (error) {
        console.error("로그인 요청 실패:", error);
        if (error.response) {
            console.error(" 서버 응답 상태 코드:", error.response.status);
            console.error(" 서버 응답 데이터:", error.response.data);
            console.error(" 서버 응답 헤더:", error.response.headers);
            return error.response.data;
        }
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
