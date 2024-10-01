import {Link, NavLink} from 'react-router-dom';
import UserOrLogin from '../UserOrLogin/UserOrLogin';
import './Header.css';


const Header = () => {
  return (
    <header>
      <div className='navbar'>

        <Link to={'/'} className='nav-link-logo'>
            <div>
                {
                    <img src="/logo1.png" alt="Portfolio Logo" className='logo-header'/>
                }
            </div>
        </Link>

        <nav>
            <ul className='navbarList'>
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
                  <UserOrLogin/>
                </li>

            </ul>
        </nav>

      </div>
    </header>
  )
}

export default Header
