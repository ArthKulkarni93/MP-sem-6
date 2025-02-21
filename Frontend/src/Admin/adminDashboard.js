// AdminDashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../Sidebar/adminSidebar';
import { FaBars } from 'react-icons/fa';

const AdminDashboard = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
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
                
                {/* Navigation Buttons */}
                <div className="flex justify-center space-x-6 mt-4">
                    <Link to="/subjects">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105">
                            Subjects
                        </button>
                    </Link>
                    <Link to="/studentsdata">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105">
                            Students Data
                        </button>
                    </Link>
                </div>

                {/* Rest of the dashboard content */}
            </div>
        </div>
    );
};

export default AdminDashboard;

