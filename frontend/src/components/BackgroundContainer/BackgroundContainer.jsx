import React from 'react';
import BackgroundCard from '../BackgroundCard/BackgroundCard';
import './BackgroundContainer.css';

function BackgroundContainer() {
    const cardsData = [
        { title: 'Card 1', description: 'This is the description for card 1.' },
        { title: 'Card 2', description: 'This is the description for card 2.' },
        { title: 'Card 3', description: 'This is the description for card 3.' },

    ];

    return (
        <div className="background-container">
            <p className='background-title'>My Background</p>
            <div className="background-container2">
                {cardsData.map((card, index) => (
                    <BackgroundCard
                        key={index}
                        title={card.title}
                        description={card.description}
                    />
                ))}
            </div>
        </div>
    );
}

export default BackgroundContainer;