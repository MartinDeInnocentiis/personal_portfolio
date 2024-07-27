import React, { useState, useEffect, useRef } from 'react';
import './TechTicker.css';

import { DiDjango, DiReact, DiDatabase, DiPython, DiJavascript, DiDocker, DiGithub, DiGoogleCloudPlatform, DiHtml5, DiCss3, DiSass } from 'react-icons/di';
import { BiLogoRedux, BiLogoDjango, BiLogoPostgresql  } from "react-icons/bi";
import { GrDocker, GrMysql } from "react-icons/gr";
import { SiMysql } from "react-icons/si";
import { FaGithub } from "react-icons/fa";

const items = [
    { icon: <DiReact />, name: 'React' },
    { icon: <BiLogoRedux />, name: 'Redux' },
    { icon: <BiLogoDjango />, name: 'Django' },
    { icon: <DiPython />, name: 'Python' },
    { icon: <DiJavascript />, name: 'JavaScript' },
    { icon: <DiGoogleCloudPlatform />, name: 'Google Cloud Platform' },
    { icon: <GrDocker />, name: 'Docker' },
    { icon: <BiLogoPostgresql  />, name: 'PostgreSQL' },
    { icon: <GrMysql  />, name: 'MySQL' },
    { icon: <FaGithub />, name: 'GitHub' },
    { icon: <DiHtml5 />, name: 'HTML' },
    { icon: <DiCss3 />, name: 'CSS' },
    { icon: <DiSass />, name: 'SaSS' },
  ];
  
  const TechTicker = () => {
    const [isPaused, setIsPaused] = useState(false);
    const tickerRef = useRef(null);
  
    useEffect(() => {
      const handleMouseEnter = () => setIsPaused(true);
      const handleMouseLeave = () => setIsPaused(false);
      
      const ticker = tickerRef.current;
      ticker.addEventListener('mouseenter', handleMouseEnter);
      ticker.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        ticker.removeEventListener('mouseenter', handleMouseEnter);
        ticker.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, []);
  
    return (
      <div className="ticker-container">
        <div ref={tickerRef} className={`ticker-content ${isPaused ? 'paused' : ''}`}>
          {items.concat(items).map((item, index) => (
            <div className="ticker-item" key={index}>
              <div className="icon">{item.icon}</div>
              <div className='item-name-div'>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default TechTicker;