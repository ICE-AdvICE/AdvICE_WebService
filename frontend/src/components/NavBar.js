import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../layouts/css/NavBar.css';
import LoginForm from '../Modals/LoginForm';
import SignUpinfoForm from'../Modals/Signupinfo';
import MyModal from '../MyModal';

const NavBar = () => {
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false); // 회원가입 모달 상태 추가

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const openSignUpModal = () => setIsSignUpModalOpen(true); // 회원가입 모달 열기
    const closeSignUpModal = () => setIsSignUpModalOpen(false); // 회원가입 모달 닫기

    return (
        <nav className="navbar">
            <div className="header-container">
                <Link className="header-school" to="/">
                    <img src="/header-name.png" alt="School Header" />
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div style={{ display: 'flex', fontWeight: 'bold' }}>
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
                        </div>
                    </li>
                </ul>
            </div>
            <MyModal
                open={isLoginModalOpen}
                onCancel={closeLoginModal}
                footer={[]}
            >
                <LoginForm onLogin={closeLoginModal} closeModal={closeLoginModal} />
            </MyModal>
            <MyModal
                open={isSignUpModalOpen}
                onCancel={closeSignUpModal}
                footer={[]}
            >
                <SignUpinfoForm closeModal={closeSignUpModal} />
            </MyModal>

        </nav>
    );
};

export default NavBar;
