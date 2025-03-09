// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import StudentSidebar from '../Sidebar/studentSidebar';
// import { FaBars } from 'react-icons/fa';

// const StudentExam = () => {
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

// export default StudentExam;

import React, { useState, useEffect } from 'react';
import StudentSidebar from '../Sidebar/studentSidebar';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const StudentExam = () => {
  // Modes: 'dashboard' or 'pretest'
  const [mode, setMode] = useState('dashboard');

  // Dashboard data
  const [availableTests, setAvailableTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [error, setError] = useState('');

  // Pre-test data
  const [selectedTest, setSelectedTest] = useState(null);

  // Sidebar state
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const navigate = useNavigate();

  // ---------------- Dashboard Functions ----------------

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in.');
      const res = await axios.get(api.getSTests.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableTests(res.data);
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError('Error fetching tests.');
    }
  };

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in.');
      const res = await axios.get(api.getSResults.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompletedTests(res.data);
      console.log("res", res);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Error fetching results.');
    }
  };

  useEffect(() => {
    fetchTests();
    fetchResults();
  }, []);

  // Filter available tests: remove tests that are completed
  const completedTestIds = new Set(completedTests.map(r => r.testId));
  const filteredAvailableTests = availableTests.filter(test => !completedTestIds.has(test.id));

  // Calculate test status
  const getTestStatus = (test) => {
    const scheduled = new Date(test.scheduledDate);
    const now = new Date();
    const endTime = new Date(scheduled.getTime() + test.duration * 60000);
    if (now < scheduled) {
      const diff = scheduled - now;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return { status: 'upcoming', remaining: `${minutes}m ${seconds}s` };
    } else if (now >= scheduled && now < endTime) {
      return { status: 'ongoing' };
    } else {
      return { status: 'over' };
    }
  };

  // When student clicks "Go to Test", switch to pre-test interface
  const handleGotoTest = (test) => {
    setSelectedTest(test);
    setMode('pretest');
  };

  const handleViewResult = () => {
    navigate(`/student-results`);
  };

  return (
    <div className="flex h-screen mt-5 bg-gray-100">
      <FaBars onClick={toggleSidebar} className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" />
      <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="student" />
      <div className="flex-1 p-8 mt-4 overflow-y-auto">
        {mode === 'dashboard' && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Exam Section</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {/* Completed Tests */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Completed Tests</h2>
              {completedTests.length === 0 ? (
                <p className="text-gray-600">No completed tests found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedTests.map(result => (
                    <div key={result.testId} className="bg-white shadow rounded-lg p-4">
                      <h3 className="text-xl font-semibold text-gray-700">{result.test.title}</h3>
                      <p className="text-gray-500">Subject: {result.test.subject}</p>
                      <p className="text-gray-500">Score: {result.scoredmarks} / {result.totalmarks}</p>
                      <button onClick={() => handleViewResult()} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                        Go To Result
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Available Tests */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Available Tests</h2>
              {filteredAvailableTests.length === 0 ? (
                <p className="text-gray-600">No available tests.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAvailableTests.map(test => {
                    const { status, remaining } = getTestStatus(test);
                    return (
                      <div key={test.id} className="bg-white shadow rounded-lg p-4">
                        <h3 className="text-xl font-semibold text-gray-700">{test.title}</h3>
                        <p className="text-gray-500">Subject: {test.subject}</p>
                        <button onClick={() => handleGotoTest(test)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                          Go to Test
                        </button>
                        {status === 'upcoming' && <p className="text-yellow-600 mt-2">Starts in: {remaining}</p>}
                        {status === 'over' && <p className="text-red-600 mt-2">Test is over</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {mode === 'pretest' && selectedTest && (
          <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mb-4 p-4 bg-white shadow rounded">
              <p className="text-lg text-gray-800 mb-2">Please read the instructions carefully:</p>
              <ul className="list-disc list-inside text-gray-700">
                <li>Do not switch tabs after starting the test.</li>
                <li>Do not exit full-screen mode once the test starts.</li>
                <li>Do not engage in malicious activities.</li>
                <li>Camera monitoring is active during the test.</li>
              </ul>
            </div>
            {(() => {
              const scheduled = new Date(selectedTest.scheduledDate);
              const now = new Date();
              const endTime = new Date(scheduled.getTime() + selectedTest.duration * 60000);
              if (now < scheduled) {
                const diff = scheduled - now;
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                return (
                  <>
                    <p className="text-yellow-600 text-xl mb-4">Test hasn't started yet.</p>
                    <p className="text-gray-700 mb-4">Test starts in: {minutes}m {seconds}s</p>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded cursor-not-allowed opacity-50" disabled>
                      Start Test
                    </button>
                  </>
                );
              } else if (now >= scheduled && now < endTime) {
                return (
                  <>
                    <p className="text-green-600 text-xl mb-4">Test is now ongoing.</p>
                    <button
                      onClick={() => {
                        // Request full-screen and navigate to test-taking page.
                        enterFullScreen();
                        navigate(`/student/test/${selectedTest.id}`);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Start Test
                    </button>
                  </>
                );
              } else {
                return <p className="text-red-600 text-xl">Test is over.</p>;
              }
            })()}
            <button
              onClick={() => setMode('dashboard')}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Define enterFullScreen before its usage.
const enterFullScreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch((err) =>
      console.error("Error enabling full-screen mode:", err)
    );
  }
};

export default StudentExam;
