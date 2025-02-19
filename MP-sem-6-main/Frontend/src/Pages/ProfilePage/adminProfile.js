import React, { useState, useEffect } from "react";
import { Edit, Save, User, Mail, Briefcase, School } from "lucide-react";

const ProfilePage = ({ userType }) => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  const branches = ["Computer Science", "Information Technology", "Mechanical Engineering"];
  const universities = ["XYZ University", "ABC University", "LMN University"];

  useEffect(() => {
    const fetchProfile = async () => {
      const mockData = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        branchId: "Computer Science",
        universityId: "XYZ University"
      };
      setProfile(mockData);
      setUpdatedProfile(mockData);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(updatedProfile);
    setEditMode(false);
    console.log("Updated Profile:", updatedProfile);
  };

  if (!profile) return <div className="text-center text-lg font-bold">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br mt-14 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-3xl overflow-hidden border-4 border-blue-500/10 transform transition-all hover:scale-105 duration-300 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <User className="w-12 h-12 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">{userType} Profile</h2>
        </div>

        <div className="space-y-6">
          {Object.entries(profile).map(([key, value]) => (
            <div key={key} className="relative">
              <label className="block text-gray-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <div className="relative">
                {key === "email" && <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />}
                {key === "branchId" || key === "universityId" ? (
                  <select
                    name={key}
                    value={updatedProfile[key]}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full pl-4 pr-4 py-3 border-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2 ${editMode ? "bg-white focus:ring-blue-600" : "bg-gray-100 cursor-not-allowed"}`}
                  >
                    {(key === "branchId" ? branches : universities).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={updatedProfile[key]}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2 ${editMode ? "bg-white focus:ring-blue-600" : "bg-gray-100 cursor-not-allowed"}`}
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition duration-300 flex items-center justify-center space-x-2"
            >
              <Edit className="mr-2" /> <span>Edit</span>
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 transition duration-300 flex items-center justify-center space-x-2"
            >
              <Save className="mr-2" /> <span>Save</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
