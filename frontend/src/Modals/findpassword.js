import React, { useState } from 'react';
import { pwRequest, checkCertificationRequest, pwUpdateRequest } from '../apis/index.js';

const FindpasswordForm = ({ onFindpassForm }) => {
    const [userEmail, setUserEmail] = useState('');
    const [certificationNumber, setCertificationNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCertified, setIsCertified] = useState(false);

    // 이메일로 인증번호 전송 요청
    const handleSendCertification = async () => {
        const requestBody = { email: userEmail };
        const response = await pwRequest(requestBody);
        if (response.code === 'SU') {
            alert('인증번호가 전송되었습니다. 받은 인증번호를 입력해주세요.');
        } else {
            alert('인증번호 전송 실패: ' + response.message);
        }
    };

    // 인증번호 확인
    const handleCertification = async () => {
        const requestBody = {
            email: userEmail,
            certificationNumber: certificationNumber
        };
        const response = await checkCertificationRequest(requestBody);
        if (response.code === 'SU') {
            setIsCertified(true);
            alert('인증이 성공적으로 완료되었습니다. 이제 비밀번호를 변경할 수 있습니다.');
        } else {
            alert('인증번호가 잘못되었습니다. 다시 시도해주세요.');
        }
    };

    // 비밀번호 변경
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (newPassword.length < 8 || newPassword.length > 20) { // 예를 들어 최소 길이를 8로 설정
            alert('비밀번호 길이를 8자 이상 20자 이하로 해주세요.');
            return;
        }
        const requestBody = {
            password: newPassword
        };

        const response = await pwUpdateRequest(requestBody);
        if (response.code === 'SU') {
            alert('비밀번호 변경이 성공적으로 완료되었습니다.');
            onFindpassForm(true); // Optionally call a prop function to manage modal state
        } else {
            alert('비밀번호 변경에 실패하였습니다: ' + response.message);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="loginHeaderContainer">
                <img src="header-name.png" alt="로그인 로고" style={{ width: '220px', height: 'auto' }} />
            </div>
            <div className="pw_emailpost">
                <label htmlFor="user_email"></label>
                <input
                    type="text"
                    id="user_email"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    placeholder="학교 이메일을 입력해주세요."
                />
                <button type="button" className="findpasswordpost" onClick={handleSendCertification}>인증요청</button>
            </div>
            <div className="pw_emailpost">
                <label htmlFor="certificationNumber"></label>
                <input
                    type="text"
                    id="certificationNumber"
                    value={certificationNumber}
                    onChange={e => setCertificationNumber(e.target.value)}
                    placeholder="인증번호를 입력해주세요."
                />
                <button type="button" className="findpasswordpost" onClick={handleCertification}>인증확인</button>
            </div>
            {isCertified && (
                <>
                    <div className="pw_emailpost">
                        <label htmlFor="newPassword"></label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="새 비밀번호 입력"
                        />
                    </div>
                    <div className="pw_emailpost">
                        <label htmlFor="confirmPassword"></label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="비밀번호 재입력"
                        />
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>
                        )}
                    </div>
                    <button type="button" className="signupButton" onClick={handlePasswordChange}>비밀번호 변경</button>
                </>
            )}
        </form>
    );
};

export default FindpasswordForm;