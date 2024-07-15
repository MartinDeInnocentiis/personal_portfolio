import './ProjectsScreen.css'
import Project from '../../components/Project/Project';
import mockData from '../../mockData';


const ProjectsScreen = () => {
    return (
        <div className='projectsscreen-container'>
            <h1 className='projects-h1'>My Projects</h1>
            <div className='projects-container'>
                {mockData.map(project => (
                    <Project key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};


export default ProjectsScreen;