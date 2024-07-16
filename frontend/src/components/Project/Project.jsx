import './Project.css';

const Project = ({ project }) => {
    return (
        <div className="project-card-container">
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
                </div>
            </div>
        </div>
    );
};

export default Project;