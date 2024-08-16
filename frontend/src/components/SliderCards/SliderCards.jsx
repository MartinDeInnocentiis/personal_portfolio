import React, { useState } from 'react';
import './SliderCards.css';
import BackgroundCard from '../BackgroundCard/BackgroundCard';


const SliderCards = () => {
    const slidesData = [
        { title: 'Card 1', description: 'Description of Card 1' },
        { title: 'Card 2', description: 'Description of Card 2' },
        { title: 'Card 3', description: 'Description of Card 3' },
        { title: 'Card 4', description: 'Description of Card 4' },
        { title: 'Card 5', description: 'Description of Card 5' },
        { title: 'Card 6', description: 'Description of Card 6' },
        { title: 'Card 7', description: 'Description of Card 7' }
    ];

    const [active, setActive] = useState(3);

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
        <section className="slider">
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
        </section>
    );
};

export default SliderCards;