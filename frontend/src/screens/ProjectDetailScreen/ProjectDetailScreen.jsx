import './ProjectDetailScreen.css';
import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../../components/CommentsSection/CommentsSection';
import { BiCommentDetail, BiLike, BiSolidLike, BiHeart, BiSolidHeart } from "react-icons/bi";
import { ColorRing } from 'react-loader-spinner'
import useAuthStore from '../../store-zustand';
import api from '../../api';
import { IoArrowBackCircleSharp } from "react-icons/io5";



const ProjectDetailScreen = () => {
    const { id } = useParams();
    const commentInputRef = useRef(null);
    const { user, anonUserId } = useAuthStore();

    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [projectDetail, setProjectDetail] = useState(null);
    const [liked, setLiked] = useState(false);
    const [hearted, setHearted] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [heartId, setHeartId] = useState(null);
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalHearts, setTotalHearts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(`/posts/${id}/`);
                setProjectDetail(data);
                setTotalLikes(data.total_likes);
                setTotalHearts(data.total_hearts);
                setTotalComments(data.total_comments);
                setLiked(data.user_has_liked);
                setHearted(data.user_has_hearted);
                setLikeId(data.like_id);
                setHeartId(data.heart_id);
            } catch (error) {
                console.error('Error fetching project details:', error);
                setProjectDetail(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const scrollToCommentInput = () => {
        if (commentInputRef.current) {
            commentInputRef.current.scrollIntoView({ behavior: 'smooth' });
            commentInputRef.current.focus();
        }
    };

    const handleLike = async () => {
        try {
            if (!liked) {
                const response = await api.post(`/posts/${id}/likes/`, {}, {
                    headers: { 'X-Anon-User-ID': user ? undefined : anonUserId }
                });
                setLiked(true);
                setLikeId(response.data.id);
                setTotalLikes(prev => prev + 1);
            } else {
                await api.delete(`/posts/likes/${likeId}/`, {
                    headers: { 'X-Anon-User-ID': user ? undefined : anonUserId }
                });
                setLiked(false);
                setLikeId(null);
                setTotalLikes(prev => prev - 1);
            }
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    const handleHeart = async () => {
        try {
            if (!hearted) {
                const response = await api.post(`/posts/${id}/hearts/`, {}, {
                    headers: { 'X-Anon-User-ID': user ? undefined : anonUserId }
                });
                setHearted(true);
                setHeartId(response.data.id);
                setTotalHearts(prev => prev + 1);
            } else {
                await api.delete(`/posts/hearts/${heartId}/`, {
                    headers: { 'X-Anon-User-ID': user ? undefined : anonUserId }
                });
                setHearted(false);
                setHeartId(null);
                setTotalHearts(prev => prev - 1);
            }
        } catch (error) {
            console.error('Error handling heart:', error);
        }
    };

    const handleNewCommentAdded = () => {
        setTotalComments(prevTotalComments => prevTotalComments + 1);
    };

    const handleCommentDeleted = () => {
        setTotalComments(prevTotalComments => prevTotalComments - 1);
    };

    if (loading) {
        return (
            <div className="loader-container">
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
        );
    }

    if (!projectDetail) {
        return (
            <div>
                <Link to='/projects/'> <IoArrowBackCircleSharp className='back-arrow-projects' title='Back' /> </Link>
                <div className='project-not-found-div'>
                    <p className='oops'>Oops!</p>
                    <p className='project-not-found'>Project not found...</p>
                </div>
            </div>
        );
    }

    // Mapeamos las tecnologías con #
    const stackWithHashtags = projectDetail.stack
        ? projectDetail.stack.split(', ').map((tech) => `#${tech}`)
        : [];

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };


    return (
        <>
            <Link to='/projects/'> <IoArrowBackCircleSharp className='back-arrow-projects' title='Back' /> </Link>
            <div className='project-detail-container'>
                <div className="project-detail-card">
                    <img src={projectDetail.image} alt={projectDetail.title} className="project-detail-image" />
                    <div className="project-detail-content">
                        <h2 className="project-detail-title">{projectDetail.title}</h2>
                        <p className="project-detail-description">{projectDetail.description}</p>
                        <div className="project-detail-reactions">
                            <span className="project-like">
                                {liked ? <BiSolidLike className='reaction-icon-like-solid' onClick={handleLike} title='Like' /> : <BiLike className='reaction-icon-like' onClick={handleLike} title='Like' />} <div> {totalLikes}</div>
                            </span>
                            <span className="project-heart">
                                {hearted ? <BiSolidHeart className='reaction-icon-heart-solid' onClick={handleHeart} title='Heart' /> : <BiHeart className='reaction-icon-heart' onClick={handleHeart} title='Heart' />} <div> {totalHearts}</div>
                            </span>
                            <span className="project-comment">
                                <BiCommentDetail onClick={scrollToCommentInput} className='reaction-icon-comment' title='Comment' /> <div> {totalComments}</div>
                            </span>
                        </div>
                        <div className='expand-button-container'>
                            <button onClick={toggleExpand} className={`expand-button ${isExpanded ? 'expanded' : ''}`}>
                                <span className='span-button-detail'> {isExpanded ? 'Hide details' : 'View details'}</span>
                            </button>
                        </div>
                        <div className={`stack-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
                            <div className='stack-container2'>
                                <p className='details-p'>Website: <span className='website-link'>{projectDetail.website_link}</span></p>
                                <p className='details-p'>GitHub: <span className='github-link'>{projectDetail.github_link}</span></p>
                                <p className='details-p'>Status: <span className='status'>{projectDetail.status}</span></p>
                                <hr className='hr-details' />
                                <div className="stack-tags">
                                    {stackWithHashtags.map((hashtag, index) => (
                                        <span key={index} className="stack-hashtag">{hashtag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <CommentsSection
                        comments={projectDetail.comments}
                        postId={id}
                        inputRef={commentInputRef}
                        onCommentAdded={handleNewCommentAdded}
                        onCommentDeleted={handleCommentDeleted}
                    />
                </div>
            </div>
        </>
    );
};

export default ProjectDetailScreen;