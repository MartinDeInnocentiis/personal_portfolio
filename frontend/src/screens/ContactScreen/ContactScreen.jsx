import React, { useState } from 'react';
import './ContactScreen.css'
import axios from 'axios';


const ContactScreen = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/contact/', formData)
            .then(response => {
                if (response.data.success) {
                    alert("Message sent successfully!");
                } else {
                    alert("Failed to send message.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error sending your message.");
            });
    };

    return (
        <div className='contactscreen-container'>
            <h1 className='contact-h1'>Contact me</h1>
            <div className='contact-container'>
                <form className='contact-form'  onSubmit={handleSubmit}>
                    <label htmlFor='name'>Name:</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Enter name'
                        required
                        onChange={handleChange}
                    />
                    <label htmlFor='email'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='example@gmail.com'
                        required
                        onChange={handleChange}
                    />
                    <label htmlFor='subject'>Subject:</label>
                    <input
                        type='text'
                        id='subject'
                        name='subject'
                        placeholder='SUBJECT'
                        required
                        onChange={handleChange}
                    />
                    <label htmlFor='message'>Message:</label>
                    <textarea
                        id='message'
                        name='message'
                        placeholder='Enter your message...'
                        required
                        className='form-message'
                        onChange={handleChange}
                    ></textarea>
                    <button type='submit'>Send</button>
                </form>
            </div>
        </div>
    )
}

export default ContactScreen
