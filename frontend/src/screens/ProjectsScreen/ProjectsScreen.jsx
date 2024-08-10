import './ProjectsScreen.css'
import Project from '../../components/Project/Project';

import axios from 'axios';
import React, {useState, useEffect} from 'react';
import api from '../../api';



const ProjectsScreen = () => {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        async function fetchData() {
            const { data } = await api.get('/posts/')
            setProjects(data)
        }
        fetchData()
    }, [])

    return (
        <div className='projectsscreen-container'>
            <h1 className='projects-h1'>My Projects</h1>
            <div className='projects-container'>
                {projects.map(project => (
                    <Project key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};


export default ProjectsScreen;