import './Footer.css'
import { Link, NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="footerContainer">
                <div className='footer-cols-container'>
                    <div className="footer-col1">
                        <h4 className='footer-item-title' >CONTACT ME</h4>
                        <ul className='contact-me-list'>

                            <li className='footer-li'>LinkedIn</li>
                            <li className='footer-li'>WhatsApp</li>
                            <br />
                            <hr className='footerhr'/>
                            <br />
                            <li className='footer-li-location'>Buenos Aires,</li>
                            <li className='footer-li-location'>Argentina.</li>
                        </ul>
                    </div>


                    <div className="footer-col2">
                        <h4 className='footer-item-title'>EXPLORE</h4>
                        <ul className='explore-list'>
                            <li className="footerList">
                                <NavLink to={"/"} className="footlink">Home</NavLink>
                            </li>
                            <li className="footerList">

                                <NavLink to={"/about/"} className="footlink">About</NavLink>
                            </li>
                            <li className="footerList">
                                <NavLink to={"/projects/"} className="footlink">Projects</NavLink>
                            </li>
                            <li className="footerList">
                                <NavLink to={"/contact/"} className="footlink">Contact</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-col3">
                    <Link to={"/"} className="footlink-logo">
                        {
                            <img src="/logo2.png" alt="Portfolio Logo" className="logofoot" />
                        }
                    </Link>
                </div>

            </div>
            <div className='copyright'>
                <div className='copyright-div'>
                    2024
                    <span className='copyright-span'> | </span> Martín De Innocentiis
                </div>
            </div>
        </footer>
    )
}

export default Footer