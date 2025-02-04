import axios from 'axios';

const DOMAIN = 'http://localhost:8080'; 
 
//17. 1학년 출/결석 처리 API 
export const putczattendc1Request = async (registNum,accessToken) => {
    try {
        const response = await axios.put(`${DOMAIN}/api/admin-c1/attendance/${registNum}`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};

//18. 2학년 출/결석 처리 API 
export const putczattendc2Request = async (registNum,accessToken) => {
    try {
        const response = await axios.put(`${DOMAIN}/api/admin-c2/attendance/${registNum}`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};
