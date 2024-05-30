import React, { useState,useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { getMypageRequest } from '../apis/index.js';




const MypageForm = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        studentNum: '',
        name: ''
    }); // 사용자 정보를 저장할 상태
    const [cookies, setCookie] = useCookies(['accessToken']); // 쿠키에서 accessToken 읽기
    const token = cookies.accessToken; // 토큰을 변수에 저장

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (token) { // 토큰이 존재할 때만 API 호출
                try {
                    const response = await getMypageRequest(token);
                    if (response) { // 응답이 정상적으로 있는 경우
                        setUserDetails({ // 상태 업데이트
                            email: response.email,
                            studentNum: response.studentNum,
                            name: response.name
                        });
                    } else {
                        console.error('No data returned from getMypageRequest');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserDetails();
    }, [token]); // token이 변경될 때마다 실행

    return (
        <div>
            <p>이메일: {userDetails.email}</p>
            <p>학번: {userDetails.studentNum}</p>
            <p>이름: {userDetails.name}</p>
        </div>
    );
};

export default MypageForm;