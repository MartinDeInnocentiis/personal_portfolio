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
    const { user } = useAuthStore();

    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(true);

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
            const minimumLoadTime = new Promise(resolve => setTimeout(resolve, 400));
            try {
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


                await Promise.all([minimumLoadTime]);
                setLoading(false);

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
            } catch (error) {
                console.error('Error fetching project details:', error);
                setProjectDetail(null);
            } finally {
                await minimumLoadTime;
                setLoading(false);
            }
        }
        fetchData();
    }, [id, user]);

    // Verificamos si projectDetail está disponible
    //if (!projectDetail) {
    //    return <div>Loading...</div>;
    //}

    //if (!projectDetail) {
    //    return <div className='project-not-found-div'> <p className='oops'> Oops! </p>  <p className='project-not-found'>Project not found... </p></div>

    //}


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
            <div className='project-not-found-div'>
                <p className='oops'>Oops!</p>
                <p className='project-not-found'>Project not found...</p>
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




    const handleNewCommentAdded = () => {
        setTotalComments(prevTotalComments => prevTotalComments + 1);
    };

    const handleCommentDeleted = () => {
        setTotalComments(prevTotalComments => prevTotalComments - 1);
    };


    return (
        <>
            <Link to='/projects/'> <IoArrowBackCircleSharp className='back-arrow-projects' title='Back'/> </Link>

                <div className='project-detail-container'>


                    <div className="project-detail-card">
                        <img src={projectDetail.image} alt={projectDetail.title} className="project-detail-image" />
                        <div className="project-detail-content">
                            <h2 className="project-detail-title">{projectDetail.title}</h2>
                            <p className="project-detail-description">{projectDetail.description}</p>


                            <div className="project-detail-reactions">
                                <span className="project-like">
                                    {liked ? <BiSolidLike className='reaction-icon-like-solid' onClick={handleLike} title='Like'/> : <BiLike className='reaction-icon-like' onClick={handleLike} title='Like'/>} <div> {totalLikes}</div>
                                </span>
                                <span className="project-heart">
                                    {hearted ? <BiSolidHeart className='reaction-icon-heart-solid' onClick={handleHeart} title='Heart'/> : <BiHeart className='reaction-icon-heart' onClick={handleHeart} title='Heart'/>} <div> {totalHearts}</div>
                                </span>
                                <span className="project-comment">
                                    <BiCommentDetail onClick={scrollToCommentInput} className='reaction-icon-comment' title='Comment'/> <div> {totalComments}</div>
                                </span>
                            </div>
                            <div className="project-detail-extra-info">
                                {/* Otra información extra del proyecto */}
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
                                        <span className='stack-title'>Tech Stack:</span>
                                        <div className="stack-grid">
                                            {stackWithHashtags.map((hashtag, index) => (
                                                <span key={index} className="stack-hashtag">
                                                    {hashtag}
                                                </span>
                                            ))}
                                        </div>
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
                            onCommentAdded={handleNewCommentAdded} // PROPAGATING THE HANDLER DOWN
                            onCommentDeleted={handleCommentDeleted}
                        />
                    </div>

                </div>
        </>
    );
};

export default ProjectDetailScreen;