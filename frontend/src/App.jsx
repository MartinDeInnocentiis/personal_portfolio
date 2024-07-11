import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomeScreen from './screens/HomeScreen/HomeScreen.jsx';

function App() {

  return (
    <BrowserRouter>
      <div className='app'>
        <Header/>
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />
          </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App
