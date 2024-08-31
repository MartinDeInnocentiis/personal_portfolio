import './Project.css';
import { Link } from 'react-router-dom'
import { BiCommentDetail, BiLike, BiSolidLike, BiHeart, BiSolidHeart } from "react-icons/bi";


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
                            <BiSolidLike alt="like icon" className="reaction-icon"/> {project.total_likes}
                        </span>
                        <span className="project-heart">
                            <BiSolidHeart alt="heart icon" className="reaction-icon" /> {project.total_hearts}
                        </span>
                        <span className="project-comment">
                            <BiCommentDetail alt="comment icon" className="reaction-icon" /> {project.total_comments}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Project;