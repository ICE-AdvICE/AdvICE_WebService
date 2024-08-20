import axios from 'axios';

const DOMAIN = 'http://localhost:4000';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const API_DOMAIN_ADMIN = `${DOMAIN}/api/admin`;
const GET_CZ_AUTH_TYPE = () => `${API_DOMAIN}/coding-zone/auth-type`;
const GET_CZ_ATTEND_LIST = () => `${API_DOMAIN}/coding-zone/attend-list`;
const GET_CZ_ALL_ATTEND = () => `${DOMAIN}/api/admin/student-list`;



const authorization = (accessToken) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

export const getcodingzoneListRequest  = async (token, grade, weekDay) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/coding-zone/class-list/${grade}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { weekDay }
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
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data;
    }
};

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
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data; // 에러 응답 반환
    }
};

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
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data;
    }
};

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
        return error.response.data;
    }
};

// 7. 운영자 권한 종류 확인 API
export const checkAdminType = async (token) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/coding-zone/auth-type`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            return true;
        }
        return false;
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                case "EA":
                    console.log("성공: 사용자는 과사 조교입니다.");
                    break;
                case "CA":
                    console.log("성공: 사용자는 코딩존 조교입니다.");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        }
        return false;  // 오류 발생시 false 반환
    }
};
// 8. 선택된 학년의 예약 가능한 수업 리스트로 반환 API
export const reserveCodingZoneClass = async (token, classNum) => {
    try {
        const response = await axios.post(`${API_DOMAIN}/coding-zone/reserve-class/${classNum}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            return true;
        }
        return false;
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "FC":
                    alert("예약가능한 인원이 꽉 찼습니다.");
                    break;
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
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
}
// 9. 선택 학년의 예약 가능한 수업 리스트로 반환 API (ForNotLogIn)
export const getAvailableClassesForNotLogin = async (grade) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/coding-zone/class-list/for-not-login/${grade}`);
        if (response.data.code === "SU") {
            return response.data.classList; 
        } else {
            console.log(response.data.message);
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
        return [];
    }
};

export const deleteCodingZoneClass = async (token, classNum) => {
    try {
        const response = await axios.delete(`${API_DOMAIN}/coding-zone/cancel-class/${classNum}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            return true;
        }
        return false;
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NR":
                    console.log("Not reserve class.");
                    break;
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
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

export const getAttendanceCount = async (token, grade) => {
    try {
        const response = await axios.get(
            `${API_DOMAIN}/coding-zone/count-of-attend/${grade}`,
            {}, 
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        if (response.data.code === "SU") {
            return response.data.numOfAttend;
            
        } else {
            console.log("Unexpected response code:", response.data.code);
        }
        return null;  
    } catch (error) {
        if (error.response) {
            console.log("API Error Response:", error.response.data); // 오류 응답 데이터 확인
            switch (error.response.data.code) {
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        } else {
            console.log("서버와 통신하는 동안 문제가 발생했습니다.");
        }
        return null;  
    }
};

// 12.특정 사용자의 출/결석된 수업 리스트로 반환 API 
export const getczattendlistRequest = async (accessToken) => {
    try {
        const response = await axios.get(GET_CZ_ATTEND_LIST(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};

// 14.특정 날짜에 1학년/2학년 코딩존 수업 예약한 학생들 리스트로 반환 API
export const getczreservedlistRequest =  async (accessToken, classDate) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/coding-zone/reserved-list/${classDate}`, authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};

// 7.운영자 권한 종류 확인 API
export const getczauthtypetRequest = async (accessToken) => {
    try {
        const response = await axios.get(GET_CZ_AUTH_TYPE(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};



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

//13) 해당 학기에 출/결한 모든 학생들 리스트로 반환 API
export const getczallattendRequest = async (accessToken) => {
    try {
        const response = await axios.get(GET_CZ_ALL_ATTEND(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};