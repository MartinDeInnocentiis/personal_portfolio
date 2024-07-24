import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../store-zustand';
import axios from 'axios';
import { refreshToken } from '../../auth.js';
import './CommentsSection.css';

const CommentsSection = ({ comments, postId }) => {
    const [messages, setMessages] = useState(comments || []);
    const [newMessage, setNewMessage] = useState('');
    const [anonUsername, setAnonUsername] = useState('');
    const [isRegisteredUser, setIsRegisteredUser] = useState(false);
    const [username, setUsername] = useState('');

    const { user, token } = useAuthStore();
    const inputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setIsRegisteredUser(true);
        }
    }, [user]);

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
                inputRef.current.value = ''; 
            } catch (error) {
                console.error("There was an error creating the comment!", error);
            }
        }
    };

    useEffect(() => {
        console.log("Updated messages:", messages);
    }, [messages]);

    return (
        <div className='comments-container'>
            <div className='comments-subcontainer'>
                <h2 className='comments-title'>Comments</h2>
                <hr className='title-divider' />
                <ul className='messages-box'>
                    {messages.map((message, index) => (
                        <li key={index} className='message-item'>
                            <div className='message-author'>{message.user ? message.user.username : `Anonymous User: ${message.anon_user}`}</div>
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
                            onChange={(e) => setAnonUsername(e.target.value)}
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

export default CommentsSection;