import React, { useState } from 'react';
import { 
  Mail, 
  KeyRound, 
  EyeIcon, 
  EyeOffIcon,
  LogIn 
} from 'lucide-react';

const AdvancedLogin = () => {
  const [loginType, setLoginType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setFormData({
      email: '',
      password: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      role: loginType
    };
    console.log('Login Data:', submissionData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 selection:bg-blue-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border-4 border-blue-500/10 transform transition-all hover:scale-[1.01] hover:shadow-3xl duration-300">
        {/* Login Type Selection */}
        <div className="flex border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
          {['student', 'teacher'].map((type) => (
            <button
              key={type}
              onClick={() => handleLoginTypeChange(type)}
              className={`
                w-1/2 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-500 
                flex items-center justify-center space-x-2 group
                ${loginType === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-blue-100'}
              `}
            >
              {type === 'student' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className={`
                  w-6 h-6 transition-transform duration-300
                  ${loginType === 'student' ? 'scale-110 text-white' : 'group-hover:scale-110'}
                `} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7v10c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V7l-8-4z" />
                  <path d="M8 17v-7" />
                  <path d="M16 17v-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className={`
                  w-6 h-6 transition-transform duration-300
                  ${loginType === 'teacher' ? 'scale-110 text-white' : 'group-hover:scale-110'}
                `} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 6.1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2z" />
                  <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M22 13a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z" />
                </svg>
              )}
              <span>{type}</span>
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form 
          onSubmit={handleSubmit} 
          className="p-6 space-y-4 relative"
        >
          {/* Email Input */}
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

          {/* Password Input */}
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              type={showPassword ? "text" : "password"}
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
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-800 transition duration-300"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg 
            hover:from-blue-700 hover:to-purple-700 transition duration-500 
            transform hover:scale-105 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-blue-500 
            flex items-center justify-center space-x-2 group"
          >
            <LogIn className="mr-2" />
            <span>Login</span>
          </button>

          {/* Signup Link */}
          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedLogin;