import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './RegisterScreen.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { IoArrowBackCircleSharp } from "react-icons/io5";


const RegisterScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const { username, email, password, confirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const toggleShowPassword2 = () => {
        setShowConfirmPassword(prevShowConfirmPassword => !prevShowConfirmPassword);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            //alert('Passwords do not match');
            setError('Passwords do not match');
            return;
        }

        try {
            //SEND DATA TO THE SERVER
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const { data } = await axios.post('http://127.0.0.1:8000/api/create-user/', {
                username,
                email,
                password
            }, config);

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your registration was successful! Please log in",
                showConfirmButton: false,
                timer: 2500
            });

            setError('');
            navigate('/login/'); // REDIRECT USER TO LOGIN PAGE
        } catch (error) {
            if (error.response && error.response.data) {
                // Loop through all the keys of the errors object and join the messages into a chain
                const errors = error.response.data;
                const firstErrorKey = Object.keys(errors)[0]; // We get the first key to show the first error
                const firstErrorMessage = errors[firstErrorKey][0]; // We access the first error message for that key
                setError(firstErrorMessage);
                console.log('Registration error:', error);
            } else {
                setError('Failed to register');
            }
            console.error('Registration error:', error);
        }
    };


    return (
        <div className='register-screen'>
            <form className='register-form' onSubmit={handleSubmit}>
                <div className='div-login-text-back'>
                    <Link to='/'> <IoArrowBackCircleSharp className='back-arrow-register' /> </Link>
                </div>
                <h1>Register</h1>
                {error && <p className='register-error-message'>ERROR: {error}</p>}
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    value={username}
                    onChange={handleChange}
                    placeholder='Enter username'
                    required
                />
                <label htmlFor='email'>Email:</label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={handleChange}
                    placeholder='example@gmail.com'
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
                        <img src={showPassword ? "/openeye.png" : "/closedeye.png"} alt="See Password" className="eye-password" />
                    </button>
                </div>
                <label htmlFor='confirmPassword'>Confirm Password:</label>
                <div className='password-eye-container'>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id='confirmPassword'
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder='Confirm password'
                        required
                    />
                    <button
                        className='view-password-button'
                        onClick={toggleShowPassword2}
                        type="button"
                    >
                        <img src={showConfirmPassword ? "/openeye.png" : "/closedeye.png"} alt="See Password" className="eye-password" />
                    </button>
                </div>
                <h4 className='all-fields'>* All fields are required.</h4>
                <div className='register-buttons'>
                    <button type='submit'>Register</button>
                    <p className='login-text'>
                        Already a user? <Link to='/login/' className='login-text-link'>Log in.</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterScreen;
