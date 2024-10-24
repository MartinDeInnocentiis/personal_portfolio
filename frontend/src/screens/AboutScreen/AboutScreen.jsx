import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutScreen.css'

const AboutScreen = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const history = useNavigate()

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    const handleScroll = () => {
        history('/contact/');
        window.scrollTo(0, 0);
    };


    return (
        <div className='about-general-container'>

            <div className='about-container1'>
                <h1 className='about-h1'> About me... </h1>
                <div className={`about-h3 ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    <p>
                        I’m Martin De Innocentiis, a versatile Full Stack Developer and Data Engineer from Argentina, with a passion for problem-solving and creating impactful digital solutions.
                    </p>

                    <p>
                        My expertise spans both the Frontend—crafting seamless, responsive interfaces using ReactJS, HTML, and CSS—and the Backend, where I leverage Python, Django, DRF, PostgreSQL, and Docker to build robust, scalable web applications.
                    </p>

                    <p>
                        With extensive freelance experience in Frontend development, I’ve built sleek, user-friendly SPAs primarily with ReactJS for businesses and startups. On the Backend, I’ve developed and maintained APIs with Django and DRF, managing everything from API Views to PostgreSQL integration, and successfully deployed full-stack projects to AWS using EC2 and RDS, or to GCP using Cloud Engine and Cloud SQL.
                    </p>

                    <p>
                        As a Data Engineer, I specialize in orchestrating complex ETL processes with Python and GCP tools, ensuring data pipelines are efficient and reliable. My proficiency in Cloud Computing, particularly in Google Cloud Platform (GCP), includes creating and managing virtual machines, SQL databases, VPCs, IAM, BigQuery, Cloud Storage, and infrastructure automation with Terraform. I’ve implemented CI/CD pipelines utilizing GitHub Actions, Docker, and GCP Artifact Registry, and automated deployments with Cloud Functions, Cloud Run, and Cloud Scheduler.
                    </p>


                    <p>
                        I take a detail-oriented approach to my work, always striving to view projects from the client or end-user's perspective. My programming logic and expertise in OOP principles allow me to write clean, modular, and efficient code. I’m constantly seeking to refine my skill set, stay ahead of the latest tech trends, and take on new challenges.
                    </p>

                    <p>
                        Beyond my professional life, I’ve been practicing martial arts for many years. This journey has instilled in me a strong sense of discipline, focus, and mental resilience—qualities I bring into every challenge I take on.
                    </p>

                    <p>
                        Above all, I’m a team player, adaptable to changing environments, and passionate about delivering high-quality results.
                    </p>

                    <p className='final-p'>
                        If you’d like to learn more about my skills, discuss a project, or simply have a chat about how we can bring your ideas to life, feel free to <span className='reachout' onClick={handleScroll}> reach out</span>. I’m always open to new opportunities and collaborations, and I’d love to help turn your vision into reality.
                    </p>
                </div>
                <button className='read-more-button' onClick={toggleReadMore}>
                    {isExpanded ? 'See less' : 'See more'}
                </button>
            </div>

            <div className='about-container2'>

                <div className='h2-container'>
                    <h2 className='about-h2'>Educational profile</h2>
                </div>

                <div className='about-container3'>
                    <div className='education-item'>
                        <p className='about-p institute'>Google</p>
                        <p className='about-p title'>Associate Cloud Engineer</p>
                    </div>
                    <div className='education-item'>
                        <p className='about-p institute'>mundosE</p>
                        <p className='about-p title'>DevOps Career</p>
                    </div>
                    <div className='education-item'>
                        <p className='about-p institute'>Inove</p>
                        <p className='about-p title'>Django Backend</p>
                    </div>
                    <div className='education-item'>
                        <p className='about-p institute'>Coderhouse</p>
                        <p className='about-p title'>Frontend Career - ReactJS</p>
                    </div>
                    <div className='education-item'>
                        <p className='about-p institute'>ITMasters</p>
                        <p className='about-p title'>Python Developer</p>
                    </div>
                    <div className='education-item'>
                        <p className='about-p institute'>UBA</p>
                        <p className='about-p title'>Lawyer</p>
                    </div>
                    <div className='education-item'>
                        <p className='about-p institute'>Cambrdige U.</p>
                        <p className='about-p title'>First Certificate Exam</p>
                    </div>
                </div>

                <div className='h2-container'>
                    <h2 className='about-h2'>Work Experience</h2>
                </div>

                <div className='about-container3'>
                    <div className='work-item'>
                        <p className='about-p year'>08/2024 - to date</p>
                        <p className='about-p position'>Backend  &  Fullstack Developer <span className='where'>at Gestionar Logistica</span> </p>
                    </div>
                    <div className='work-item'>
                        <p className='about-p year'>04/2023 - to date</p>
                        <p className='about-p position'>FullStack Dev. / Data Eng. <span className='where'>at Havas Group</span> </p>
                    </div>
                    <div className='work-item'>
                        <p className='about-p year'>08/2022 - 02/2024</p>
                        <p className='about-p position'>FrontEnd Developer <span className='where'>(Freelancer)</span></p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default AboutScreen