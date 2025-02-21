import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentSidebar from '../Sidebar/studentSidebar';
import { FaBars } from 'react-icons/fa';

const StudentExam = () => {
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
            <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />

            <div className="flex-1 p-8">
                
            </div>
        </div>
    );
};

export default StudentExam;

