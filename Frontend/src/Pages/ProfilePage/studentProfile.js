// src/pages/Profile/studentProfile.js
import React, { useState, useEffect } from "react";
import { Edit, Save, User, Mail, Hash } from "lucide-react";
import StudentSidebar from '../../Sidebar/studentSidebar';
import { FaBars } from 'react-icons/fa';
import axios from "axios";
import api from '../../api';

const StudentProfilePage = () => {
  // helper to turn [{id, Universityname, ...}] → [{id, name}]
  const normalize = arr =>
    arr.map(item => {
      const nameKey = Object.keys(item).find(k => /name/i.test(k));
      return { id: item.id, name: nameKey ? item[nameKey] : String(item.id) };
    });

  const [profile,       setProfile]       = useState(null);
  const [editMode,      setEditMode]      = useState(false);
  const [updatedProfile,setUpdatedProfile]= useState({});
  const [universities,  setUniversities]  = useState([]);
  const [branches,      setBranches]      = useState([]);
  const [years,         setYears]         = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isOpen,        setIsOpen]        = useState(false);

  const GET_PROFILE_URL   = api.studentProfile.url;
  const UPDATE_PROFILE_URL= api.studentUpdate.url;

  useEffect(() => {
    const fetchProfileAndOptions = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1) profile
        const { data } = await axios.get(GET_PROFILE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
        setUpdatedProfile(data);

        // 2) universities
        const uniRes = await axios.get(api.fetchUniversities.url);
        setUniversities(normalize(uniRes.data));

        // 3) branches for this university
        const branchRes = await axios.get(
          api.fetchBranches.url.replace(":universityId", data.universityId)
        );
        setBranches(normalize(branchRes.data));

        // 4) years for this university+branch
        const yearRes = await axios.get(
          api.fetchYears.url
            .replace(":universityId", data.universityId)
            .replace(":branchId", data.branchId)
        );
        setYears(normalize(yearRes.data));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileAndOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile(p => ({ ...p, [name]: value }));

    if (name === "universityId") {
      const uniId = +value;
      setBranches([]); setYears([]);
      setUpdatedProfile(p => ({ ...p, branchId: "", yearId: "" }));
      axios
        .get(api.fetchBranches.url.replace(":universityId", uniId))
        .then(res => setBranches(normalize(res.data)));
    }

    if (name === "branchId") {
      const uniId    = +updatedProfile.universityId;
      const branchId = +value;
      setYears([]);
      setUpdatedProfile(p => ({ ...p, yearId: "" }));
      axios
        .get(
          api.fetchYears.url
            .replace(":universityId", uniId)
            .replace(":branchId", branchId)
        )
        .then(res => setYears(normalize(res.data)));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...updatedProfile,
        universityId: +updatedProfile.universityId,
        branchId:     +updatedProfile.branchId,
        yearId:       +updatedProfile.yearId,
      };
      const resp = await axios.put(UPDATE_PROFILE_URL, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (resp.status >= 200 && resp.status < 300) {
        setProfile(payload);
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getNameById = (list, id) => {
    const it = list.find(x => x.id === id);
    return it ? it.name : "";
  };

  if (isLoading)
    return <div className="text-center text-lg font-bold">Loading...</div>;
  if (!profile)
    return <div className="text-center text-lg font-bold">No profile data found.</div>;

  return (
    <div className="min-h-screen mt-5 bg-gray-100">
      <FaBars onClick={() => setIsOpen(o => !o)}
              className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400"/>
      <StudentSidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(o => !o)} />
      <div className="container mt-4 mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200 transform hover:scale-105 transition duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <User className="w-12 h-12 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
          </div>
          <div className="space-y-6">
            {Object.entries(profile)
              .filter(([k]) => !["id","password"].includes(k.toLowerCase()))
              .map(([key, val]) => {
                const isDD = ["universityId","branchId","yearId"].includes(key);
                let label, opts = [];
                if (key==="universityId") { label="University"; opts=universities; }
                else if (key==="branchId") { label="Branch"; opts=branches; }
                else if (key==="yearId")      { label="Year";   opts=years; }
                else {
                  label = key.replace(/([A-Z])/g," $1")
                             .replace(/^./,c=>c.toUpperCase());
                }

                return (
                  <div key={key} className="relative">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <div className="mt-1 relative">
                      {key==="email" && <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"/>}
                      {key==="PRN"   && <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"/>}

                      {isDD ? (
                        !editMode ? (
                          <input
                            readOnly
                            value={getNameById(opts, val)}
                            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
                          />
                        ) : (
                          <select
                            name={key}
                            value={updatedProfile[key]||""}
                            onChange={handleChange}
                            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="">Select {label}</option>
                            {opts.map(o=>(
                              <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                          </select>
                        )
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={updatedProfile[key]||""}
                          onChange={handleChange}
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
              <button onClick={()=>setEditMode(true)}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
                <Edit className="inline-block mr-2"/> Edit
              </button>
            ) : (
              <button onClick={handleSave}
                      className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition">
                <Save className="inline-block mr-2"/> Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
