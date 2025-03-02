import axios from 'axios';

const DOMAIN = process.env.REACT_APP_API_DOMAIN; 
const GET_CZ_ASSITANT = () => `${DOMAIN}/api/v1/coding-zone/assistant-list`;
//21. 코딩존 조교 정보 반환 API
export const getczassitantRequest =  async () => {
    try {
        const response = await axios.get(GET_CZ_ASSITANT());
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};
