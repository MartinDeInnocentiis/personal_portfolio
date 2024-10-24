import './FooterIcons.css';
import { FaWhatsapp, FaGithub,FaLinkedin } from "react-icons/fa";
import { FiMail } from "react-icons/fi";



const FooterIcons = () => {
  return (
    <div className='footericons-container'>
        <FaLinkedin className='icon-footer-1'/>
        <FaGithub className='icon-footer-1'/>
        <FiMail className='icon-footer-2'/>
        <FaWhatsapp className='icon-footer-2'/>
    </div>
  )
}

export default FooterIcons
