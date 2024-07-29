import React, { useEffect, useState } from 'react';
import './Typewriter.css';

const roles = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Engineer',
  'Cloud Engineer',
];

const Typewriter = () => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);
    const [delay, setDelay] = useState(900); 
  
    useEffect(() => {
      let timer;
      const handleTyping = () => {
        const i = loopNum % roles.length;
        const fullText = roles[i];
  
        if (isDeleting) {
          setText(fullText.substring(0, text.length - 1));
          setTypingSpeed(50);
        } else {
          setText(fullText.substring(0, text.length + 1));
          setTypingSpeed(150);
        }
  
        if (!isDeleting && text === fullText) {
            
          setTimeout(() => setIsDeleting(true), delay);
        } else if (isDeleting && text === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
  
        timer = setTimeout(handleTyping, typingSpeed);
      };
  
      timer = setTimeout(handleTyping, typingSpeed);
  
      return () => clearTimeout(timer);
    }, [text, isDeleting, typingSpeed, loopNum, delay]);
  
    return (
      <p className="typewriter">{text}</p>
    );
  };
  
  export default Typewriter;