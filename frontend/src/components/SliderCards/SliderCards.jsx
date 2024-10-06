import React, { useState, useEffect } from 'react';
import './SliderCards.css';
import BackgroundCard from '../BackgroundCard/BackgroundCard';


const SliderCards = () => {
    const slidesData = [
        { title: 'Data Engineer', description: 'With a focus on Python, GCP, and big data tools like Spark and Dask, I orchestrate complex ETL processes. Proficient in Numpy, Pandas, and workflow automation, I deliver efficient and optimized data pipelines for large-scale operations.' },
        { title: 'Frontend Developer', description: 'Creating responsive and interactive user interfaces with ReactJS, or NextJS is my forte. I bring concepts to life with HTML, CSS, and JavaScript, using Zustand - Redux for effective state management and streamlined user experiences, while maintaining a clean, well-structured designs.' },
        { title: 'Full Stack Developer', description: 'I build end-to-end web applications, seamlessly integrating the frontend and backend. Using Django, DRF, ReactJS, and Redux -  Zustand, I deliver scalable and dynamic solutions. Skilled in Python, Docker, and managing databases, I ensure smooth deployments and performance.' },
        { title: 'Backend Developer', description: 'Specialized in Python, Django, and Flask, I develop robust APIs with DRF and ensure smooth backend operations. I’m experienced in Docker, PostgreSQL, and integrating Swagger for API documentation, ensuring secure and scalable systems.' },
        { title: 'Cloud Engineer', description: 'Leveraging the power of GCP and AWS, I deploy and manage scalable cloud infrastructures. From setting up VMs, VPCs, and databases to automating tasks with Terraform, Cloud Functions, and CI/CD pipelines, I ensure secure and efficient cloud solutions.' }
    ];

    const [active, setActive] = useState(2);

    useEffect(() => {
        const target = document.querySelector(".background-text");

        const observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                target.classList.add("animate");
                observer.unobserve(target);
            }
        }, { threshold: 0.1 });

        observer.observe(target);


        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, []);

    const loadShow = () => {
        return slidesData.map((slide, index) => {
            let style = {};
            if (index === active) {
                style = { transform: `none`, zIndex: 1, filter: 'none', opacity: 1 };
            } else if (index > active) {
                const stt = index - active;
                style = {
                    transform: `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(-1deg)`,
                    zIndex: -stt,
                    filter: 'blur(5px)',
                    opacity: stt > 2 ? 0 : 0.6
                };
            } else {
                const stt = active - index;
                style = {
                    transform: `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(1deg)`,
                    zIndex: -stt,
                    filter: 'blur(5px)',
                    opacity: stt > 2 ? 0 : 0.6
                };
            }
            return { ...slide, style };
        });
    };

    const nextSlide = () => {
        setActive(prevActive => (prevActive + 1 < slidesData.length ? prevActive + 1 : prevActive));
    };

    const prevSlide = () => {
        setActive(prevActive => (prevActive - 1 >= 0 ? prevActive - 1 : prevActive));
    };

    const renderedSlides = loadShow();

    return (
        <>
            <p className='background-text'>
                <span>M</span><span>y</span> <span class="space"> </span> <span>B</span><span>a</span><span>c</span><span>k</span><span>g</span><span>r</span><span>o</span><span>u</span><span>n</span><span>d</span>

            </p>
            <section className="slider">
                <div className='container-slider'>
                    <div className="slides-container">
                        {renderedSlides.map((slide, index) => (
                            <div
                                className={index === active ? 'slide active' : 'slide'}
                                key={index}
                                style={slide.style}
                            >
                                <BackgroundCard title={slide.title} description={slide.description} />
                            </div>
                        ))}

                    </div>
                    <div className='arrows-container'>
                        <button className="left-arrow" onClick={prevSlide}>&#10094;</button>
                        <button className="right-arrow" onClick={nextSlide}>&#10095;</button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SliderCards;