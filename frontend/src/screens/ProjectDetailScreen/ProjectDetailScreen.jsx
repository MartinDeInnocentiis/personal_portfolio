import './ProjectDetailScreen.css';
import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../../components/CommentsSection/CommentsSection';
import mockData from '../../mockData';


const ProjectDetailScreen = () => {
    const { id } = useParams();
    const project = mockData.find(p => p.id === parseInt(id));
    const commentInputRef = useRef(null);

    if (!project) {
        return <div>Project not found</div>;
    }

    /*const scrollToComments = () => {
        if (commentsRef.current) {
            commentsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };*/
    const scrollToCommentInput = () => {
        if (commentInputRef.current) {
            commentInputRef.current.focus();
        }
    };

    return (
        <div className='project-detail-container'>
            <Link to="/projects" className="back-button">Back</Link>
            <div className="project-detail-card">
                <img src={project.image} alt={project.title} className="project-detail-image" />
                <div className="project-detail-content">
                    <h2 className="project-detail-title">{project.title}</h2>
                    <p className="project-detail-description">{project.description}</p>
                    <div className="project-detail-reactions">
                        <span className="project-like">
                            <img src="/like.png" alt="like icon" className="reaction-icon" /> {project.likes}
                        </span>
                        <span className="project-heart">
                            <img src="/heart.png" alt="heart icon" className="reaction-icon" /> {project.hearts}
                        </span>
                        <span className="project-comment" onClick={scrollToCommentInput}>
                            <img src="/comment.png" alt="comment icon" className="reaction-icon" /> {project.comments}
                        </span>
                    </div>
                    <div className="project-detail-extra-info">
                        <p><strong>Start Date:</strong> {project.startDate || 'N/A'}</p>
                        <p><strong>Technologies:</strong> {project.technologies ? project.technologies.join(', ') : 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div>
                <CommentsSection inputRef={commentInputRef}/>
            </div>
        </div>
    );
};

export default ProjectDetailScreen;