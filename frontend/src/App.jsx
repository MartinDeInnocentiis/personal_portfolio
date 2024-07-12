import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomeScreen from './screens/HomeScreen/HomeScreen.jsx';
import AboutScreen from './screens/AboutScreen/AboutScreen.jsx';


function App() {

  return (
    <BrowserRouter>
      <div className='app'>
        <Header/>
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />
            <Route path='/about/' element={<AboutScreen />} exact />

          </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App
