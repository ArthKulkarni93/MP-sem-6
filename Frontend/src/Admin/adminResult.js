import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import AdminSidebar from '../Sidebar/adminSidebar';
import api from '../api';

const AdminResult = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [results, setResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cheatDetails, setCheatDetails] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(api.getTests.url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(res.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchTests();
  }, []);

  const isTestComplete = (test) => {
    const scheduled = new Date(test.scheduledDate);
    const completeTime = new Date(scheduled.getTime() + test.duration * 60000);
    return new Date() >= completeTime;
  };

  const handleViewResults = async (test) => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const endpoint = api.getTestResults.url.replace(':testid', test.id);
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
      setSelectedTest(test);
    } catch (error) {
      console.error("Error fetching test results:", error);
    }
  };

  const handleViewCheatDetails = (result) => {
    setCheatDetails(result.securityDetails);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen mt-5 bg-gray-100">
      <FaBars 
        onClick={toggleSidebar} 
        className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
      />
      <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />

      <div className="flex-1 mt-4 p-8 overflow-auto">
        {!selectedTest ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Tests</h1>
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 border-b text-left">Test Name</th>
                  <th className="py-3 px-4 border-b text-left">Subject</th>
                  <th className="py-3 px-4 border-b text-left">Scheduled Date</th>
                  <th className="py-3 px-4 border-b text-left">Duration (mins)</th>
                  <th className="py-3 px-4 border-b text-left">Results</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{test.title}</td>
                    <td className="py-3 px-4 border-b">{test.subject}</td>
                    <td className="py-3 px-4 border-b">
                      {new Date(test.scheduledDate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b">{test.duration}</td>
                    <td className="py-3 px-4 border-b">
                      {isTestComplete(test) ? (
                        <button 
                          onClick={() => handleViewResults(test)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          View Results
                        </button>
                      ) : (
                        <span className="text-gray-500">Not Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => { setSelectedTest(null); setResults([]); }} 
              className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              &larr; Back to Tests
            </button>
            <h1 className="text-3xl font-bold mb-6">Results for: {selectedTest.title}</h1>
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 border-b text-left">Student PRN</th>
                  <th className="py-3 px-4 border-b text-left">Student Name</th>
                  <th className="py-3 px-4 border-b text-left">Marks Obtained</th>
                  <th className="py-3 px-4 border-b text-left">Total Marks</th>
                  <th className="py-3 px-4 border-b text-left">Cheated</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    {/* Make sure result.student.PRN exists */}
                    <td className="py-3 px-4 border-b">{result.student.PRN}</td>
                    <td className="py-3 px-4 border-b">
                      {result.student.firstname} {result.student.lastname}
                    </td>
                    <td className="py-3 px-4 border-b">{result.scoredmarks}</td>
                    <td className="py-3 px-4 border-b">{result.totalmarks}</td>
                    <td className="py-3 px-4 border-b">
                      {result.cheated ? (
                        <button 
                          onClick={() => handleViewCheatDetails(result)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Yes
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen && cheatDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h2 className="text-xl font-bold mb-4">Cheat Details</h2>
              <table className="min-w-full mb-4">
                <tbody>
                  <tr>
                    <td className="py-2 px-3 font-medium border">Face Count</td>
                    <td className="py-2 px-3 border">{cheatDetails.faceCount}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium border">Tab Switch Count</td>
                    <td className="py-2 px-3 border">{cheatDetails.tabSwitchCount}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium border">Full Screen Exits</td>
                    <td className="py-2 px-3 border">{cheatDetails.fullScreenExits}</td>
                  </tr>
                </tbody>
              </table>
              <button 
                onClick={() => { setModalOpen(false); setCheatDetails(null); }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResult;
