import axios from 'axios';

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = async (requestBody) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const responseBody = response.data;// responseBody의 key값들이: code, message, token, expirationTime
            return responseBody;
        })
        .catch(error => {
            if (!error.response || !error.response.data) return null;
            const responseBody = error.response.data;
            return responseBody;
        });
    return result;
};


export const signUpRequest = async (requestBody) => {

}
