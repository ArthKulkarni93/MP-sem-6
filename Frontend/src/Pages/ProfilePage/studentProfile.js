// src/pages/Profile/studentProfile.js
import React, { useState, useEffect } from "react";
import { Edit, Save, User, Mail, Lock, Hash } from "lucide-react";
import StudentSidebar from '../../Sidebar/studentSidebar';
import { FaBars } from 'react-icons/fa';
import axios from "axios";
import api from '../../api';

const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Use URLs from api.js
  const GET_PROFILE_URL = api.studentProfile.url;
  const UPDATE_PROFILE_URL = api.studentUpdate.url;

  // Dropdown options
  const branches = ["Computer Science", "Information Technology", "Mechanical Engineering"];
  const universities = ["XYZ University", "ABC University", "LMN University"];
  const years = ["First Year", "Second Year", "Third Year", "Final Year"];

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(GET_PROFILE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("profiledata=>", response);
        const data = response.data || {};
        setProfile(data);
        setUpdatedProfile(data);
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [GET_PROFILE_URL]);

  const handleEdit = () => setEditMode(true);
  const handleChange = (e) =>
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      // Convert select values to integers before updating
      const payload = {
        ...updatedProfile,
        branchId: parseInt(updatedProfile.branchId),
        universityId: parseInt(updatedProfile.universityId),
        yearId: parseInt(updatedProfile.yearId)
      };
      const response = await axios.put(UPDATE_PROFILE_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        setProfile(payload);
        setEditMode(false);
      } else {
        console.error("Failed to update student profile");
      }
    } catch (error) {
      console.error("Error updating student profile:", error);
    }
  };

  if (isLoading)
    return <div className="text-center text-lg font-bold">Loading...</div>;
  if (!profile || Object.keys(profile).length === 0)
    return <div className="text-center text-lg font-bold">No profile data found.</div>;

  return (
    <div className="min-h-screen mt-5 bg-gray-100">
      <FaBars
        onClick={toggleSidebar}
        className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400"
      />
      <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="container mt-4 mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200 transform hover:scale-105 transition duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <User className="w-12 h-12 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
          </div>
          <div className="space-y-6">
            {Object.entries(profile)
              .filter(
                ([key]) =>
                  key.toLowerCase() !== "id" && key.toLowerCase() !== "password"
              )
              .map(([key, value]) => (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <div className="mt-1 relative">
                    {key === "email" && (
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    )}
                    {key === "PRN" && (
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    )}
                    {["branchId", "universityId", "yearId"].includes(key) ? (
                      <select
                        name={key}
                        value={updatedProfile[key] || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        {(key === "branchId"
                          ? branches
                          : key === "universityId"
                          ? universities
                          : years
                        ).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={updatedProfile[key] || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-8 flex justify-between">
            {!editMode ? (
              <button
                onClick={handleEdit}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                <Edit className="inline-block mr-2" /> Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
              >
                <Save className="inline-block mr-2" /> Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
