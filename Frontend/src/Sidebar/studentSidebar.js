import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar}) => {
    return (
        <div className={`${isOpen ? "translate-x-0 fixed" : "-translate-x-full"} fixed top-0 left-0 w-64 mt-14 h-full bg-[#2C3E50] transition-transform duration-300 shadow-lg`}>
            <ul className="mt-4">
                
                {/* Student Sidebar */}
                    <>
                        <li className="p-4 hover:bg-gray-600 text-white">
                            <Link to="/student-dashboard" onClick={toggleSidebar}>Dashboard</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-600 text-white">
                            <Link to="/student-exams" onClick={toggleSidebar}>Exams</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-600 text-white">
                            <Link to="/student-results" onClick={toggleSidebar}>Results</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-600 text-white">
                            <Link to="/student-profile" onClick={toggleSidebar}>Profile</Link>
                        </li>
                        <li className="p-4 hover:bg-red-600 text-white">
                            <Link to="/login" onClick={toggleSidebar}>Logout</Link>
                        </li>
                    </>
            </ul>
        </div>
    );
};

export default Sidebar;
