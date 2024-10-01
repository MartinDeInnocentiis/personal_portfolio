import './Footer.css'
import { Link, NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="footerContainer">
                <div className="row">
                    <div className="col">
                        <h4 className='footer-item-title' >CONTACT ME</h4>
                        <ul className='contact-me-list'>

                            <li>LinkedIn</li>
                            <li>WhatsApp</li>
                            <br />
                            <hr />
                            <br />
                            <li>Ciudad Autonoma de Buenos Aires,</li>
                            <li>Argentina.</li>
                        </ul>
                    </div>


                    <div className="col">
                        <h4 className='footer-item-title'>EXPLORE</h4>
                        <ul className='explore-list'>
                            <li className="footerList">
                                <NavLink to={"/"} className="nav-link-footer">Home</NavLink>
                            </li>
                            <li className="footerList">
                                <NavLink to={"/about"} className="nav-link-footer">About</NavLink>
                            </li>
                            <li className="footerList">
                                <NavLink to={"/projects"} className="nav-link-footer">Projects</NavLink>
                            </li>
                            <li className="footerList">
                                <NavLink to={"/contact"} className="nav-link-footer">Contact</NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="footerLogo">
                        <Link to={"/"} className="nav-link-logo">
                            {
                                <img src="/logo2.png" alt="Portfolio Logo" className="logo-footer" />
                            }
                        </Link>
                    </div>

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