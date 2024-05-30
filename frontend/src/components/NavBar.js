import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../layouts/css/NavBar.css';
import LoginForm from '../Modals/LoginForm';
import MyModal from '../MyModal';

const NavBar = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <nav className="navbar">
            <div className="header-container">
                <Link className="header-school" to="/">
                    <img src="header-name.png" alt="School Header" />
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
                                login
                            </NavLink>
                            <NavLink
                                activeClassName="active"
                                className="nav-link"
                                aria-current="page"
                                to="/logout"
                            >
                                logout
                            </NavLink>
                        </div>
                    </li>
                </ul>
            </div>
            <MyModal
                open={isLoginModalOpen}
                width={500}
                header={[<p key="header">로그인</p>]}
                onCancel={closeLoginModal}
                footer={[]}
            >
                <LoginForm onLogin={() => {}} />
            </MyModal>
        </nav>
    );
};

export default NavBar;
