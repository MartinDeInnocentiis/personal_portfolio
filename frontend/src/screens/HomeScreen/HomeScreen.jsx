import './HomeScreen.css'
import TechTicker from '../../components/TechTicker/TechTicker'
import Typewriter from '../../components/Typewriter/Typewriter'
import SliderCards from '../../components/SliderCards/SliderCards'


const HomeScreen = () => {
  return (
    <>
      <div className='home-general-container'>
        <div className='home-container1'>
          <h1 className='home-h1'>Hi! I´m
            <span className='my-name'> Martin De Innocentiis </span>
            <Typewriter />
          </h1>
          <h3 className='home-h3'>Welcome to my digital portfolio. I am a Software and FullStack Web Developer. In here, you will find more about who I am and what I´ve been working on.</h3>
        </div>
        <div className='home-container2'>
          AAAAAAAAAAAAAAAAAAAAAAAA

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
