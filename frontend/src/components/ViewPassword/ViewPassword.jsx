import React, { useState } from 'react';
import './ViewPassword.css';

const ViewPassword = ({ value, placeholder, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleMouseDown = () => {
        setShowPassword(true);
    };

    const handleMouseUp = () => {
        setShowPassword(false);
    };

    return (
        <div className='view-password-container'>
            <input
                className='view-password-input'
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange} // Usar onChange directamente desde los props
                placeholder={placeholder}
            />
            <button
                className='view-password-button'
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                type="button"
            >
                <img src="/eye.png" alt="See Password" className="eye-password"/>
            </button>
        </div>
    );
};

export default ViewPassword;