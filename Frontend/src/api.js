import axios from 'axios';

let baseURL = 'http://localhost:5001';
    
console.log("url",baseURL);

const api ={
    //auth
    
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



