import './ProjectDetailScreen.css';
import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../../components/CommentsSection/CommentsSection';
import axios from 'axios';


const ProjectDetailScreen = () => {
    
    const { id } = useParams();
    const commentInputRef = useRef(null);

    
    const scrollToCommentInput = () => {
        if (commentInputRef.current) {
            commentInputRef.current.focus();
        }
    };

    const [projectDetail, setProjectDetail] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const { data } = await axios.get(`http://127.0.0.1:8000/api/posts/${id}/`)
            setProjectDetail(data)
        }
        fetchData()
    }, [])


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
                        <span className="project-like">
                            <img src="/like.png" alt="like icon" className="reaction-icon-like" /> {projectDetail.likes}
                        </span>
                        <span className="project-heart">
                            <img src="/heart.png" alt="heart icon" className="reaction-icon-heart" /> {projectDetail.hearts}
                        </span>
                        <span className="project-comment">
                            <img src="/comment.png" alt="comment icon" className="reaction-icon-comment" onClick={scrollToCommentInput}/> {projectDetail.total_comments}
                        </span>
                    </div>
                    <div className="project-detail-extra-info">

                    </div>
                </div>
            </div>
            <div>
                <CommentsSection comments={projectDetail.comments} postId= {id} inputRef={commentInputRef} />
            </div>
        </div>
    );
};

export default ProjectDetailScreen;