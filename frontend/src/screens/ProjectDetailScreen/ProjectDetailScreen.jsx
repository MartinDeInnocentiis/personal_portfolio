import './ProjectDetailScreen.css';
import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../../components/CommentsSection/CommentsSection';
import { BiCommentDetail, BiLike, BiSolidLike, BiHeart, BiSolidHeart } from "react-icons/bi";
import useAuthStore from '../../store-zustand';
import api from '../../api';

const ProjectDetailScreen = () => {
    const { id } = useParams();
    const commentInputRef = useRef(null);
    const { user } = useAuthStore();

    const scrollToCommentInput = () => {
        if (commentInputRef.current) {
            commentInputRef.current.scrollIntoView({ behavior: 'smooth' });
            commentInputRef.current.focus();
        }
    };

    const [projectDetail, setProjectDetail] = useState(null);
    const [liked, setLiked] = useState(false);
    const [hearted, setHearted] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [heartId, setHeartId] = useState(null);

    const [totalLikes, setTotalLikes] = useState(0);
    const [totalHearts, setTotalHearts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    useEffect(() => {
        async function fetchData() {

            const storedLikeId = localStorage.getItem('likeId');
            const storedHeartId = localStorage.getItem('heartId');
    
            if (storedLikeId) {
                setLikeId(storedLikeId);
                setLiked(true);
            }
    
            if (storedHeartId) {
                setHeartId(storedHeartId);
                setHearted(true);
            }
    
            const { data } = await api.get(`/posts/${id}/`);
            setProjectDetail(data);
            setTotalLikes(data.total_likes);
            setTotalHearts(data.total_hearts);
            setTotalComments(data.total_comments);
    
            const userLike = data.likes.find(like => (user && like.user === user.id) || (user && user.anon_user_id && like.anon_user === user.anon_user_id));
            if (userLike) {
                setLikeId(userLike.id);
                localStorage.setItem('likeId', userLike.id);
            }
    
            const userHeart = data.hearts.find(heart => (user && heart.user === user.id) || (user && user.anon_user_id && heart.anon_user === user.anon_user_id));
            if (userHeart) {
                setHeartId(userHeart.id);
                localStorage.setItem('heartId', userHeart.id);
            }
        }
        fetchData();
    }, [id, user]);

/*   useEffect(() => {
        async function fetchData() {
            const { data } = await api.get(`/posts/${id}/`);
            setProjectDetail(data);
            setLiked(data.user_has_liked);
            setHearted(data.user_has_hearted);
            setTotalLikes(data.total_likes);
            setTotalHearts(data.total_hearts);
            setTotalComments(data.total_comments);

            setLikeId(data.like_id);
            setHeartId(data.heart_id);

            // FIND LIKE & HEART IDs IF THEY EXIST
            const userLike = data.likes.find(like => (user && like.user === user.id) || (user && user.anon_user_id && like.anon_user === user.anon_user_id));
            if (userLike) {
                setLikeId(userLike.id);
            }

            const userHeart = data.hearts.find(heart => (user && heart.user === user.id) || (user && user.anon_user_id && heart.anon_user === user.anon_user_id));
            if (userHeart) {
                setHeartId(userHeart.id);
            }
        }
        fetchData();
    }, [id, user]);*/


    /*const handleLike = async () => {
        try {
            if (!liked) {
                const response = await api.post(`/posts/${id}/likes/`);
                setLiked(true);
                const likeId = parseInt(response.data.id); // Asegúrate de que response.data.id es un número
                setLikeId(likeId);
                setTotalLikes(prev => prev + 1);  // Incrementa el conteo de likes
            } else {
                await api.delete(`/posts/likes/${likeId}/`);
                setLiked(false);
                setLikeId(null);
                setTotalLikes(prev => prev - 1);  // Decrementa el conteo de likes
            }
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };*/



    const handleLike = async () => {
        try {
            if (!liked) {
                const response = await api.post(`/posts/${id}/likes/`);
                setLiked(true);
                const likeId = parseInt(response.data.id);
                setLikeId(likeId);

                localStorage.setItem('likeId', response.data.id);

                setTotalLikes(prev => prev + 1);
            } else {
                if (likeId) {
                    await api.delete(`/posts/likes/${likeId}/`);
                    setLiked(false);
                    setLikeId(null);

                    localStorage.removeItem('likeId');

                    setTotalLikes(prev => prev - 1);
                }
            }
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };


    const handleHeart = async () => {
        try {
            if (!hearted) {
                const response = await api.post(`/posts/${id}/hearts/`);
                setHearted(true);
                const heartId = parseInt(response.data.id);
                setHeartId(heartId);

                localStorage.setItem('heartId', response.data.id);

                setTotalHearts(prev => prev + 1);
            } else {
                if (heartId) {
                    await api.delete(`/posts/hearts/${heartId}/`);
                    setHearted(false);
                    setHeartId(null);

                    localStorage.removeItem('heartId');

                    setTotalHearts(prev => prev - 1);
                }
            }
        } catch (error) {
            console.error('Error handling heart:', error);
        }
    };

    /*const handleHeart = async () => {
        try {
            if (!hearted) {
                const response = await api.post(`/posts/${id}/hearts/`);
                setHearted(true);
                console.log('Post HEART Response:', response);
                const heartId = parseInt(response.data.id);
                setHeartId(heartId);
                setTotalHearts(prev => prev + 1);
            } else {
                const response = await api.delete(`/posts/hearts/${heartId}/`);
                setHearted(false);
                console.log('Delete HEART Response:', response);
                setHeartId(null);
                setTotalHearts(prev => prev - 1);
            }
            setHearted(!hearted);
        } catch (error) {
            console.error('Error handling heart:', error);
        }
    };*/




    const handleNewCommentAdded = () => {
        setTotalComments(prevTotalComments => prevTotalComments + 1);
    };

    if (!projectDetail) {
        return <div className='project-not-found-div'> <p className='oops'> Oops! </p>  <p className='project-not-found'>Project not found... </p></div>

    }

    return (
        <div className='project-detail-container'>
            <Link to="/projects" className="back-button">Back</Link>
            <div className="project-detail-card">
                <img src={projectDetail.image} alt={projectDetail.title} className="project-detail-image" />
                <div className="project-detail-content">
                    <h2 className="project-detail-title">{projectDetail.title}</h2>
                    <p className="project-detail-description">{projectDetail.description}</p>
                    <div className="project-detail-reactions">
                        <span className="project-like" onClick={handleLike}>
                            {liked ? <BiSolidLike className='reaction-icon-like-solid' /> : <BiLike className='reaction-icon-like' />} <div> {totalLikes}</div>
                        </span>
                        <span className="project-heart" onClick={handleHeart}>
                            {hearted ? <BiSolidHeart className='reaction-icon-heart-solid' /> : <BiHeart className='reaction-icon-heart' />} <div> {totalHearts}</div>
                        </span>
                        <span className="project-comment">
                            <BiCommentDetail onClick={scrollToCommentInput} className='reaction-icon-comment' /> <div> {totalComments}</div>
                        </span>
                    </div>
                    <div className="project-detail-extra-info">
                        {/* Otra información extra del proyecto */}
                    </div>
                </div>
            </div>
            <div>
                <CommentsSection
                    comments={projectDetail.comments}
                    postId={id}
                    inputRef={commentInputRef}
                    onCommentAdded={handleNewCommentAdded} // PROPAGATING THE HANDLER DOWN
                />
            </div>
        </div>
    );
};

export default ProjectDetailScreen;