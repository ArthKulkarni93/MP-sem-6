// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import AdminSidebar from '../Sidebar/adminSidebar';
// import { FaBars } from 'react-icons/fa';

// const AdminExam = () => {
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
                
//             </div>
//         </div>
//     );
// };

// export default AdminExam;

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../Sidebar/adminSidebar';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import api from '../api';

const AdminExam = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    yearId: '',
    branchId: '',
    scheduledDate: '',
    duration: '',
    totalmarks: '',
  });
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle CSV file selection
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  // Create test and (if provided) upload CSV questions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const endpoint = api.createTest.url;
      console.log("Test creation endpoint:", endpoint);

      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found. Please log in.");

      const testRes = await axios.post(
        endpoint,
        { 
          ...formData, 
          yearId: parseInt(formData.yearId),
          branchId: parseInt(formData.branchId),
          duration: parseInt(formData.duration),
          totalmarks: parseInt(formData.totalmarks),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Test creation response:", testRes);
      const testId = testRes.data.id;

      // Construct questions endpoint using testId
      const questionEndpoint = `${api.createTest.url}/${testId}/questions`;
      console.log("Questions endpoint:", questionEndpoint);

      if (csvFile) {
        const data = new FormData();
        data.append('file', csvFile);
        await axios.post(
          questionEndpoint,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setMessage('Test and questions uploaded successfully.');
      setFormData({
        title: '',
        subject: '',
        yearId: '',
        branchId: '',
        scheduledDate: '',
        duration: '',
        totalmarks: '',
      });
      setCsvFile(null);
      setShowForm(false);
      fetchTests();
    } catch (error) {
      console.error(error);
      setMessage('Error uploading test and questions.');
    }
    setLoading(false);
  };

  // Fetch tests created by this teacher
  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found. Please log in.");
      const res = await axios.get(api.getTests.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  // Fetch questions for a selected test
  const viewTest = async (testId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found. Please log in.");
      const questionEndpoint = `${api.getTests.url}/${testId}/questions`;
      const res = await axios.get(questionEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("result: " , res);
      setQuestions(res.data);
      setSelectedTest(testId);
    } catch (error) {
      console.error("Error fetching test questions:", error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="flex h-screen mt-5 bg-gray-100">
      <FaBars
        onClick={toggleSidebar}
        className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400"
      />
      <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Create Test Button and Form */}
        <div className="mb-8 mt-4">
          <button
            onClick={toggleForm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showForm ? 'Close Create Test Form' : 'Create Test'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-6 bg-white shadow-md rounded px-8 pt-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form inputs for title, subject, etc. */}
                <div>
                  <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="yearId" className="block text-gray-700 text-sm font-bold mb-2">
                    Year ID
                  </label>
                  <input
                    type="number"
                    name="yearId"
                    id="yearId"
                    value={formData.yearId}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="branchId" className="block text-gray-700 text-sm font-bold mb-2">
                    Branch ID
                  </label>
                  <input
                    type="number"
                    name="branchId"
                    id="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="scheduledDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    id="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="totalmarks" className="block text-gray-700 text-sm font-bold mb-2">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    name="totalmarks"
                    id="totalmarks"
                    value={formData.totalmarks}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="csv" className="block text-gray-700 text-sm font-bold mb-2">
                    Upload CSV File
                  </label>
                  <input
                    type="file"
                    name="csv"
                    id="csv"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full transition"
                >
                  {loading ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
              {message && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  {message}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Display Teacher's Tests */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tests</h2>
          {tests.length === 0 ? (
            <p className="text-gray-600">No tests found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.map((test) => (
                <div key={test.id} className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-700">{test.title}</h3>
                  <p className="text-gray-500">Subject: {test.subject}</p>
                  <button
                    onClick={() => viewTest(test.id)}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display Selected Test Questions */}
        {selectedTest && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Test #{selectedTest} - Questions
            </h2>
            {questions.length === 0 ? (
              <p className="text-gray-600">No questions found for this test.</p>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={idx} className="bg-white shadow rounded-lg p-4">
                    <p className="font-semibold text-gray-700">Q: {q.queText}</p>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      <li>A: {q.optionA}</li>
                      <li>B: {q.optionB}</li>
                      <li>C: {q.optionC}</li>
                      <li>D: {q.optionD}</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-500">
                      Correct Option: {q.correctOption} | Marks: {q.maxMark}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExam;
