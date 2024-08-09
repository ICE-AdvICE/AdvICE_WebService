import axios from 'axios';

const DOMAIN = 'http://localhost:4000';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const API_DOMAIN_ADMIN = `${DOMAIN}/api/admin`;
 
// 11.모든 게시글을 리스트 형태로 불러오는 API
export const getcodingzoneListRequest  = async (token, grade) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/coding-zone/class-list/${grade}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            console.log("성공: 수업 리스트를 성공적으로 가져왔습니다.");
            return response.data.classList;
        } else {
            console.log("알림: 해당 학년에 대한 수업 리스트가 없습니다.");
            return [];
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
                    break;
                case "NA":
                    console.log("등록된 수업이 없습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        } else {
            console.log("네트워크 오류가 발생하였습니다.");
        }
        return false;
    }
};

//특정 (A/B)조의 정보 등록 API
export const uploadGroupData = async (groupData, token) => {
    try {
        const response = await axios.post(`${API_DOMAIN_ADMIN}/upload-group`, groupData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (!error.response) {
            // 네트워크 오류 또는 서버 응답 없음
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data;
    }
};

//특정 (A/B)조의 정보 반환 API
export const fetchGroupClasses = async (groupId, token) => {
    try {
        const response = await axios.get(`${API_DOMAIN_ADMIN}/get-group/${groupId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // API 응답 반환
    } catch (error) {
        if (!error.response) {
            // 네트워크 오류 또는 서버 응답 없음
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data; // 에러 응답 반환
    }
};

//코딩존 수업 등록 API
export const uploadClassForWeek = async (groupData, token) => {
    try {
        const response = await axios.post(`${API_DOMAIN_ADMIN}/upload-codingzone`, groupData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (!error.response) {
            // 네트워크 오류 또는 서버 응답 없음
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data;
    }
};

// 학기 초기화 API
export const resetCodingZoneData = async (token) => {
    try {
        const response = await axios.delete(`${API_DOMAIN_ADMIN}/delete-allinf`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; 
    } catch (error) {
        if (!error.response) {
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data; // Return error response
    }
};