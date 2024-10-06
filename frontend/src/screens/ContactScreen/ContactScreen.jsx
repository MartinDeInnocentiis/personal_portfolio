import React, { useState } from 'react';
import './ContactScreen.css'
import axios from 'axios';
import Swal from 'sweetalert2';
import { ColorRing } from 'react-loader-spinner'


const ContactScreen = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        axios.post('http://127.0.0.1:8000/api/contact/', formData)
            .then(response => {
                setIsLoading(false);
                if (response.data.success) {
                    Swal.fire({
                        customClass: {
                            title: 'swal2-title',
                            content: 'swal2-content',
                        },
                        text: "Message sent successfully!",
                        timer: 2500
                    });
                    setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                    });
                } else {
                    Swal.fire({
                        title: "Oops!",
                        customClass: {
                            title: 'swal2-error',
                            content: 'swal2-content',
                        },
                        text: "There was an error sending the message. Try again later...",
                        timer: 1500
                    });
                }
            })
            .catch(error => {
                setIsLoading(false);
                console.error('Error:', error);
                Swal.fire({
                    title: "Oops!",
                    customClass: {
                        title: 'swal2-error',
                        content: 'swal2-content',
                    },
                    text: "There was an error sending the message. Try again later...",
                    timer: 1500
                });
            });
    };

    return (
        <div className='contactscreen-general-container'>
        <div className='contactscreen-container'>
            <h1 className='contact-h1'>Contact me</h1>
            <div className='contact-container'>
                <form className='contact-form' onSubmit={handleSubmit}>
                    <label htmlFor='name'>Name:</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Enter name'
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <label htmlFor='email'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='example@gmail.com'
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <label htmlFor='subject'>Subject:</label>
                    <input
                        type='text'
                        id='subject'
                        name='subject'
                        placeholder='SUBJECT'
                        required
                        value={formData.subject}
                        onChange={handleChange}
                    />
                    <label htmlFor='message'>Message:</label>
                    <textarea
                        id='message'
                        name='message'
                        placeholder='Enter your message...'
                        required
                        className='form-message'
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>

                    {isLoading ? (
                        <div className='loader-contactform'>
                            <ColorRing
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                colors={['#252053', '#5C61FF', '#5c90ff', '#96FF1F', '#bfd1a9']}
                            />
                        </div>
                    ) : (
                        <button type='submit'>Send</button>
                    )}

                </form>
            </div>
        </div></div>
    )
}

export default ContactScreen
