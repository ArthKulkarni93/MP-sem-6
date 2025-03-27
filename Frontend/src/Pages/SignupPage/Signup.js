import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // assuming api is set up for your backend URLs
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
import Select from 'react-select';

const RoleBasedSignup = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [universities, setUniversities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);

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

  // Fetch universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(api.fetchUniversities.url);
        setUniversities(response.data);
      } catch (error) {
        console.log("Error fetching universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch branches when university is selected
  useEffect(() => {
    const fetchBranches = async () => {
      if (formData.universityId) {
        try {
          const response = await axios.get(`${api.fetchBranches.url.replace(':universityId', formData.universityId)}`);
          setBranches(response.data);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      } else {
        setBranches([]); // Reset branches if no university is selected
      }
    };
    fetchBranches();
  }, [formData.universityId]);

  // Fetch years when university and branch are selected
  useEffect(() => {
    const fetchYears = async () => {
      if (formData.universityId && formData.branchId) {
        try {
          const response = await axios.get(
            `${api.fetchYears.url.replace(':universityId', formData.universityId).replace(':branchId', formData.branchId)}`
          );
          setYears(response.data);
        } catch (error) {
          console.error("Error fetching years:", error);
        }
      } else {
        setYears([]); // Reset years if no university or branch is selected
      }
    };
    fetchYears();
  }, [formData.universityId, formData.branchId]);

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

  const handleUniversityChange = (selectedOption) => {
    setFormData(prev => ({ 
      ...prev, 
      universityId: selectedOption ? selectedOption.value : "", // Correctly set universityId here
      branchId: "", // Reset branchId when university changes
      yearId: "" // Reset yearId when university changes
    }));
  };

  const handleBranchChange = (selectedOption) => {
    setFormData(prev => ({ 
      ...prev, 
      branchId: selectedOption ? selectedOption.value : "", // Set only the id, reset if null
      yearId: "" // Reset yearId when branch changes
    }));
  };

  const handleYearChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, yearId: selectedOption ? selectedOption.value : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare data for backend
    const payload = {
      ...formData,
      universityId: parseInt(formData.universityId),
      branchId: parseInt(formData.branchId),
      yearId: role === "student" ? parseInt(formData.yearId) : undefined,
      role
    };

    try {
      const endpoint = role === "student" 
        ? api.studentSignup.url
        : api.adminSignup.url;

      const response = await axios.post(endpoint, payload);

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

          {/* University Dropdown */}
          <Select
            options={universities.map(uni => ({ value: uni.id, label: uni.name }))}
            onChange={handleUniversityChange}
            placeholder="Select University"
            required
          />

          {/* Branch Dropdown */}
          <Select
            options={branches.map(branch => ({ value: branch.id, label: branch.Branchname }))}
            onChange={handleBranchChange}
            placeholder="Select Branch"
            isDisabled={!formData.universityId} // Disable if no university is selected
            required
          />

          {/* Year Dropdown (only for students) */}
          {role === "student" && (
            <Select
              options={years.map(year => ({ value: year.id, label: year.name }))}
              onChange={handleYearChange}
              placeholder="Select Year"
              isDisabled={!formData.branchId} // Disable if no branch is selected
              required
            />
          )}

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

          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleBasedSignup;
