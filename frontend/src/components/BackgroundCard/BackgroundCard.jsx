import React from 'react';
import './BackgroundCard.css';

function BackgroundCard({ title, description }) {
    return (
        <div className="background-card">

            <div className='background-card-title-container'>
                <h3 className="background-card-title">{title}</h3>
            </div>

            <div className='background-card-description-container'>
                <p className="background-card-description">{description}</p>
            </div>
            
        </div>
    );
}

export default BackgroundCard;