import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { 
  UserCircle2, 
  GraduationCap, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from "lucide-react";
import axios from "axios";

const RoleBasedSignup = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [branches, setBranches] = useState([{ id: 1, name: "wce6cs" }]);
  const [universities, setUniversities] = useState([{ id: 1, name: "Walchand College Of Engineering " }]);
  const [years, setYears] = useState([{ id: 1, name: "2026" }, { id: 2, name: "SY" }, { id: 3, name: "TY" }]);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
    PRN: "",
    branchId: "",
    universityId: "",
    yearId: ""
  });

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      mobileNo: "",
      password: "",
      confirmPassword: "",
      PRN: selectedRole === "student" ? "" : undefined,
      branchId: "",
      universityId: "",
      yearId: selectedRole === "student" ? "" : undefined
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const endpoint = role === "student" 
        ? api.studentSignup.url
        : api.adminSignup.url;
  
        console.log("endpoint:",endpoint);

      const response = await axios.post(`${endpoint}`, { ...formData, role });

      console.log("response:" , response);

      if (response.status === 201) {
        alert("Signup successful!");
        navigate('/login');
      } else {
        alert('UNABLE TO SIGNUP');
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert("Signup failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen mt-14 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 selection:bg-blue-200">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl border overflow-hidden transform transition-all hover:scale-105 duration-300">
        
        <div className="flex border-b bg-gradient-to-r from-blue-50 to-purple-50">
          {["student", "teacher"].map(userRole => (
            <button
              key={userRole}
              onClick={() => handleRoleChange(userRole)}
              className={`w-1/2 py-4 text-lg font-bold uppercase flex items-center justify-center space-x-2 ${role === userRole ? "bg-blue-600 text-white" : "bg-transparent text-gray-600 hover:bg-blue-100"}`}
            >
              {userRole === "student" ? <UserCircle2 className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
              <span>{userRole}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required className="w-full border p-2 rounded" />
          </div>

          <div className="flex items-center border p-2 rounded">
            <Mail className="w-5 h-5 text-blue-500 mr-2" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full outline-none" />
          </div>

          <div className="flex items-center border p-2 rounded">
            <Phone className="w-5 h-5 text-blue-500 mr-2" />
            <input type="tel" name="mobileNo" placeholder="Mobile Number" value={formData.mobileNo} onChange={handleChange} required className="w-full outline-none" />
          </div>

          {role === "student" && <input type="text" name="PRN" placeholder="PRN Number" value={formData.PRN} onChange={handleChange} required className="w-full border p-2 rounded" />}

          <select name="branchId" value={formData.branchId} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select Branch</option>
            {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>

          <select name="universityId" value={formData.universityId} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select University</option>
            {universities.map(uni => <option key={uni.id} value={uni.id}>{uni.name}</option>)}
          </select>

          {role === "student" && <select name="yearId" value={formData.yearId} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select Year</option>
            {years.map(year => <option key={year.id} value={year.id}>{year.name}</option>)}
          </select>}

          {/* Password Field */}
          <div className="flex items-center border p-2 rounded">
            <Lock className="w-5 h-5 text-blue-500 mr-2" />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full outline-none" 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-5 h-5 text-blue-500" /> : <Eye className="w-5 h-5 text-blue-500" />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="flex items-center border p-2 rounded">
            <ShieldCheck className="w-5 h-5 text-blue-500 mr-2" />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              className="w-full outline-none" 
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff className="w-5 h-5 text-blue-500" /> : <Eye className="w-5 h-5 text-blue-500" />}
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleBasedSignup;
