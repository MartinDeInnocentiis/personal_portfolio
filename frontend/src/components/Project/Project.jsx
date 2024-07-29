import './Project.css';
import { Link } from 'react-router-dom'


const Project = ({ project }) => {


    return (
        <div className="project-card-container">
            <Link className='project-card-link' to={`/projects/${project.id}/`}>
                <img src={project.image} alt={project.title} className="project-image" />
                <div className="project-content">
                    <div className='project-info'>
                        <h2 className="project-title">{project.title}</h2>
                        <p className="project-description">{project.description}</p>
                    </div>
                    <div className="project-reactions">
                        <span className="project-like">
                            <img src="/like.png" alt="like icon" className="reaction-icon" /> {project.likes}
                        </span>
                        <span className="project-heart">
                            <img src="/heart.png" alt="heart icon" className="reaction-icon" /> {project.hearts}
                        </span>
                        <span className="project-comment">
                            <img src="/comment.png" alt="comment icon" className="reaction-icon" /> {project.total_comments}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Project;