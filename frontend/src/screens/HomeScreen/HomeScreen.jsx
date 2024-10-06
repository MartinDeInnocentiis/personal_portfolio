import './HomeScreen.css'
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TechTicker from '../../components/TechTicker/TechTicker'
import Typewriter from '../../components/Typewriter/Typewriter'
import SliderCards from '../../components/SliderCards/SliderCards'


const HomeScreen = () => {
  const homeSection2Ref = useRef(null);
  const history = useNavigate()

  const handleScroll = () => {
    history('/projects/');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className='home-general-container'>
        <div className='home-container1'>
          <h1 className='home-h1'>Hi! I´m
            <span className='my-name'> Martin De Innocentiis </span>
            <Typewriter />
          </h1>
          <h3 className='home-h3'>
            <p>Welcome to my digital portfolio.</p>
            <p>I am a Software and FullStack Web Developer. </p>
            <p>In here, you will find more about who I am and what I´ve been working on.</p>
            </h3>
          <button className='see-more' onClick={handleScroll}>See more</button>
        </div>
        <div className='home-container2'>
          FOTO

        </div>
      </div>

      <div className='home-section2'>
        <div className='subcontainer-2'>
          <p className='blinking-text'>My Tech Stack</p>
          <TechTicker />
        </div>
      </div>

      <div className='home-section3'>
        <div className='subcontainer-3'>
          <SliderCards />
        </div>
      </div>
    </>
  )
}

export default HomeScreen
