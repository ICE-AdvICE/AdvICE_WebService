import axios from 'axios';

const DOMAIN = 'http://localhost:4000';
const API_DOMAIN = `${DOMAIN}/api/v1`;

export const getcodingzoneListRequest  = async (token, grade,weekDay) => {
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
export const checkAdminType = async (token) => {
    try {
        const response = await axios.get(`${API_DOMAIN}/coding-zone/auth-type`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.code == "SU"){
            return true;
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

export const reserveCodingZoneClass = async (token, classNum) => {
    try {
        const response = await axios.post(`${API_DOMAIN}/coding-zone/reserve-class/${classNum}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.code == "SU"){
            return true;
        }
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
};

export const deleteCodingZoneClass = async (token, classNum) => {
    try {
        const response = await axios.delete(`${API_DOMAIN}/coding-zone/cence-class/${classNum}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.code == "SU"){
            return true;
        }
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
        const response = await axios.put(`${API_DOMAIN}/coding-zone/count-of-attend/${grade}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.code === "SU") {
            console.log("출석 횟수:", response.data.numOfAttend);
            return response.data.numOfAttend;
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
        } else {
            console.log("서버와 통신하는 동안 문제가 발생했습니다.");
        }
        return null;  // 오류 발생 시 null 반환
    }
};