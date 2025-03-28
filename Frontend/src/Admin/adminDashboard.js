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
import React, { useState } from 'react';
import AdminSidebar from '../Sidebar/adminSidebar';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import api from '../api';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notesTitle, setNotesTitle] = useState("");
  const [notesDescription, setNotesDescription] = useState("");
  const [year, setYear] = useState("First Year");
  const [branch, setBranch] = useState("Computer Science");
  const [university, setUniversity] = useState("XYZ University");
  const [driveLink, setDriveLink] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handler for drive link change
  const handleDriveLinkChange = (e) => {
    setDriveLink(e.target.value);
  };

  // Handler for notes upload
  const handleNotesUpload = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found. Please log in.");
      
      const payload = {
        title: notesTitle,
        description: notesDescription,
        year,
        branch,
        university,
        driveLink, // Drive link entered by the admin
      };

      const response = await axios.post(api.uploadNotes.url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        setUploadMessage("Notes uploaded successfully!");
        // Clear fields if needed
        setNotesTitle("");
        setNotesDescription("");
        setDriveLink("");
      } else {
        setUploadMessage("Failed to upload notes.");
      }
    } catch (error) {
      console.error("Error uploading notes:", error);
      setUploadMessage("Error uploading notes.");
    }
  };

  return (
    <div className="flex h-screen mt-5 bg-gray-100">
      <FaBars 
        onClick={toggleSidebar} 
        className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
      />
      <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />

      <div className="flex-1 p-8">
        <h1 className="text-3xl mt-2 text-center font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        {/* Upload Notes Section */}
        <div className="mt-10 max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200 transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Upload Notes</h2>
          <form onSubmit={handleNotesUpload} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Title</label>
              <input
                type="text"
                value={notesTitle}
                onChange={(e) => setNotesTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Description</label>
              <textarea
                value={notesDescription}
                onChange={(e) => setNotesDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
              ></textarea>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/3">
                <label className="block text-gray-700 font-medium">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                >
                  <option>First Year</option>
                  <option>Second Year</option>
                  <option>Third Year</option>
                  <option>Final Year</option>
                </select>
              </div>
              <div className="w-1/3">
                <label className="block text-gray-700 font-medium">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                >
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                  <option>Mechanical Engineering</option>
                </select>
              </div>
              <div className="w-1/3">
                <label className="block text-gray-700 font-medium">University</label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                >
                  <option>XYZ University</option>
                  <option>ABC University</option>
                  <option>LMN University</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Drive Link</label>
              <input
                type="url"
                value={driveLink}
                onChange={handleDriveLinkChange}
                placeholder="https://drive.google.com/..."
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow transition-transform transform hover:scale-105"
            >
              Upload Notes
            </button>
          </form>
          {uploadMessage && <p className="mt-4 text-center text-green-600">{uploadMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
