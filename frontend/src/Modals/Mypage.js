import React, { useState,useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { getMypageRequest,updateMypageUserRequest,deleteUserRequest} from '../apis/index.js';
import { checkuserbanRequest} from '../apis/index2.js';
import MyModal from '../MyModal'; // 모달 컴포넌트 추가
import FindpasswordForm from '../Modals/findpassword';
import './modules.css';



const MypageForm = ({ handleLogout }) => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        studentNum: '',
        name: ''
    }); // 사용자 정보를 저장할 상태
    const [editMode, setEditMode] = useState(false); // 수정 모드 상태
    const [cookies, setCookie] = useCookies(['accessToken']); // 쿠키에서 accessToken 읽기
    const token = cookies.accessToken; // 토큰을 변수에 저장
    const [modalOpenfind, setModalOpenfind] = useState(false);
    
    //사용자 정보 가져오는 함수
    useEffect(() => {
        const fetchUserDetails = async () => {
            console.log("Trying to fetch data with token:", token);
            const data = await getMypageRequest(token);
            console.log("Received data:", data);
            if (data && data.code === "SU") {
                setUserDetails({
                    email: data.email,
                    studentNum: data.studentNum,
                    name: data.name
                });
            } else if (data && data.code === "NU") {
                alert("해당 사용자가 존재하지 않습니다.");
            } else if (data && data.code === "DBE") {
                alert("데이터베이스 오류가 발생했습니다.");
            }
        };
    
        if (token) {
            fetchUserDetails();
        } else {
            console.error("No token available.");
        }
    }, [token]);

    //회원탈퇴 함수(정지 당했을 시 탈퇴 불가)
    const handleDeleteAccount = async () => {
        if (window.confirm("정말로 계정을 삭제하시겠습니까?")) {
            // 이메일과 토큰을 사용하여 사용자의 정지 유무 확인
            const banCheck = await checkuserbanRequest(userDetails.email, token);
            if (banCheck.banReason) {
                alert(`계정 삭제가 불가능합니다. 정지 사유: ${banCheck.banReason}`);
            } else {
                const result = await deleteUserRequest(token);
                switch (result.code) {
                    case "SU":
                        alert("계정이 성공적으로 삭제되었습니다.");
                        handleLogout(); 
                        break;
                    case "NU":
                        alert("해당 사용자가 존재하지 않습니다.");
                        break;
                    case "VF":
                        alert("유효성 검증에 실패했습니다.");
                        break;
                    case "DBE":
                        alert("데이터베이스 오류가 발생했습니당.");
                        break;
                    default:
                        alert("알 수 없는 오류가 발생했습니다.");
                        break;
                }
            }
        }
    };

    //사용자 개인정보 수정 함수
    const handleUpdateUserDetails = async () => {
        const result = await updateMypageUserRequest(userDetails, token);
        if (result.code === "SU") {
            alert("정보가 성공적으로 업데이트 되었습니다.");
            setEditMode(false); 
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    //비밀번호 수정 모달 부르는 함수 
    const handleFindpassword = (e) => {
        e.preventDefault(); 
        setModalOpenfind(true); 
    };

    //숫자만 입력할 수 있도록 설정하는 함수
    const handleNumberInput = (e) => {
        const value = e.target.value;
        setUserDetails({...userDetails, studentNum: value.replace(/[^0-9]/g, '')});
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="loginHeaderContainer">
                <img src="header-name.png" alt="로그인 로고" style={{ width: '220px', height: 'auto' }} />
            </div>   
            <div className="mypage_icelogo">
                <img src="favicon.png" alt="정보통신공학과 로고" style={{ width: '150px', height: 'auto' }} />
            </div> 
            <div className="mypage_component">
                <p>메일: {userDetails.email}</p>
                <p>학번: {userDetails.studentNum}</p>
                <p>이름: {userDetails.name}</p>
            </div>
            <button className="findPasswordButton" onClick={handleFindpassword}>비밀번호 재설정</button>
            <div className="mypage_buttons">
            <button type="button" onClick={() => setEditMode(true)}>정보 수정</button>
                <button type="button" onClick={handleLogout}>로그아웃</button>
            </div>
            <button className="mypage_delete_user" onClick={handleDeleteAccount}>회원탈퇴</button>
            {editMode && (
                <MyModal open={editMode} onCancel={() => setEditMode(false)} footer={[]}>
                    <div className="loginHeaderContainer">
                        <img src="header-name.png" alt="로그인 로고" style={{ width: '220px', height: 'auto' }} />
                    </div> 
                    <div>
                        <label>이름:</label>
                        <input 
                            value={userDetails.name} 
                            onChange={(e) => setUserDetails({...userDetails, name: e.target.value})} 
                            className="mypage_update_name"
                        />
                        <label>학번:</label>
                        <input 
                            value={userDetails.studentNum} 
                            onChange={handleNumberInput} 
                            className="mypage_update_studentNum"
                        />
                        <button type="button" className="mypage_update-button" onClick={handleUpdateUserDetails}>수정 완료</button>
                    </div>
                </MyModal>
            )}

            <MyModal //비밀번호 찾기
                    open={modalOpenfind}
                        width={500} //모달 넓이 이게 적당 한듯
                        header={[]}
                        onCancel={e => setModalOpenfind(false) } //x 버튼
                        footer={[]}
                    >
                    <FindpasswordForm onLogin={handleFindpassword} onClose={() => setModalOpenfind(false)} />
                    
                </MyModal>
        </form>
    );
};

export default MypageForm;