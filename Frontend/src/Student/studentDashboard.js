// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import StudentSidebar from '../Sidebar/studentSidebar';
// import { FaBars } from 'react-icons/fa';

// const StudentDashboard = () => {
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
//             <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />

//             <div className="flex-1 p-8">
                
//             </div>
//         </div>
//     );
// };

// export default StudentDashboard;

// src/pages/Dashboard/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../Sidebar/studentSidebar';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import api from '../api';

const StudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch notes that match the student's criteria
  // We assume the backend endpoint uses the student's token to filter notes by year, branch, and university.
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in.');
      const res = await axios.get(api.getNotes.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Error fetching notes.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="flex h-screen mt-5 bg-gray-100">
      <FaBars 
        onClick={toggleSidebar} 
        className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
      />
      <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="student" />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Student Dashboard</h1>
        
        {/* Notes Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Notes</h2>
          {error && <p className="text-red-500">{error}</p>}
          {notes.length === 0 ? (
            <p className="text-gray-600">No notes available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map(note => (
                <div key={note.id} className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-700">{note.title}</h3>
                  <p className="text-gray-500 mt-2">{note.description}</p>
                  {note.driveLink && (
                    <a 
                      href={note.driveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      View Notes
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
