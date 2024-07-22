import {Link, NavLink} from 'react-router-dom';
import UserOrLogin from '../UserOrLogin/UserOrLogin';
import './Header.css';


const Header = () => {
  return (
    <header>
      <div className='navbar'>

        <Link to={'/'} className='nav-link'>
            <div>
                {
                    <img src="../public/logo1.png" alt="Portfolio Logo" className='logo-header'/>
                }
            </div>
        </Link>

        <nav>
            <ul className='navbarList'>
                <li className='objectList'>
                    <NavLink to={'/about/'} className="nav-link">About</NavLink>
                </li>

                <li className='objectList'>
                    <NavLink to={'/projects/'} className="nav-link">Projects</NavLink>
                </li>

                <li className='objectList'>
                    <NavLink to={'/contact/'} className="nav-link">Contact</NavLink>
                </li>

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
