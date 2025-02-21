import React, { useState } from 'react';
import { Mail, KeyRound, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; 
import api from '../../api';
const AdvancedLogin = () => {
  const [loginType, setLoginType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setFormData({ email: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login Data:', { ...formData,  role: loginType  });
    try {
      const endpoint = loginType === "student" 
        ? api.studentSignin.url
        : api.adminSignin.url;
  
        console.log("endpoint:",endpoint);

      const response = await axios.post(`${endpoint}`, { ...formData, role: loginType });

      console.log("response:" , response);

      if (response.status === 200) {
        alert("Login successful!");
        if(loginType === 'student'){
          navigate('/student-dashboard');
        }
        else{
          navigate('/admin-dashboard');
        }
      } else {
        alert('Unable tO Login');
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Login failed! Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 selection:bg-blue-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border-4 border-blue-500/10 transform transition-all hover:scale-[1.01] hover:shadow-3xl duration-300">
        <div className="flex border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
          {['student', 'admin'].map((type) => (
            <button
              key={type}
              onClick={() => handleLoginTypeChange(type)}
              className={`w-1/2 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-500 flex items-center justify-center space-x-2 ${
                loginType === type ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 hover:bg-blue-100'
              }`}
            >
              <span>{type}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500 transition duration-300"
              required
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500 transition duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition duration-300">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center space-x-2"
          >
            <LogIn className="mr-2" />
            <span>Login</span>
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedLogin;
