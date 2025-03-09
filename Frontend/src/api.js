import axios from 'axios';

let baseURL = 'http://localhost:5001';
    
console.log("url",baseURL);

const api ={
    //authentication and autjorization
    studentSignup : {
        url:`${baseURL}/api/v1/auth/student/signup`
    },
    
    adminSignup :  {
        url:`${baseURL}/api/v1/auth/teacher/signup`
    },

    studentSignin : {
        url:`${baseURL}/api/v1/auth/student/signin`
    },

    adminSignin :  {
        url:`${baseURL}/api/v1/auth/teacher/signin`
    },
    // Profile fetch (NEW)
    studentProfile: {
        url: `${baseURL}/api/v1/auth/student/profile`
    },
    adminProfile: {
        url: `${baseURL}/api/v1/auth/teacher/profile`
    },

    // Profile update
    studentUpdate: {
        url: `${baseURL}/api/v1/auth/student/update`
    },
    adminUpdate: {
        url: `${baseURL}/api/v1/auth/teacher/update`
    },
    //test creation
    createTest : {
        url: `${baseURL}/api/v1/auth/testTeacher/tests`
    },
    //uploading csv file
    uploadCsv : {
        url: `${baseURL}/api/v1/auth/testTeacher/tests/:testid/questions`
    },
    //getTests for admin
    getTests : {
        url: `${baseURL}/api/v1/auth/testTeacher/tests`
    },
    //getTests for student
    getSTests : {
        url: `${baseURL}/api/v1/auth/testStudent/tests`
    },
    //getting results for student
    getSResults: {
        url: `${baseURL}/api/v1/auth/testStudent/results`
    },
    //get students particular test
    getSTest: { 
        url: `${baseURL}/api/v1/auth/testStudent/tests/:testid` 
    },
    //get student test questions
    getSQuestions: { 
        url: `${baseURL}/api/v1/auth/testStudent/tests/:testid/questions` 
    },
    //student submit the test
    getSTestSubmit: { 
        url: `${baseURL}/api/v1/auth/testStudent/tests/:testid/submit` 
    }  
    // export const studentSignin = (FormData) => api.post('api/v1/auth/student/signin',FormData);
    // export const adminSignin = (FormData) => api.post('api/v1/auth/teacher/signin',FormData);
    // export const studentUpdate = (FormData) => api.post('api/v1/auth/student/update',FormData);
    // export const adminUpdate = (FormData) => api.post('api/v1/auth/teacher/update',FormData);
    // //test
    // export const createTest = (FormData) => api.post('api/v1/auth/testTeacher/tests',FormData);
    // export const uploadCsv = (FormData) => api.post('api/v1/auth/testTeacher/tests/:testid/questions',FormData);
    // export const getTests = (FormData) => api.post('api/v1/auth/testTeacher/tests',FormData);
    // export const getResults = (FormData) => api.post('api/v1/auth/testTeacher',FormData);
}

export default api



// import axios from 'axios';

// const baseURL = 'http://localhost:5001';

// const api = {
//   // Authentication
//   studentSignup: {
//     url: `${baseURL}/api/v1/auth/student/signup`
//   },
//   adminSignup: {
//     url: `${baseURL}/api/v1/auth/teacher/signup`
//   },
//   studentSignin: {
//     url: `${baseURL}/api/v1/auth/student/signin`
//   },
//   adminSignin: {
//     url: `${baseURL}/api/v1/auth/teacher/signin`
//   },
//   // Profile updates
//   studentUpdate: {
//     url: `${baseURL}/api/v1/auth/student/update`
//   },
//   adminUpdate: {
//     url: `${baseURL}/api/v1/auth/teacher/update`
//   },
//   // For teachers (not used here)
//   createTest: {
//     url: `${baseURL}/api/v1/auth/testTeacher/tests`
//   },
//   uploadCsv: {
//     url: `${baseURL}/api/v1/auth/testTeacher/tests/:testid/questions`
//   },
//   // Student endpoints for tests and results:
//   getTests: {
//     url: `${baseURL}/api/v1/auth/student/tests`
//   },
//   getSResults: {
//     url: `${baseURL}/api/v1/auth/student/results`
//   }
// };

// export default api;
