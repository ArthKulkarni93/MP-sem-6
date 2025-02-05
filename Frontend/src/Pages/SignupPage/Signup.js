import React, { useState } from 'react';
import { 
  UserCircle2, 
  GraduationCap, 
  Mail, 
  Phone, 
  KeyRound, 
  EyeIcon, 
  EyeOffIcon 
} from 'lucide-react';

const RoleBasedSignup = () => {
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
    prn: role === 'teacher' ? '' : undefined
  });

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobileNo: '',
      password: '',
      confirmPassword: '',
      prn: selectedRole === 'teacher' ? '' : undefined
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
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const submissionData = {
      ...formData,
      role: role
    };

    console.log('Signup Data:', submissionData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 selection:bg-blue-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border-4 border-blue-500/10 transform transition-all hover:scale-[1.01] hover:shadow-3xl duration-300">
        {/* Animated Role Selection */}
        <div className="flex border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
          {['student', 'teacher'].map((userRole) => (
            <button
              key={userRole}
              onClick={() => handleRoleChange(userRole)}
              className={`
                w-1/2 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-500 
                flex items-center justify-center space-x-2 group
                ${role === userRole 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-blue-100'}
              `}
            >
              {userRole === 'student' ? (
                <UserCircle2 className={`
                  w-6 h-6 transition-transform duration-300
                  ${role === 'student' ? 'scale-110 text-white' : 'group-hover:scale-110'}
                `} />
              ) : (
                <GraduationCap className={`
                  w-6 h-6 transition-transform duration-300
                  ${role === 'teacher' ? 'scale-110 text-white' : 'group-hover:scale-110'}
                `} />
              )}
              <span>{userRole}</span>
            </button>
          ))}
        </div>

        {/* Signup Form with Advanced Styling */}
        <form 
          onSubmit={handleSubmit} 
          className="p-6 space-y-4 relative"
        >
          {/* Name Inputs with Icons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500 transition duration-300"
                required
              />
            </div>
            <div className="relative">
              <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500 transition duration-300"
                required
              />
            </div>
          </div>

          {/* Email with Icon */}
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

          {/* Mobile Number with Icon */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              type="tel"
              name="mobileNo"
              placeholder="Mobile Number"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500 transition duration-300"
              required
            />
          </div>

          {/* PRN for Student */}
          {role === 'student' && (
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                name="prn"
                placeholder="PRN Number"
                value={formData.prn || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500 transition duration-300"
                required
              />
            </div>
          )}

          {/* Password Fields with Toggle Visibility */}
          <div className="grid grid-cols-2 gap-4">
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
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500 transition duration-300"
                required
              />
            </div>
          </div>

          {/* Submit Button with Hover Effect */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg 
            hover:from-blue-700 hover:to-purple-700 transition duration-500 
            transform hover:scale-105 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-blue-500 
            flex items-center justify-center space-x-2 group"
          >
            <span>Sign Up</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleBasedSignup;