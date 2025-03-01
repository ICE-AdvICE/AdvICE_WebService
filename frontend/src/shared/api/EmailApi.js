import axios from 'axios';
//const DOMAIN = 'http://localhost:8080';
const DOMAIN = 'https://api.ice-advice.co.kr'; 
const API_DOMAIN = `${DOMAIN}/api/v1`;

const Email_Certification_URL = () => `${API_DOMAIN}/auth/email-certification`; //인증번호 전송
const POST_PW_CHANGE_URL =() => `${API_DOMAIN}/auth/password-change/email-certification`;

const Check_Certification_URL = () => `${API_DOMAIN}/auth/check-certification`; //인증번호 인증
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