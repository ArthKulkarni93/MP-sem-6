import axios from 'axios';

const baseURL = 'https://mp-sem-6-1jkt.onrender.com';

const api = {
  // Authentication and Authorization
  studentSignup: {
    url: `${baseURL}/api/v1/auth/student/signup`,
    method: "POST"
  },
  adminSignup: {
    url: `${baseURL}/api/v1/auth/teacher/signup`,
    method: "POST"
  },
  studentSignin: {
    url: `${baseURL}/api/v1/auth/student/signin`,
    method: "POST"
  },
  adminSignin: {
    url: `${baseURL}/api/v1/auth/teacher/signin`,
    method: "POST"
  },

  // Profile Fetch
  studentProfile: {
    url: `${baseURL}/api/v1/auth/student/profile`,
    method: "GET"
  },
  adminProfile: {
    url: `${baseURL}/api/v1/auth/teacher/profile`,
    method: "GET"
  },

  // Profile Update
  studentUpdate: {
    url: `${baseURL}/api/v1/auth/student/update`,
    method: "PUT"
  },
  adminUpdate: {
    url: `${baseURL}/api/v1/auth/teacher/update`,
    method: "PUT"
  },

  // Test Creation and Management
  createTest: {
    url: `${baseURL}/api/v1/auth/testTeacher/tests`,
    method: "POST"
  },
  uploadCsv: {
    url: `${baseURL}/api/v1/auth/testTeacher/tests/:testid/questions`,
    method: "POST"
  },
  getTests: {
    url: `${baseURL}/api/v1/auth/testTeacher/tests`,
    method: "GET"
  },
  getSTests: {
    url: `${baseURL}/api/v1/auth/testStudent/tests`,
    method: "GET"
  },

  // Results Management
  getSResults: {
    url: `${baseURL}/api/v1/auth/testStudent/results`,
    method: "GET"
  },
  //Student Responses
  getSResponses: {
    url: `${baseURL}/api/v1/auth/testStudent/responses/:testId`,
    method: "GET"
  },
    
  getTestResults: {
    url: `${baseURL}/api/v1/auth/testTeacher/tests/:testid/results`,
    method: "GET"
  },  
  getSTest: {
    url: `${baseURL}/api/v1/auth/testStudent/tests/:testid`,
    method: "GET"
  },
  getSQuestions: {
    url: `${baseURL}/api/v1/auth/testStudent/tests/:testid/questions`,
    method: "GET"
  },
  getSTestSubmit: {
    url: `${baseURL}/api/v1/auth/testStudent/tests/:testid/submit`,
    method: "POST"
  },

  // New Endpoints for Universities, Branches, and Years
  fetchUniversities: {
    url: `${baseURL}/api/v1/auth/universities`,
    method: "GET"
  },
 // Frontend API Update for Fetching Branches
fetchBranches: {
    url: `${baseURL}/api/v1/auth/branches/:universityId`,
    method: "GET"
  },
  
  fetchYears: {
    url: `${baseURL}/api/v1/auth/years/:universityId/:branchId`,
    method: "GET"
  },
   // Notes endpoints (new)
    //admin uploading the notes
    uploadNotes: {
      url: `${baseURL}/api/v1/auth/testTeacher/notes`,
      method: "POST"
    },
    //student getting notes
    getNotes: { 
        url: `${baseURL}/api/v1/auth/testStudent/notes`,
        method: "GET"
    }
};

export default api;
