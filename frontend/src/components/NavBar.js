import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../layouts/css/Main.bar/NavBar.css';
import LoginForm from '../Modals/LoginForm';
import SignUpinfoForm from '../Modals/Signupinfo';
import MypageForm from '../Modals/Mypage';
import MyModal from '../MyModal';
import { useCookies } from 'react-cookie';

const NavBar = () => {
    const [modal, setModal] = useState({
        login: false,
        signup: false,
        mypage: false
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
    const navigate = useNavigate();

    useEffect(() => {
        const token = cookies.accessToken;
        setIsLoggedIn(!!token);
    }, [cookies.accessToken]);



    const openModal = (type) => setModal(prev => ({ ...prev, [type]: true }));
    const closeModal = (type) => setModal(prev => ({ ...prev, [type]: false }));

    const handleLogout = () => {
        setIsLoggedIn(false);
        removeCookie('accessToken', { path: '/' }); // 경로 지정 주의
        closeModal('mypage');
        setTimeout(() => {
            navigate('/');
        }, 100); // navigate 호출 전에 시간 지연
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
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                        to="#"
                                        style={{ marginRight: '20px' }}
                                        onClick={() => openModal('mypage')}
                                    >
                                        MyPage
                                    </NavLink>
                                    <NavLink
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                        to="#"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                        to="#"
                                        style={{ marginRight: '20px' }}
                                        onClick={() => openModal('login')}
                                    >
                                        Sign In
                                    </NavLink>
                                    <NavLink
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                        to="#"
                                        style={{ marginRight: '20px' }}
                                        onClick={() => openModal('signup')}
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
                open={modal.login}
                onCancel={() => closeModal('login')}
                footer={[]}
            >
                <LoginForm onLogin={(loginSuccess) => {
                    closeModal('login');
                    if (loginSuccess) setIsLoggedIn(true);
                }} closeModal={() => closeModal('login')} />
            </MyModal>

            <MyModal
                open={modal.signup}
                onCancel={() => closeModal('signup')}
                footer={[]}
            >
                <SignUpinfoForm closeModal={() => closeModal('signup')} />
            </MyModal>

            <MyModal
                open={modal.mypage}
                onCancel={() => closeModal('mypage')}
                footer={[]}
            >
                <MypageForm handleLogout={handleLogout} closeModal={() => closeModal('mypage')} />
            </MyModal>

        </nav>
    );
};

export default NavBar;