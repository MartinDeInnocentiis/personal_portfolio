import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../store-zustand';
import './LoginScreen.css';
import Swal from 'sweetalert2';
import '../customSwal.css';
import { IoArrowBackCircleSharp } from "react-icons/io5";


const LoginScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState('');

    const { username, password } = formData;

    const [showPassword, setShowPassword] = useState(false);

    const login = useAuthStore((state) => state.login); // GET LOGIN FUNCTION FROM ZUSTAND STORE

    const toggleShowPassword = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/custom-token/', { username, password });
            const { access, refresh, id, username: responseUsername } = response.data;
            login({ id, username: responseUsername }, access, refresh); // STORES LOGIN STATE WITH ZUSTAND
            localStorage.setItem('refreshToken', refresh); // SAVES REFRESH TOKEN ON LOCALSTORAGE
            setError('');
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Logged in successfully!",
                customClass: {
                    title: 'swal2-title',
                    content: 'swal2-content',
                },
                showConfirmButton: false,
                timer: 1200
            });
            navigate('/'); // REDIRECTS USER TO THE HOME PAGE
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.detail || 'Login failed';
                setError(errorMessage);
            } else {
                setError('Failed to login');
            }
            console.error('Login error:', error);
        }
    };

    return (
        <div className='login-screen'>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='div-login-text-back'>
                    <Link to='/'> <IoArrowBackCircleSharp className='back-arrow-login' title='Back'/> </Link>
                </div>
                <h1>Log in</h1>
                {error && <p className='register-error-message'>ERROR: {error}</p>}
                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    value={username}
                    onChange={handleChange}
                    placeholder='Enter username'
                    required
                />
                <label htmlFor='password'>Password:</label>
                <div className='password-eye-container'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        name='password'
                        value={password}
                        onChange={handleChange}
                        placeholder='Enter password'
                        required
                    />
                    <button
                        className='view-password-button'
                        onClick={toggleShowPassword}
                        type="button"
                    >
                        <img src={showPassword ? "/openeye.png" : "/closedeye.png"} title="See Password" className="eye-password" />
                    </button>
                </div>
                <div className='login-buttons'>
                    <button type='submit'>Enter</button>
                    <p className='register-text'>
                        Not a user? <Link to='/register/'>Register.</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginScreen;
