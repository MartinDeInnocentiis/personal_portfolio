import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store-zustand';
import './UserOrLogin.css';

const UserOrLogin = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const logoutRef = useRef();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleLogout = () => {
        setShowLogout(prevShowLogout => !prevShowLogout);
    };


    const handleClickOutside = (event) => {
        if (logoutRef.current && !logoutRef.current.contains(event.target)) {
            setShowLogout(false);
        }
    };

    useEffect(() => {
        if (showLogout) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showLogout]);


    return (
        <div className="auth-status">
            {user ? (
                <div className="user-info" ref={logoutRef}>
                    <span onClick={toggleLogout}>Hi, @{user}</span>
                    {showLogout && (
                        <div className='logout-container'>
                            <button onClick={handleLogout} className="logout-button">Log out</button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <NavLink to="/register/" className="auth-links">Register</NavLink> / <NavLink to="/login/" className="auth-links">Log in</NavLink>
                </div>
            )}
        </div>
    );
};

export default UserOrLogin;