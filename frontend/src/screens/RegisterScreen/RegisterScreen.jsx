import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './RegisterScreen.css';

const RegisterScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { username, email, password, confirmPassword } = formData;

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
        <div className='register-screen'>
            <form className='register-form' /*onSubmit={handleSubmit}*/>
                <h1>Register</h1>
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    value={username}
                    /*onChange={handleChange}*/
                    placeholder='Enter username'
                    required
                />
                <label htmlFor='email'>Email:</label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    value={email}
                    /*onChange={handleChange}*/
                    placeholder='example@gmail.com'
                    required
                />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    name='password'
                    value={password}
                    /*onChange={handleChange}*/
                    placeholder='Enter password'
                    required
                />
                <label htmlFor='confirmPassword'>Confirm Password:</label>
                <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    /*value={confirmPassword}
                    onChange={handleChange}*/
                    placeholder='Confirm password'
                    required
                />
                <div className='register-buttons'>
                    <button type='submit'>Register</button>
                    <p className='login-text'>
                        Already an user? <Link to='/login/'>Log in.</Link>
                    </p>
                </div>
                <p className='login-text-back'>
                    <Link to='/'>Back</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterScreen;
