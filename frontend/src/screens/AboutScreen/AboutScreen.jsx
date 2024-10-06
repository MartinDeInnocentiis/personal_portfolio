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

                    <h2 className='about-h2'>Educational profile</h2></div>
                <div className='about-container3'>
                    <div className='column1'>
                        <p className='about-p'>Google </p>
                        <p className='about-p'>mundosE</p>
                        <p className='about-p'>Inove </p>
                        <p className='about-p'>Coderhouse </p>
                        <p className='about-p'>ITMasters </p>
                        <p className='about-p'>UBA </p>
                        <p className='about-p'>Oxford University </p>
                    </div>
                    <div className='column2'>
                        <p className='about-p'>|  asdasd</p>
                        <p className='about-p'>|  asdasd</p>
                        <p className='about-p'>|  asdads</p>
                        <p className='about-p'>|  asdasd</p>
                        <p className='about-p'>|  asdasd</p>
                        <p className='about-p'>|  asdads</p>
                        <p className='about-p'>|  asdasd</p>
                    </div>
                </div>


                <div className='h2-container'>
                    <h2 className='about-h2'>Work Experience</h2></div>
                <div className='about-container3'>
                    <div className='column1'>
                        <p className='about-p'>2023 - up to date </p>
                        <p className='about-p'>2022 - up to date </p>
                        <p className='about-p'>2013 - 2023 </p>
                    </div>
                    <div className='column2'>
                        <p className='about-p'>|  FullStack Dev. / Data Engineer</p>
                        <p className='about-p'>|  FrontEnd Dev. (Freelancer)</p>
                        <p className='about-p'>|  Chief Officer</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AboutScreen