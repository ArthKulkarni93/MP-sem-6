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
    scheduledDate: '',
    duration: '',
    totalmarks: '',
  });
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [teacherUniversityId, setTeacherUniversityId] = useState('');

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleForm = () => setShowForm(!showForm);

  useEffect(() => {
    fetchTeacherProfile();
    fetchTests();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(api.adminProfile.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeacherUniversityId(res.data.universityId);
      fetchBranches(res.data.universityId);
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
    }
  };

  const fetchBranches = async (universityId) => {
    try {
      const url = api.fetchBranches.url.replace(':universityId', universityId);
      const res = await axios.get(url);
      setBranches(res.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchYears = async (branchId) => {
    try {
      const url = api.fetchYears.url
        .replace(':universityId', teacherUniversityId)
        .replace(':branchId', branchId);
      const res = await axios.get(url);
      setYears(res.data);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setCsvFile(e.target.files[0]);

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    setSelectedYear('');
    setYears([]);
    if (branchId) fetchYears(branchId);
  };

  const handleYearChange = (e) => setSelectedYear(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const endpoint = api.createTest.url;
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found. Please log in.");

      const testRes = await axios.post(
        endpoint,
        {
          ...formData,
          yearId: parseInt(selectedYear),
          branchId: parseInt(selectedBranch),
          duration: parseInt(formData.duration),
          totalmarks: parseInt(formData.totalmarks),
        },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );
      const testId = testRes.data.id;

      if (csvFile) {
        const data = new FormData();
        data.append('file', csvFile);
        const questionEndpoint = `${api.createTest.url}/${testId}/questions`;
        await axios.post(questionEndpoint, data, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });
      }

      setMessage('Test and questions uploaded successfully.');
      setFormData({ title: '', subject: '', scheduledDate: '', duration: '', totalmarks: '' });
      setCsvFile(null);
      setShowForm(false);
      fetchTests();
    } catch (error) {
      console.error(error);
      setMessage('Error uploading test and questions.');
    }
    setLoading(false);
  };

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

  const viewTest = async (testId) => {
    try {
      const token = localStorage.getItem('token');
      const questionEndpoint = `${api.getTests.url}/${testId}/questions`;
      const res = await axios.get(questionEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
      setSelectedTest(testId);
    } catch (error) {
      console.error("Error fetching test questions:", error);
    }
  };

  return (
    <div className="flex h-screen mt-5 bg-gray-100">
      <FaBars onClick={toggleSidebar} className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" />
      <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 mt-4">
          <button onClick={toggleForm} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            {showForm ? 'Close Create Test Form' : 'Create Test'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-6 bg-white shadow-md rounded px-8 pt-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Branch</label>
                  <select value={selectedBranch} onChange={handleBranchChange} className="w-full border rounded py-2 px-3" disabled={!branches.length}>
                    <option value="">Select Branch</option>
                    {branches.map((b) => <option key={b.id} value={b.id}>{b.Branchname}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                  <select value={selectedYear} onChange={handleYearChange} className="w-full border rounded py-2 px-3" disabled={!years.length}>
                    <option value="">Select Year</option>
                    {years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded py-2 px-3" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full border rounded py-2 px-3" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Scheduled Date</label>
                  <input type="datetime-local" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="w-full border rounded py-2 px-3" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Duration (minutes)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full border rounded py-2 px-3" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Total Marks</label>
                  <input type="number" name="totalmarks" value={formData.totalmarks} onChange={handleChange} className="w-full border rounded py-2 px-3" required />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Upload CSV File</label>
                  <input type="file" accept=".csv" onChange={handleFileChange} className="w-full" />
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
                  {loading ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
              {message && <div className="mt-4 text-center text-sm text-gray-600">{message}</div>}
            </form>
          )}
        </div>

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
                  <button onClick={() => viewTest(test.id)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Questions
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTest && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Test #{selectedTest} - Questions</h2>
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
                    <p className="mt-2 text-sm text-gray-500">Correct Option: {q.correctOption} | Marks: {q.maxMark}</p>
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
