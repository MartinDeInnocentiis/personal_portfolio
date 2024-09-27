import './ProjectsScreen.css'
import Project from '../../components/Project/Project';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { ColorRing } from 'react-loader-spinner'



const ProjectsScreen = () => {

    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        async function fetchData() {
            const minimumLoadTime = new Promise(resolve => setTimeout(resolve, 300));

            try {
                const { data } = await api.get('/posts/');
                setProjects(data); 
            } catch (error) {
                console.error("Error fetching data:", error);
            }

            await Promise.all([minimumLoadTime]);

            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div className='projectsscreen-container'>
            <h1 className='projects-h1'>My Projects</h1>
            <div className='projects-container'>
                {loading ? (
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
                ) : (
                    projects.map(project => (
                        <Project key={project.id} project={project} />
                    ))
                )}
            </div>
        </div>
    );
};


export default ProjectsScreen;