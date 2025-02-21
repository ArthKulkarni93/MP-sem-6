import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header/Header';
import Home from './Pages/HomePage/Home'
import Signup from './Pages/SignupPage/Signup'
import Login from './Pages/LoginPage/Login'
import StudentProfile from './Pages/ProfilePage/studentProfile'
import AdminProfile from './Pages/ProfilePage/adminProfile'
import AdminDashboard from './Admin/adminDashboard'
import AdminExams from './Admin/adminExam'
import AdminResults from './Admin/adminResult'
import StudentDashboard from './Student/studentDashboard'
import StudentExams from './Student/studentExam'
import StudentResults from './Student/studentResult'
function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/signup' element={<Signup/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/student-profile' element={<StudentProfile/>} />
    <Route path='/admin-profile' element={<AdminProfile/>} />
    <Route path='/student-dashboard' element={<StudentDashboard/>} />
    <Route path='/admin-dashboard' element={<AdminDashboard/>} />
    <Route path='/student-exams' element={<StudentExams/>} />
    <Route path='/admin-exams' element={<AdminExams/>} />
    <Route path='/student-results' element={<StudentResults/>} />
    <Route path='/admin-results' element={<AdminResults/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
