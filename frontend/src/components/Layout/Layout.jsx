import { useLocation } from 'react-router-dom';
import './Layout.css';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';


const Layout = ({ children }) => {
  const location = useLocation();
  const noHeaderFooter = location.pathname === '/login/' || location.pathname === '/register/';

  return (
    <div className='app'>
      {!noHeaderFooter && <Header />}
      {children}
      {!noHeaderFooter && <Footer />}
    </div>
  );
};

export default Layout;