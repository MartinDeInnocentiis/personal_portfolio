import './FooterIcons.css';
import { FaWhatsapp, FaGithub,FaLinkedin } from "react-icons/fa";
import { FiMail } from "react-icons/fi";



const FooterIcons = () => {
  return (
    <div className='footericons-container'>
        <FaGithub className='icon-footer-1'/>
        <FaLinkedin className='icon-footer-1'/>
        <FaWhatsapp className='icon-footer-2'/>
        <FiMail className='icon-footer-2'/>
    </div>
  )
}

export default FooterIcons
