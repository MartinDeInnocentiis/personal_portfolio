import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store-zustand';
import api from '../../api';
import { BiCommentDetail, BiLike, BiSolidLike, BiHeart, BiSolidHeart, BiDislike } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";
import './CommentsSection.css';

const CommentsSection = ({ comments, postId, inputRef, onCommentAdded, onCommentDeleted }) => {
    const [messages, setMessages] = useState(comments || []);
    const [newMessage, setNewMessage] = useState('');
    const [anonUsername, setAnonUsername] = useState('');
    const [isRegisteredUser, setIsRegisteredUser] = useState(false);
    const [username, setUsername] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);
    const [anonUserId, setAnonUserId] = useState('');


    const { user } = useAuthStore();
    const { anonUserId: storedAnonUserId } = useAuthStore.getState();
    //const { anonUserId } = useAuthStore.getState();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setIsRegisteredUser(true);
            console.log('User is authenticated:', user);
        } else {
            setAnonUserId(storedAnonUserId);
            console.log('!!No authenticated user, recovered anonUserId:', storedAnonUserId);

            if (!localStorage.getItem('anonUserId')) {
                localStorage.setItem('anonUserId', storedAnonUserId);
            }
        }

        // Verificar qué hay en el localStorage directamente
        const localAnonUserId = localStorage.getItem('anonUserId');
        console.log('$$anonUserId from localStorage:', localAnonUserId);

    }, [user, storedAnonUserId]);

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
                anon_user: !isRegisteredUser ? { id: anonUserId, name: anonUsername } : null,
            };

            try {
                const response = await api.post(`/posts/${postId}/comments/`, newMessageData);
                const createdComment = response.data;

                setMessages((prevMessages) => [...prevMessages, createdComment]);
                setNewMessage('');
                setAnonUsername('');
                onCommentAdded();
            } catch (error) {
                console.error("There was an error creating the comment!", error);
            }
        }
    };

    /*   23/8
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
                    onCommentAdded();
                } catch (error) {
                    console.error("There was an error creating the comment!", error);
                }
            }
        };*/

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}/`);
            setMessages(prevMessages => prevMessages.filter(message => message.id !== commentId));
            onCommentDeleted();
        } catch (error) {
            console.log("There was an error deleting the comment", error);
        }
    };

    const handleSeeMoreClick = () => {
        setShowAllComments(true);
    };

    const commentsToDisplay = showAllComments ? messages : messages.slice(0, 5);
    const remainingCommentsCount = messages.length - 5;

    return (
        <div className='comments-container'>
            <div className='comments-subcontainer'>

                <h2 className='comments-title'>Comments</h2>
                <hr className='title-divider' />


                <form onSubmit={handleNewMessage} className='new-message-form'>
                    <div className='input-name-container'>
                        {!isRegisteredUser && (
                            <input
                                type='text'
                                value={anonUsername}
                                onChange={handleAnonUsernameChange}
                                placeholder='Enter your name'
                                className='new-message-input-name'
                            />
                        )}
                    </div>
                    <input
                        ref={inputRef}
                        type='text'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder='Write your message'
                        className='new-message-input'
                    />

                    <button type='submit' className='new-message-button'>Enter</button>
                </form>


                <hr className='title-divider2' />

                <ul className='messages-box'>
                    {commentsToDisplay.map((message, index) => {
                        const isOwner = isRegisteredUser
                            ? message.user && message.user.id === user.id
                            : message.anon_user && message.anon_user.id === anonUserId;

                        return (
                            <li key={index} className='message-item'>
                                <div className='name-date-container'>
                                    <div className='message-author'>
                                        {message.user ? message.user.username : `${message.anon_user.name}`}
                                    </div>
                                    <small className='message-item-date'>
                                        {new Date(message.created_at).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: undefined,
                                            hour12: false
                                        })}
                                    </small>
                                </div>
                                <div className='message-content'>{message.content}</div>


                                <div className='comment-reactions-delete-container'>
                                    <div className='comment-reactions-container'>
                                        <BiHeart className='com-reaction-icon-heart' />
                                        <BiLike className='com-reaction-icon-like' />
                                        <BiDislike className='com-reaction-icon-dislike' />
                                    </div>
                                    <div className='delete-comment-container'>
                                        {isOwner && (
                                            <BsTrash3
                                                className='com-reaction-icon-trash'
                                                onClick={() => handleDeleteComment(message.id)}
                                                title='Delete comment'
                                            />
                                        )}
                                    </div>
                                </div>


                            </li>
                        );
                    })}
                </ul>
                {remainingCommentsCount > 0 && !showAllComments && (
                    <button onClick={handleSeeMoreClick} className='see-more-button'>
                        See more comments ({remainingCommentsCount})
                    </button>
                )}
            </div>
        </div>
    );
}

export default CommentsSection;


