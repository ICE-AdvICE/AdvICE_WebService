import axios from 'axios';

const DOMAIN = 'http://localhost:8080'; 
const API_DOMAIN_ADMIN = `${DOMAIN}/api/admin`;
//권한 부여 API
export const grantPermission = async (email, role, token) => {
    try {
        const response = await axios.patch(`${API_DOMAIN_ADMIN}/give-auth`, {
            email,
            role
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (!error.response) {
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data;
    }
}

//권한 박탈 API
export const deprivePermission = async (email, role, token) => {
    try {
        const response = await axios.patch(`${API_DOMAIN_ADMIN}/deprive-auth`, {
            email,
            role
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (!error.response) {
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data;
    }
}