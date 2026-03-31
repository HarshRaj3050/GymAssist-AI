import React from 'react'
import Navbar from './components/NavBar'
import { Routes, Route } from "react-router-dom";
import About from './pages/user/About';
import Home from './pages/user/Home';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/user/Dashboard';
import QRScanner from './pages/user/QRScanner';


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/verify-email' element={<VerifyEmail/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/Dashboard' element={<Dashboard/>}></Route>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/scanner" element={<QRScanner/>} />
      </Routes>
    </>
  )
}

export default App