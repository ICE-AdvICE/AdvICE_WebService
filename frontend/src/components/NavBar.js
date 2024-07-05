import React, { useState } from 'react';
import { Link, NavLink,useNavigate } from 'react-router-dom';
import '../layouts/css/NavBar.css';
import LoginForm from '../Modals/LoginForm';
import SignUpinfoForm from '../Modals/Signupinfo';
import MypageForm from '../Modals/Mypage';
import MyModal from '../MyModal';
import { useCookies } from 'react-cookie'; // 쿠키 훅 추가

const NavBar = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [modalOpenMypage, setModalOpenmypage] = useState(false); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 추적하는 상태 변수
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']); // 쿠키 관리
    const navigate = useNavigate();

    const openLoginModal = () => setIsLoginModalOpen(true);

    const closeLoginModal = (loginSuccess) => {
        setIsLoginModalOpen(false);
        if (loginSuccess) {
            setIsLoggedIn(true);
        }
    };

    const justCloseModal = () => {
        setIsLoginModalOpen(false);
    };

    const openSignUpModal = () => setIsSignUpModalOpen(true);
    const closeSignUpModal = () => setIsSignUpModalOpen(false);
    const closeMyPageModal = () => setModalOpenmypage(false);
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        removeCookie('accessToken');
        closeMyPageModal(); // 모달 닫기
        navigate('/'); // 홈으로 리다이렉트
    };


    return (
        <nav className="navbar">
            <div className="header-container">
                <Link className="header-school" to="/">
                    <img src="/header-name.png" alt="School Header" />
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div style={{ display: 'flex', fontWeight: 'bold' }}>
                            {isLoggedIn ? (
                                <>
                                    <NavLink
                                        activeClassName="active"
                                        className="nav-link"
                                        aria-current="page"
                                        to="#"
                                        style={{ marginRight: '20px' }}
                                        onClick={setModalOpenmypage}
                                    >
                                        MyPage
                                    </NavLink>
                                    <NavLink
                                        activeClassName="active"
                                        className="nav-link"
                                        aria-current="page"
                                        to="#"
                                        style={{ marginRight: '20px' }}
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        activeClassName="active"
                                        className="nav-link"
                                        aria-current="page"
                                        to="#"
                                        style={{ marginRight: '20px' }}
                                        onClick={openLoginModal}
                                    >
                                        Sign In
                                    </NavLink>
                                    <NavLink
                                        activeClassName="active"
                                        className="nav-link"
                                        aria-current="page"
                                        to="#"
                                        style={{ marginRight: '20px' }}
                                        onClick={openSignUpModal}
                                    >
                                        Sign Up
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
            <MyModal
                open={isLoginModalOpen}
                onCancel={justCloseModal}
                footer={[]}
            >
                 <LoginForm onLogin={closeLoginModal} closeModal={justCloseModal} />
            </MyModal>

            <MyModal
                open={isSignUpModalOpen}
                onCancel={closeSignUpModal}
                footer={[]}
            >
                <SignUpinfoForm closeModal={closeSignUpModal} />
            </MyModal>

            <MyModal open={modalOpenMypage} onCancel={closeMyPageModal} footer={[]}>
                <MypageForm handleLogout={handleLogout} />
            </MyModal>

        </nav>
    );
};

export default NavBar;