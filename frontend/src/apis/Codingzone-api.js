import axios from 'axios';

const DOMAIN = 'http://localhost:4000';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const API_DOMAIN_ADMIN = `${DOMAIN}/api/admin`;
const GET_CZ_AUTH_TYPE = () => `${API_DOMAIN}/coding-zone/auth-type`;
const GET_CZ_ATTEND_LIST = () => `${API_DOMAIN}/coding-zone/attend-list`;
const GET_CZ_ALL_ATTEND = () => `${DOMAIN}/api/admin/student-list`;
const GET_CZ_ASSITANT = () => `${DOMAIN}/api/v1/coding-zone/assistant-list`;


const CHECK_ADMIN_TYPE_URL = () => `${API_DOMAIN}/coding-zone/auth-type`;
const GET_CODING_ZONE_LIST_URL = (grade) => `${API_DOMAIN}/coding-zone/class-list/${grade}`;
const GET_AVAILABLE_CLASSES_FOR_NOT_LOGIN_URL = (grade) => `${API_DOMAIN}/coding-zone/class-list/for-not-login/${grade}`;
const DELETE_CODING_ZONE_CLASS_URL = (classNum) => `${API_DOMAIN}/coding-zone/cence-class/${classNum}`;
const GET_ATTENDANCE_COUNT_URL = (grade) => `${API_DOMAIN}/coding-zone/count-of-attend/${grade}`;
const RESERVE_CODING_ZONE_CLASS_URL = (classNum) => `${API_DOMAIN}/coding-zone/reserve-class/${classNum}`;
const DELETE_CLASS_URL = (classNum) => `${DOMAIN}/api/admin/delete-class/${classNum}`;


//새로고침 함수
const refreshPage = () => {
    window.location.reload();
  };
const authorization = (accessToken) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
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
        return response.data; 
    } catch (error) {
        if (!error.response) {
            return { code: 'NETWORK_ERROR', message: '네트워크 상태를 확인해주세요.' };
        }
        return error.response.data;  
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
        const response = await axios.get(CHECK_ADMIN_TYPE_URL(), authorization(token));
        if (response.data.code === "SU") 
            return "SU"
        else if (response.data.code === "EA") {
            return "EA";  
        } 
        else if (response.data.code === "CA") {
            return "CA";  
        }
    } catch (error) {
        if (error.response) {
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
        }
        return false;   
    }
};
//8.선택된 학년의 예약 가능한 수업 리스트로 반환 API
export const getcodingzoneListRequest  = async (token, grade, weekDay) => {
    try {
        const response = await axios.get(GET_CODING_ZONE_LIST_URL(grade), {
            headers: { Authorization: `Bearer ${token}` },
            params: { weekDay }
        });
        if (response.data.code === "SU") {
            return {
                classList: response.data.classList,
                registedClassNum: response.data.registedClassNum
            };
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
        }  
        return false;
    }
}


// 9. 선택 학년의 예약 가능한 수업 리스트로 반환 API (ForNotLogIn)
export const getAvailableClassesForNotLogin = async (grade) => {
    try {
        const response = await axios.get(GET_AVAILABLE_CLASSES_FOR_NOT_LOGIN_URL(grade));
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
        }  
        return [];
    }
};

//10.출석 횟수 반환 API
export const getAttendanceCount = async (token, grade) => {
    try {
        const response = await axios.get(GET_ATTENDANCE_COUNT_URL(grade), authorization(token));
        if (response.data.code === "SU") {
            return response.data.numOfAttend;  
        } 
        return null;  
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    alert("로그인이 필요합니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                default:
                    break;
            }
        }
        return null;  
    }
};
// 11. 코딩존 수업 예약 API
export const reserveCodingZoneClass = async (token, classNum) => {
    try {
        const response = await axios.post(RESERVE_CODING_ZONE_CLASS_URL(classNum), {}, {
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
                    refreshPage(); //마감된것을 확인 후 페이지 새로고침
                    break;
                case "NU":
                    console.log("사용자가 존재하지 않습니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                case "AR":
                    console.log("이미 예약한 학생입니다.");
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
// 12.  코딩존 수업 예약 취소 API
export const deleteCodingZoneClass = async (token, classNum) => {
    try {
        const response = await axios.delete(DELETE_CODING_ZONE_CLASS_URL(classNum), authorization(token));
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
        } 
        return false;
    }
};
// 13. 등록된 특정 수업 삭제 API
export const deleteClass = async (classNum, token) => {
    try {
        const response = await axios.delete(DELETE_CLASS_URL(classNum), {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            return true;
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "AF":
                    console.log("권한이 없습니다.");
                    break;
                case "NU":
                    alert("로그인이 필요합니다.");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다.");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        }  
        return false;
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


export const getczassitantRequest =  async () => {
    try {
        const response = await axios.get(GET_CZ_ASSITANT());
        return response.data;
    } catch (error) {
        if (!error.response || !error.response.data) return null;
        return error.response.data;
    }
};
