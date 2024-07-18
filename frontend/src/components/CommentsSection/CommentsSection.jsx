import React, { useState } from 'react';
import './CommentsSection.css';

const CommentsSection = ({ inputRef }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleNewMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, newMessage]);
            setNewMessage('');
        }
    };

    return (
        <div className='comments-container'>
            <div className='comments-subcontainer'>
                <h2 className='comments-title'>Comments</h2>
                <hr className='title-divider'/>
                <ul className='messages-box'>
                    {messages.map((message, index) => (
                        <li key={index} className='message-item'>{message}</li>
                    ))}
                </ul>
                <form onSubmit={handleNewMessage} className='new-message-form'>
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