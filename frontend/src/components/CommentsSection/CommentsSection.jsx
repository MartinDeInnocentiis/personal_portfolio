import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store-zustand';
import api from '../../api'; // Aquí importamos la configuración de axios
import './CommentsSection.css';

const CommentsSection = ({ comments, postId, inputRef }) => {
    const [messages, setMessages] = useState(comments || []);
    const [newMessage, setNewMessage] = useState('');
    const [anonUsername, setAnonUsername] = useState('');
    const [isRegisteredUser, setIsRegisteredUser] = useState(false);
    const [username, setUsername] = useState('');

    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setIsRegisteredUser(true);
        }
    }, [user]);

    const updateAnonUsername = async (newName) => {
        try {
            await api.patch('/update-anon-username/', { name: newName });
        } catch (error) {
            console.error("There was an error updating the anon user name!", error);
        }
    };

    const handleAnonUsernameChange = (e) => {
        const newName = e.target.value;
        setAnonUsername(newName);
        updateAnonUsername(newName);
    };

    const handleNewMessage = async (e) => {
        e.preventDefault();

        if (newMessage.trim() && (isRegisteredUser || anonUsername.trim())) {
            const newMessageData = {
                content: newMessage,
                user: isRegisteredUser ? user.id : null,
                anon_user: !isRegisteredUser ? anonUsername : null,
            };

            try {
                const response = await api.post(`/posts/${postId}/comments/`, newMessageData);
                const createdComment = response.data;
                setMessages((prevMessages) => [...prevMessages, createdComment]);
                setNewMessage('');
                setAnonUsername('');
                /*if (inputRef.current) {
                    inputRef.current.value = ''; 
                }*/
            } catch (error) {
                console.error("There was an error creating the comment!", error);
            }
        }
    };

    return (
        <div className='comments-container'>
            <div className='comments-subcontainer'>
                <h2 className='comments-title'>Comments</h2>
                <hr className='title-divider' />
                <ul className='messages-box'>
                    {messages.map((message, index) => (
                        <li key={index} className='message-item'>
                            <div className='message-author'>{message.user ? message.user.username : `${message.anon_user.name}`}</div>
                            <div className='message-content'>{message.content}</div>
                            <small className='message-item-date'>{new Date(message.created_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleNewMessage} className='new-message-form'>
                    {!isRegisteredUser && (
                        <input
                            type='text'
                            value={anonUsername}
                            onChange={handleAnonUsernameChange}
                            placeholder='Enter your name'
                            className='new-message-input-name'
                        />
                    )}
                    <input
                        ref={inputRef}
                        type='text'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder='Write your message...'
                        className='new-message-input'
                    />
                    <button type='submit' className='new-message-button'>Enter</button>
                </form>
            </div>
        </div>
    );
}

export default CommentsSection;

















/*import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../store-zustand';
import axios from 'axios';
import { refreshToken } from '../../auth.js';
import './CommentsSection.css';

const CommentsSection = ({ comments, postId, inputRef  }) => {
    const [messages, setMessages] = useState(comments || []);
    const [newMessage, setNewMessage] = useState('');
    const [anonUsername, setAnonUsername] = useState('');
    const [isRegisteredUser, setIsRegisteredUser] = useState(false);
    const [username, setUsername] = useState('');

    const { user, token } = useAuthStore();
    //const inputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setIsRegisteredUser(true);
        }
    }, [user]);

    const updateAnonUsername = async (newName) => {
        try {
            const response = await axios.patch(
                'http://127.0.0.1:8000/api/update-anon-username/',
                { name: newName }
            );
        } catch (error) {
            console.error("There was an error updating the anon user name!", error);
        }
    };

    const handleAnonUsernameChange = (e) => {
        const newName = e.target.value;
        setAnonUsername(newName);
        updateAnonUsername(newName);
    };

    const handleNewMessage = async (e) => {
        e.preventDefault();

        if (newMessage.trim() && (isRegisteredUser || anonUsername.trim())) {
            const newMessageData = {
                content: newMessage,
                user: isRegisteredUser ? user.id : null,
                anon_user: !isRegisteredUser ? anonUsername : null,
            };

            try {
                let headers = {};
                if (isRegisteredUser) {
                    let currentToken = token;
                    if (!currentToken) {
                        currentToken = await refreshToken();
                    }
                    if (!currentToken) {
                        throw new Error('Unable to refresh token');
                    }
                    headers = { Authorization: `Bearer ${currentToken}` };
                }

                const response = await axios.post(
                    `http://127.0.0.1:8000/api/posts/${postId}/comments/`,
                    newMessageData,
                    { headers }
                );
                const createdComment = response.data;
                setMessages((prevMessages) => [...prevMessages, createdComment]);
                setNewMessage('');
                setAnonUsername('');
                /*if (inputRef.current) {
                    inputRef.current.value = ''; 
                }*/
/*            } catch (error) {
                console.error("There was an error creating the comment!", error);
            }
        }
    };

    return (
        <div className='comments-container'>
            <div className='comments-subcontainer'>
                <h2 className='comments-title'>Comments</h2>
                <hr className='title-divider' />
                <ul className='messages-box'>
                    {messages.map((message, index) => (
                        <li key={index} className='message-item'>
                            <div className='message-author'>{message.user ? message.user.username : `${message.anon_user.name}`}</div>
                            <div className='message-content'>{message.content}</div>
                            <small className='message-item-date'>{new Date(message.created_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleNewMessage} className='new-message-form'>
                    {!isRegisteredUser && (
                        <input
                            type='text'
                            value={anonUsername}
                            onChange={handleAnonUsernameChange}
                            placeholder='Enter your name...'
                            className='new-message-input'
                        />
                    )}
                    <input
                        ref={inputRef}
                        type='text'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder='Write your message...'
                        className='new-message-input'
                    />
                    <button type='submit' className='new-message-button'>Send</button>
                </form>
            </div>
        </div>
    );
}

export default CommentsSection;*/