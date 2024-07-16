import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import HomeScreen from './screens/HomeScreen/HomeScreen.jsx';
import AboutScreen from './screens/AboutScreen/AboutScreen.jsx';
import ProjectsScreen from './screens/ProjectsScreen/ProjectsScreen.jsx';
import ContactScreen from './screens/ContactScreen/ContactScreen.jsx';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen.jsx';
import LoginScreen from './screens/LoginScreen/LoginScreen.jsx';



function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<HomeScreen />} exact />
          <Route path='/about/' element={<AboutScreen />} exact />
          <Route path='/projects/' element={<ProjectsScreen />} exact />
          <Route path='/contact/' element={<ContactScreen />} exact />
          <Route path='/register/' element={<RegisterScreen />} exact />
          <Route path='/login/' element={<LoginScreen />} exact />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
