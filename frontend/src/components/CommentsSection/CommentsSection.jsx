import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store-zustand';
import api from '../../api';
import { BiCommentDetail, BiHeart, BiSolidHeart, BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";
import Swal from 'sweetalert2';
import '../customSwal2.css';
import './CommentsSection.css';

const CommentsSection = ({ comments, postId, inputRef, onCommentAdded, onCommentDeleted }) => {
    const [messages, setMessages] = useState(comments || []);
    const [newMessage, setNewMessage] = useState('');
    const [anonUsername, setAnonUsername] = useState('');
    const [isRegisteredUser, setIsRegisteredUser] = useState(false);
    const [username, setUsername] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);
    const [nameError, setNameError] = useState(false);

    const { user, anonUserId: storedAnonUserId, setAnonUserId } = useAuthStore();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setIsRegisteredUser(true);
        } else {
            // Cargar anonUserId desde localStorage si no está en Zustand
            const localAnonUserId = localStorage.getItem('anonUserId');
            if (localAnonUserId && localAnonUserId !== storedAnonUserId) {
                setAnonUserId(localAnonUserId);
            } else if (!storedAnonUserId) {
                const newAnonUserId = uuidv4();
                setAnonUserId(newAnonUserId);
                localStorage.setItem('anonUserId', newAnonUserId);
            }
        }
        fetchComments();
    }, [user, storedAnonUserId, setAnonUserId]);

    const fetchComments = async () => {
        try {
            const { anonUserId } = useAuthStore.getState();
            console.log("Anon User ID being sent:", anonUserId);
            const response = await api.get(`/posts/${postId}/comments/`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching comments", error);
        }
    };

    const handleHeartClick = async (commentId, hasHeartReacted, heartId) => {
        try {
            const { anonUserId } = useAuthStore.getState();
            console.log("Anon User ID being sent:", anonUserId);

            if (hasHeartReacted) {
                const response = await api.delete(`/comments/hearts/${heartId}/`);
                console.log("DELETED:", response.data);
                fetchComments();
            } else {
                const response = await api.post(`/comments/${commentId}/hearts/`, null, {
                    headers: { 'X-Anon-User-ID': anonUserId }
                });
                console.log("POSTEO:", response.data);
                fetchComments();
            }
        } catch (error) {
            console.error("Error handling heart:", error);
        }
    };

    const handleLikeClick = async (commentId, hasLikeReacted, likeId) => {
        try {
            const { anonUserId } = useAuthStore.getState();

            if (hasLikeReacted) {
                const response = await api.delete(`/comments/likes/${likeId}/`);
                console.log("DELETED:", response.data);
                fetchComments();
            } else {
                const response = await api.post(`/comments/${commentId}/likes/`, null, {
                    headers: { 'X-Anon-User-ID': anonUserId }
                });
                console.log("POSTEO:", response.data);
                fetchComments();
            }
        } catch (error) {
            console.error("Error handling LIKE:", error);
        }
    };

    const handleDislikeClick = async (commentId, hasDislikeReacted, dislikeId) => {
        try {
            const { anonUserId } = useAuthStore.getState();

            if (hasDislikeReacted) {
                const response = await api.delete(`/comments/dislikes/${dislikeId}/`);
                console.log("DELETED:", response.data);
                fetchComments();
            } else {
                const response = await api.post(`/comments/${commentId}/dislikes/`, null, {
                    headers: { 'X-Anon-User-ID': anonUserId }
                });
                console.log("POSTEO:", response.data);
                fetchComments();
            }
        } catch (error) {
            console.error("Error handling DISLIKE:", error);
        }
    };


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
                anon_user: !isRegisteredUser ? { id: storedAnonUserId, name: anonUsername } : null,
            };

            try {
                const response = await api.post(`/posts/${postId}/comments/`, newMessageData);
                const createdComment = response.data;
                setMessages((prevMessages) => [...prevMessages, createdComment]);
                setNewMessage('');
                setAnonUsername('');
                setNameError(false);
                Swal.fire({
                    title: "Posted!",
                    customClass: {
                        title: 'swal2-title',
                        content: 'swal2-content',
                    },
                    text: "Your comment has been successfully posted.",
                    timer: 1500
                });
                onCommentAdded();
            } catch (error) {
                console.error("There was an error creating the comment!", error);
            }
        } else if (!isRegisteredUser && !anonUsername.trim()) {
            setNameError(true);
        }
    };

    const handleDeleteComment = async (commentId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this...",
            customClass: {
                title: 'swal2-title',
                content: 'swal2-content',
            },
            showCancelButton: true,
            cancelButtonColor: "#807d7dd6",
            confirmButtonText: "Delete it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/comments/${commentId}/`);
                    setMessages(prevMessages => prevMessages.filter(message => message.id !== commentId));
                    Swal.fire({
                        title: "Deleted!",
                        customClass: {
                            title: 'swal2-title',
                            content: 'swal2-content',
                        },
                        text: "Your comment has been deleted.",
                        timer: 1500
                    });
                    onCommentDeleted();
                } catch (error) {
                    console.error("There was an error deleting the comment", error);
                }
            }
        });
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
                                className={nameError ? 'input-error' : 'new-message-input-name'}
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
                            : message.anon_user && message.anon_user.id === storedAnonUserId;

                        const hasHeartReacted = message.has_heart_reacted;
                        const heartId = message.heart_id;
                        const totalHeart = message.total_heart_reactions;

                        const hasLikeReacted = message.has_like_reacted;
                        const likeId = message.like_id;
                        const totalLike = message.total_like_reactions;

                        const hasDislikeReacted = message.has_dislike_reacted;
                        const dislikeId = message.dislike_id;
                        const totalDislike = message.total_dislike_reactions;

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
                                        {hasHeartReacted ? (
                                            <BiSolidHeart className='com-reaction-icon-heart-solid' onClick={() => handleHeartClick(message.id, hasHeartReacted, heartId)} />
                                        ) : (
                                            <BiHeart className='com-reaction-icon-heart' onClick={() => handleHeartClick(message.id, hasHeartReacted, null)} />
                                        )}
                                        <span className='total-comment-reactions'>{totalHeart}</span>

                                        {hasLikeReacted ? (
                                            <BiSolidLike className='com-reaction-icon-like-solid' onClick={() => handleLikeClick(message.id, hasLikeReacted, likeId)} />
                                        ) : (
                                            <BiLike className='com-reaction-icon-like' onClick={() => handleLikeClick(message.id, hasLikeReacted, null)} />
                                        )}
                                        <span className='total-comment-reactions'>{totalLike}</span>

                                        {hasDislikeReacted ? (
                                            <BiSolidDislike className='com-reaction-icon-dislike-solid' onClick={() => handleDislikeClick(message.id, hasDislikeReacted, dislikeId)} />
                                        ) : (
                                            <BiDislike className='com-reaction-icon-dislike' onClick={() => handleDislikeClick(message.id, hasDislikeReacted, null)} />
                                        )}
                                        <span className='total-comment-reactions'>{totalDislike}</span>

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