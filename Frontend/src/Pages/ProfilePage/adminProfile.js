// src/pages/Profile/adminProfile.js
import React, { useState, useEffect } from "react";
import { Edit, Save, User, Mail, Briefcase } from "lucide-react";
import AdminSidebar from '../../Sidebar/adminSidebar';
import { FaBars } from 'react-icons/fa';
import axios from "axios";
import api from '../../api';

const AdminProfilePage = () => {
  // helper to turn [{id, Universityname,…}] → [{id, name}]
  const normalize = arr =>
    arr.map(item => {
      const nameKey = Object.keys(item).find(k => /name/i.test(k));
      return { id: item.id, name: nameKey ? item[nameKey] : String(item.id) };
    });

  const [profile,        setProfile]        = useState(null);
  const [editMode,       setEditMode]       = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [universities,   setUniversities]   = useState([]);
  const [branches,       setBranches]       = useState([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [isOpen,         setIsOpen]         = useState(false);

  const GET_PROFILE_URL    = api.adminProfile.url;
  const UPDATE_PROFILE_URL = api.adminUpdate.url;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1) get profile
        const { data } = await axios.get(GET_PROFILE_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
        setUpdatedProfile(data);

        // 2) get all universities
        const uniRes = await axios.get(api.fetchUniversities.url);
        setUniversities(normalize(uniRes.data));

        // 3) get branches for this admin’s universityId
        const branchRes = await axios.get(
          api.fetchBranches.url.replace(":universityId", data.universityId)
        );
        setBranches(normalize(branchRes.data));
      } catch (err) {
        console.error("Error loading admin profile or lists:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setUpdatedProfile(p => ({ ...p, [name]: value }));

    // if university changes, reload branches
    if (name === "universityId") {
      const uniId = +value;
      setUpdatedProfile(p => ({ ...p, branchId: "" }));
      setBranches([]);
      axios
        .get(api.fetchBranches.url.replace(":universityId", uniId))
        .then(res => setBranches(normalize(res.data)))
        .catch(console.error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...updatedProfile,
        universityId: +updatedProfile.universityId,
        branchId:     +updatedProfile.branchId
      };
      const resp = await axios.put(UPDATE_PROFILE_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (resp.status >= 200 && resp.status < 300) {
        setProfile(payload);
        setEditMode(false);
      } else {
        console.error("Failed to update admin profile");
      }
    } catch (err) {
      console.error("Error saving admin profile:", err);
    }
  };

  const getNameById = (list, id) => {
    const it = list.find(x => x.id === id);
    return it ? it.name : "";
  };

  if (isLoading)
    return <div className="text-center text-lg font-bold">Loading...</div>;
  if (!profile)
    return <div className="text-center text-lg font-bold">No profile data.</div>;

  return (
    <div className="min-h-screen mt-5 bg-gray-100">
      <FaBars
        onClick={() => setIsOpen(o => !o)}
        className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400"
      />
      <AdminSidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(o => !o)} />

      <div className="container mt-4 mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200 transform hover:scale-105 transition duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <User className="w-12 h-12 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
          </div>

          <div className="space-y-6">
            {Object.entries(profile)
              .filter(([key]) => !["id", "password"].includes(key.toLowerCase()))
              .map(([key, value]) => {
                const isUniversity = key === "universityId";
                const isBranch     = key === "branchId";
                let label, options = [];

                if (isUniversity) {
                  label   = "University";
                  options = universities;
                } else if (isBranch) {
                  label   = "Branch";
                  options = branches;
                } else {
                  // generic label
                  label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, c => c.toUpperCase());
                }

                return (
                  <div key={key} className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <div className="mt-1 relative">
                      {key === "email" && (
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      )}
                      {key === "role" && (
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      )}

                      {isUniversity || isBranch ? (
                        !editMode ? (
                          <input
                            readOnly
                            value={getNameById(options, value)}
                            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
                          />
                        ) : (
                          <select
                            name={key}
                            value={updatedProfile[key] || ""}
                            onChange={handleChange}
                            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="">Select {label}</option>
                            {options.map(o => (
                              <option key={o.id} value={o.id}>
                                {o.name}
                              </option>
                            ))}
                          </select>
                        )
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={updatedProfile[key] || ""}
                          onChange={e =>
                            setUpdatedProfile(p => ({
                              ...p,
                              [e.target.name]: e.target.value
                            }))
                          }
                          disabled={!editMode}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-8 flex justify-between">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
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

export default AdminProfilePage;
