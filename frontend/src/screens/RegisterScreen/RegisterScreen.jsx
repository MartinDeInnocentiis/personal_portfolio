import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './RegisterScreen.css';
import ViewPassword from '../../components/ViewPassword/ViewPassword';
import axios from 'axios';

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

            console.log('User registered:', data);
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
                <input
                    type='password'
                    id='password'
                    name='password'
                    value={password}
                    onChange={handleChange}
                    placeholder='Enter password'
                    required
                />
                <label htmlFor='confirmPassword'>Confirm Password:</label>
                <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder='Confirm password'
                    required
                />
                <h4 className='all-fields'>* All fields are required.</h4>
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
