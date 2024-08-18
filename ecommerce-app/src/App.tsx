import React  from 'react';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './components/Login/LoginPage';
import SignUpPage from './components/SignUP/SignUpPage';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </Router>
      <ToastContainer hideProgressBar={true} autoClose={2000} position='bottom-right' />
    </>
  )
}

export default App
