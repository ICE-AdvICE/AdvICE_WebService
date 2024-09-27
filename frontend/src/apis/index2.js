import axios from 'axios';
import moment from 'moment';

const DOMAIN = 'http://localhost:8080';

const API_DOMAIN = `${DOMAIN}/api/v1`;

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