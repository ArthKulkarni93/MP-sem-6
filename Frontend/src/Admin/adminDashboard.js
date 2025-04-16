// // AdminDashboard.js
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import AdminSidebar from '../Sidebar/adminSidebar';
// import { FaBars } from 'react-icons/fa';

// const AdminDashboard = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleSidebar = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <div className="flex h-screen mt-5 bg-gray-100">
//             <FaBars 
//                 onClick={toggleSidebar} 
//                 className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
//             />
//             <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />

//             <div className="flex-1 p-8">
//                 <h1 className="text-3xl mt-2 text-center font-bold text-gray-800 mb-6">Admin Dashboard</h1>
                
//                 {/* Navigation Buttons */}
//                 <div className="flex justify-center space-x-6 mt-4">
//                     <Link to="/subjects">
//                         <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105">
//                             Subjects
//                         </button>
//                     </Link>
//                     <Link to="/studentsdata">
//                         <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105">
//                             Students Data
//                         </button>
//                     </Link>
//                 </div>

//                 {/* Rest of the dashboard content */}
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;

// src/pages/Dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import api from '../api';
import AdminSidebar from '../Sidebar/adminSidebar';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [branchId, setBranchId] = useState('');
  const [yearId, setYearId] = useState('');
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found.');
    
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log(decodedToken)
        const universityId = decodedToken?.universityId;
    
        if (!universityId) {
          console.error('University ID not found in token');
          throw new Error('University ID not found in token');
        }
    
        // Fetch branches
        const branchesRes = await axios.get(api.fetchBranches.url.replace(':universityId', universityId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBranches(branchesRes.data);
    
        // Fetch years if branchId is set
        if (branchId) {
          const yearsRes = await axios.get(api.fetchYears.url.replace(':universityId', universityId).replace(':branchId', branchId), {
            headers: { Authorization: `Bearer ${token}` },
          });
          setYears(yearsRes.data);
        }
      } catch (error) {
        console.error('Error loading dropdowns:', error);
      }
    };
    

    fetchDropdowns();
  }, [branchId]);

  const handleUpload = async (e) => {
    e.preventDefault();
  
    console.log("Selected Branch ID:", branchId);
    console.log("Selected Year ID:", yearId);
  
    if (!branchId || !yearId) {
      setMessage("Please select both branch and year.");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title,
        description,
        driveLink,
        branchid: parseInt(branchId), // send as 'branchid' to match backend
        yearid: parseInt(yearId),     // send as 'yearid' to match backend
      };
  console.log("payload before uploading", payload)
      const res = await axios.post(api.uploadNotes.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 201) {
        console.log('Upload Successful:', res.data);
        setMessage('Notes uploaded successfully!');
        setTitle('');
        setDescription('');
        setDriveLink('');
        setBranchId('');
        setYearId('');
      } else {
        console.log('Upload Failed:', res.data);
        setMessage('Failed to upload notes.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.response?.data?.message || 'Error uploading notes.');
    }
  };
  

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen mt-5 bg-gray-100">
      <FaBars onClick={toggleSidebar} className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" />
      <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />

      <div className="flex-1 p-8">
        <h1 className="text-3xl mt-2 text-center font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Upload Notes Section */}
        <div className="mt-10 max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200 transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Upload Notes</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Drive Link</label>
              <input
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                required
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
              />
            </div>

            {/* Branch Select */}
            <div>
              <label className="block text-gray-700 font-medium">Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                required
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.Branchname}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Select */}
            <div>
              <label className="block text-gray-700 font-medium">Year</label>
              <select
                value={yearId}
                onChange={(e) => setYearId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                required
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow transition-transform transform hover:scale-105"
            >
              Upload Notes
            </button>
          </form>

          {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
