import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginScreen.css';

const LoginScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { username, email, password, confirmPassword } = formData;

    const [showPassword, setShowPassword] = useState(false);

    const handleMouseDown = () => {
        setShowPassword(true);
    };

    const handleMouseUp = () => {
        setShowPassword(false);
    };

    /*const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        alert('Passwords do not match');
      } else {
        // Handle registration logic here
        console.log('Form data:', formData);
      }
    };*/

    return (
        <div className='login-screen'>
            <form className='login-form' /*onSubmit={handleSubmit}*/>
                <h1>Log in</h1>
                <label htmlFor='username'>Username or Email</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    /*value={username}
                    onChange={handleChange}*/
                    placeholder='Enter username/email'
                    required
                />
                <label htmlFor='password'>Password:</label>
                <div className='password-eye-container'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        name='password'
                        /*value={password}
                        onChange={handleChange}*/
                        placeholder='Enter password'
                        required
                    />
                    <button
                        className='view-password-button'
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                        type="button"
                    >
                        <img src="/eye.png" alt="See Password" className="eye-password" />
                    </button>
                </div>
                <div className='login-buttons'>
                    <button type='submit'>Enter</button>
                    <p className='register-text'>
                        Not an user? <Link to='/register/'>Register.</Link>
                    </p>
                </div>
                <p className='login-text-back'>
                    <Link to='/'>Back</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginScreen;
