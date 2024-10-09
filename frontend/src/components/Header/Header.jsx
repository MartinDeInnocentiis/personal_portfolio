import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import UserOrLogin from '../UserOrLogin/UserOrLogin';
import './Header.css';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className='navbar'>

        <Link to={'/'} className='nav-link-logo'>
          <div>
            {
              <img src="/logo1.png" alt="Portfolio Logo" className='logo-header' />
            }
          </div>
        </Link>

        <div className={`hamburger ${menuOpen ? 'is-active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`navbarList ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className='objectList'>
              <NavLink to={'/about/'} className={({ isActive }) => isActive ? "nav-link active-nav-link" : "nav-link"}>About</NavLink>
            </li>

            <li className='objectList'>
              <NavLink to={'/projects/'} className={({ isActive }) => isActive ? "nav-link active-nav-link" : "nav-link"}>Projects</NavLink>
            </li>

            <li className='objectList'>
              <NavLink to={'/contact/'} className={({ isActive }) => isActive ? "nav-link active-nav-link" : "nav-link"}>Contact</NavLink>
            </li>

            <div className="vertical-separator"></div>

            <li className='objectList'>
              <UserOrLogin />
            </li>

          </ul>
        </nav>

      </div>
    </header>
  )
}

export default Header
