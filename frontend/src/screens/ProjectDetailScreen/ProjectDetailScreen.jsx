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

    useEffect(() => {
        async function fetchData() {
            const { data } = await api.get(`/posts/${id}/`);
            setProjectDetail(data);
            setLiked(data.user_has_liked);
            setHearted(data.user_has_hearted);

            // Encuentra el ID del like y heart si existen
            if (data.likes.length > 0) {
                const userLike = data.likes.find(like => like.user === user.id || like.anon_user === user.anon_user_id);
                if (userLike) setLikeId(userLike.id);
            }
            if (data.hearts.length > 0) {
                const userHeart = data.hearts.find(heart => heart.user === user.id || heart.anon_user === user.anon_user_id);
                if (userHeart) setHeartId(userHeart.id);
            }
        }
        fetchData();
    }, [id, user]);

    /*const handleLike = async (likeId) => {
        try {
            if (liked) {
                const response = await api.delete(`/posts/likes/${likeId}/`);
                console.log('Delete Like Response:', response);
                setLikeId(null);
            } else {
                const response = await api.post(`/posts/${id}/likes/`);
                console.log('Post Like Response:', response);
                setLikeId(response.data.id);
                console.log('EL ID DEL LIKE', response.data.id)
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error handling like!!!!!!!!!:', error);
        }
    };*/

    const handleLike = async () => {
        try {
            if (!liked) {
                const response = await api.post(`/posts/${id}/likes/`);
                console.log('Post Like Response:', response);
                const likeId = parseInt(response.data.id); // Asegúrate de que response.data.id es un número
                setLikeId(likeId);
                console.log(`El ID del like es: /posts/likes/${likeId}/`);
            } else {
                const response = await api.delete(`/posts/likes/${likeId}/`);
                console.log('Delete Like Response:', response);
                setLikeId(null);
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    const handleHeart = async () => {
        try {
            if (!hearted) {
                const response = await api.post(`/posts/${id}/hearts/`);
                console.log('Post HEART Response:', response);
                const heartId = parseInt(response.data.id); 
                setHeartId(heartId);
                console.log(`El ID del HEART es: /posts/hearts/${heartId}/`);
            } else {
                const response = await api.delete(`/posts/hearts/${heartId}/`);
                console.log('Delete HEART Response:', response);
                setHeartId(null);
            }
            setHearted(!hearted);
        } catch (error) {
            console.error('Error handling heart:', error);
        }
    };

/*    const handleHeart = async () => {
        try {
            if (hearted) {
                const response = await api.delete(`/posts/hearts/${heartId}/`);
                console.log('Delete Heart Response:', response);
                setHeartId(null);
            } else {
                const response = await api.post(`/posts/${id}/hearts/`);
                console.log('Post Heart Response:', response);
                setHeartId(response.data.id);
            }
            setHearted(!hearted);
        } catch (error) {
            console.error('Error handling heart:', error);
        }
    };*/

    if (!projectDetail) {
        return <div>Project not found</div>;
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
                            {liked ? <BiSolidLike className='reaction-icon-like-solid' /> : <BiLike className='reaction-icon-like' />} <div> {projectDetail.likes}</div>
                        </span>
                        <span className="project-heart" onClick={handleHeart}>
                            {hearted ? <BiSolidHeart className='reaction-icon-heart-solid' /> : <BiHeart className='reaction-icon-heart' />} <div> {projectDetail.hearts}</div>
                        </span>
                        <span className="project-comment">
                            <BiCommentDetail onClick={scrollToCommentInput} className='reaction-icon-comment' /> <div> {projectDetail.total_comments}</div>
                        </span>
                    </div>
                    <div className="project-detail-extra-info">
                        {/* Otra información extra del proyecto */}
                    </div>
                </div>
            </div>
            <div>
                <CommentsSection comments={projectDetail.comments} postId={id} inputRef={commentInputRef} />
            </div>
        </div>
    );
};

export default ProjectDetailScreen;