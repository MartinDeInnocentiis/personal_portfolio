import './FooterIcons.css';
import { FaWhatsapp, FaGithub,FaLinkedin } from "react-icons/fa";
import { FiMail } from "react-icons/fi";



const FooterIcons = () => {
  return (
    <div className='footericons-container'>
        <a href="https://www.linkedin.com/in/martin-de-innocentiis-python-developer-web-developer/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className='icon-footer-1'/>
        </a>
        <a href="https://github.com/MartinDeInnocentiis" target="_blank" rel="noopener noreferrer">
          <FaGithub className='icon-footer-1'/>
        </a>
        <a href="mailto:martindeinnocentiis90@gmail.com">
          <FiMail className='icon-footer-2'/>
        </a>
        <a href="https://wa.me/541144355724" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className='icon-footer-2'/>
        </a>
    </div>
  )
}

export default FooterIcons
