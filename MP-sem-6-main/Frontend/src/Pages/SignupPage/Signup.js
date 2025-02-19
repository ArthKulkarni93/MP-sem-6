import React, { useState, useEffect } from "react";
import { 
  UserCircle2, 
  GraduationCap, 
  Mail, 
  Phone, 
  KeyRound, 
  Eye, 
  EyeOff 
} from "lucide-react";
import axios from "axios";

const RoleBasedSignup = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [branches, setBranches] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [years, setYears] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
    prn: "",
    branchId: "",
    universityId: "",
    yearId: ""
  });

  useEffect(() => {
    axios.get("/api/branches").then(res => setBranches(res.data)).catch(err => console.error(err));
    axios.get("/api/universities").then(res => setUniversities(res.data)).catch(err => console.error(err));
    if (role === "student") {
      axios.get("/api/years").then(res => setYears(res.data)).catch(err => console.error(err));
    }
  }, [role]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      password: "",
      confirmPassword: "",
      prn: selectedRole === "student" ? "" : undefined,
      branchId: "",
      universityId: "",
      yearId: selectedRole === "student" ? "" : undefined
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup Data:", { ...formData, role });
  };

  return (
    <div className="min-h-screen  mt-14 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 selection:bg-blue-200 ">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl border overflow-hidden transform transition-all hover:scale-105 duration-300 ">
        
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
  
           
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="w-full border p-2 rounded" />
            
           
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="w-full border p-2 rounded" />
             
          </div>
          <div className="flex items-center border p-2 rounded">
            <Mail className="w-5 h-5 text-gray-500 mr-2" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full outline-none" />
          </div>
          <div className="flex items-center border p-2 rounded">
            <Phone className="w-5 h-5 text-gray-500 mr-2" />
            <input type="tel" name="mobileNo" placeholder="Mobile Number" value={formData.mobileNo} onChange={handleChange} required className="w-full outline-none" />
          </div>
          {role === "student" && <input type="text" name="prn" placeholder="PRN Number" value={formData.prn} onChange={handleChange} required className="w-full border p-2 rounded" />}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center border p-2 rounded">
              <KeyRound className="w-5 h-5 text-gray-500 mr-2" />
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full outline-none" />
            </div>
            <div className="flex items-center border p-2 rounded">
              <KeyRound className="w-5 h-5 text-gray-500 mr-2" />
              <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full outline-none" />
            </div>
          </div>
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-blue-500 flex items-center space-x-2">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} <span>{showPassword ? "Hide Password" : "Show Password"}</span>
          </button>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center space-x-2">
            Sign Up
            </button>
        </form>
      </div>
    </div>
  );
};

export default RoleBasedSignup;
