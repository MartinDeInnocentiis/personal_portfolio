import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginScreen.css';
import ViewPassword from '../../components/ViewPassword/ViewPassword';

const LoginScreen = () => {
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
                <input
                    type='password'
                    id='password'
                    name='password'
                    /*value={password}
                    onChange={handleChange}*/
                    placeholder='Enter password'
                    required
                />
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
