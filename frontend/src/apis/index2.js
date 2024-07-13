import axios from 'axios';
import moment from 'moment';

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const POST_CHECK_USER_BAN_URL = () => `${API_DOMAIN}/auth/check-user-ban`; //정지 확인

export const checkuserbanRequest = async (requestBody) => { //asyns를 통해 비동기 함수 정의
    const result = await axios.post(POST_CHECK_USER_BAN_URL(), requestBody) //await은 요청의 응답이 돌아올 떄 까지 함수 실행을 멈추는 역할 한다(asyns함수 안에서만 사용가능)
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

