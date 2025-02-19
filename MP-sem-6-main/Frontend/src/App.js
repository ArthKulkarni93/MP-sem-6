import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header/Header';
import Home from './Pages/HomePage/Home'
import Signup from './Pages/SignupPage/Signup'
import Login from './Pages/LoginPage/Login'
import StudentProfile from './Pages/ProfilePage/studentProfile'
import AdminProfile from './Pages/ProfilePage/adminProfile'
function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/signup' element={<Signup/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/studentprofile' element={<StudentProfile/>} />
    <Route path='/adminprofile' element={<AdminProfile/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
