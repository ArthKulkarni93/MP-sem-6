// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import StudentSidebar from '../Sidebar/studentSidebar';
// // import { FaBars } from 'react-icons/fa';

// // const StudentResult = () => {
// //     const [isOpen, setIsOpen] = useState(false);

// //     const toggleSidebar = () => {
// //         setIsOpen(!isOpen);
// //     };

// //     return (
// //         <div className="flex h-screen mt-5 bg-gray-100">
// //             <FaBars 
// //                 onClick={toggleSidebar} 
// //                 className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
// //             />
// //             <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="admin" />

// //             <div className="flex-1 p-8">
                
// //             </div>
// //         </div>
// //     );
// // };

// // export default StudentResult;

// import React, { useState, useEffect } from 'react';
// import StudentSidebar from '../Sidebar/studentSidebar';
// import { FaBars } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import api from '../api';

// const StudentResults = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState('');
//   const [selectedResult, setSelectedResult] = useState(null); // Detailed view state
//   const navigate = useNavigate();

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   // Fetch the completed test results for the student
//   const fetchResults = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Please log in.');
//       const res = await axios.get(api.getSResults.url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("res" , res);
//       setResults(res.data);
//     } catch (err) {
//       console.error('Error fetching results:', err);
//       setError('Error fetching results.');
//     }
//   };

//   useEffect(() => {
//     fetchResults();
//   }, []);

//   // When a student clicks "View Solution"
//   const handleViewSolution = (result) => {
//     setSelectedResult(result);
//   };

//   // Render dashboard if no detailed view is selected
//   if (!selectedResult) {
//     return (
//       <div className="flex h-screen mt-5 bg-gray-100">
//         <FaBars 
//           onClick={toggleSidebar} 
//           className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
//         />
//         <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="student" />
//         <div className="flex-1 mt-5 p-8 overflow-y-auto">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6">Completed Tests</h1>
//           {error && <p className="text-red-500">{error}</p>}
//           {results.length === 0 ? (
//             <p className="text-gray-600">No completed tests found.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {results.map(result => (
//                 <div key={result.testId} className="bg-white shadow rounded-lg p-4">
//                   <h3 className="text-xl font-semibold text-gray-700">{result.test.title}</h3>
//                   <p className="text-gray-500">Subject: {result.test.subject}</p>
//                   <p className="text-gray-500">
//                     Score: {result.scoredmarks} / {result.totalmarks}
//                   </p>
//                   <button
//                     onClick={() => handleViewSolution(result)}
//                     className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
//                   >
//                     View Solution
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   } else {
//     return <StudentResultDetail result={selectedResult} onBack={() => setSelectedResult(null)} />;
//   }
// };

// const StudentResultDetail = ({ result, onBack }) => {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const testId = result.testId;

//   // Fetch the test questions for this test
//   const fetchQuestions = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("No token found.");
//       const questionEndpoint = api.getSQuestions.url.replace(':testid', testId);
//       const res = await axios.get(questionEndpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setQuestions(res.data);
//       console.log("questionEndpoint=>" , res);
//     } catch (error) {
//       console.error("Error fetching test questions:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [testId]);

//   // Check if the current time is after the test end time
//   // We assume result.test includes scheduledDate and duration.
//   const canViewSolution = () => {
//     const scheduled = new Date(result.test.scheduledDate);
//     const duration = result.test.duration || 0;
//     console.log("result=>" , result)
//     console.log("scheduled time" , scheduled);
//     console.log("duration: " , duration);
//     const endTime = new Date(scheduled.getTime() + duration * 60000);
//     console.log("endTime" , endTime);
//     console.log("the time" , new Date());
//     return new Date() >= endTime;
//   };

//   if (!canViewSolution()) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-100">
//         <div className="bg-white p-6 rounded shadow-lg">
//           <p className="text-lg text-gray-800 mb-4">
//             You cannot view the solutions until the test time has ended.
//           </p>
//           <button
//             onClick={onBack}
//             className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-lg text-gray-700">
//         Loading solution...
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen mt-5 bg-gray-100">
//       <FaBars 
//         className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
//         onClick={onBack}
//       />
//       <StudentSidebar isOpen={false} toggleSidebar={() => {}} role="student" />
//       <div className="flex-1 mt-4 p-8 overflow-y-auto">
//         <button
//           onClick={onBack}
//           className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
//         >
//           &larr; Back
//         </button>
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">
//           Solution for Test #{testId}
//         </h1>
//         {questions.map((question) => {
//           const correctAns = question.correctOption.toLowerCase();
//           // Assume result.answers is an object mapping question IDs to the student's answer
         
//           const studentAns = result.answers && result.answers[question.id]
//             ? result.answers[question.id].toLowerCase()
//             : "Not Attempted";
//           // console.log("###############studentAns =>" , studentAns);
//           return (
//             <div key={question.id} className="mb-6 p-4 bg-white shadow rounded">
//               <div className="flex items-center mb-2">
//                 <p className="font-semibold text-gray-800">
//                   Q: {question.queText}
//                 </p>
//                 <span className="ml-4 text-sm text-gray-600">
//                   (Marks: {question.maxMark})
//                 </span>
//               </div>
//               <div className="space-y-2">
//                 {['a', 'b', 'c', 'd'].map((letter) => {
//                   const optionText = question[`option${letter.toUpperCase()}`];
//                   const isCorrect = letter.toLowerCase() === correctAns;
//                   return (
//                     <div key={letter} className="flex items-center">
//                       <span
//                         className={`w-8 font-bold ${
//                           isCorrect ? "text-green-600" : "text-gray-800"
//                         }`}
//                       >
//                         {letter.toUpperCase()}.
//                       </span>
//                       <span className="ml-2 text-gray-700">{optionText}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//               <p className="mt-2 text-sm text-gray-600">
//                 Your choice:{" "}
//                 {studentAns === "not attempted"
//                   ? "Not Attempted"
//                   : studentAns.toUpperCase()}{" "}
//                 {studentAns === correctAns ? "(Correct)" : studentAns === "not attempted" ? "" : "(Incorrect)"}
//               </p>
//             </div>
//           );
//         })}
//         <div className="mt-8 p-4 bg-white shadow rounded">
//           <h2 className="text-xl font-bold text-gray-800">
//             Total Score: {result.scoredmarks} / {result.totalmarks}
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentResults;



// import React, { useState, useEffect } from 'react';
// import StudentSidebar from '../Sidebar/studentSidebar';
// import { FaBars } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import api from '../api';

// const StudentResults = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState('');
//   const [selectedResult, setSelectedResult] = useState(null); // Detailed view state
//   const navigate = useNavigate();

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   // Fetch the completed test results for the student
//   const fetchResults = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Please log in.');
//       const res = await axios.get(api.getSResults.url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setResults(res.data);
//       console.log("result" , res);
//       console.log("result" , res.data);
//     } catch (err) {
//       console.error('Error fetching results:', err);
//       setError('Error fetching results.');
//     }
//   };

//   useEffect(() => {
//     fetchResults();
//   }, []);

//   // When a student clicks "View Solution"
//   const handleViewSolution = (result) => {
//     setSelectedResult(result);
//   };

//   // Render dashboard if no detailed view is selected
//   if (!selectedResult) {
//     return (
//       <div className="flex h-screen mt-5 bg-gray-100">
//         <FaBars 
//           onClick={toggleSidebar} 
//           className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
//         />
//         <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="student" />
//         <div className="flex-1 mt-5 p-8 overflow-y-auto">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6">Completed Tests</h1>
//           {error && <p className="text-red-500">{error}</p>}
//           {results.length === 0 ? (
//             <p className="text-gray-600">No completed tests found.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {results.map(result => (
//                 <div key={result.testId} className="bg-white shadow rounded-lg p-4">
//                   <h3 className="text-xl font-semibold text-gray-700">{result.test.title}</h3>
//                   <p className="text-gray-500">Subject: {result.test.subject}</p>
//                   <p className="text-gray-500">
//                     Score: {result.scoredmarks} / {result.totalmarks}
//                   </p>
//                   <button
//                     onClick={() => handleViewSolution(result)}
//                     className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
//                   >
//                     View Solution
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   } else {
//     return <StudentResultDetail result={selectedResult} onBack={() => setSelectedResult(null)} />;
//   }
// };

// const StudentResultDetail = ({ result, onBack }) => {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const testId = result.testId;

//   // Fetch the test questions for this test
//   const fetchQuestions = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("No token found.");
//       const questionEndpoint = api.getSQuestions.url.replace(':testid', testId);
//       const res = await axios.get(questionEndpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setQuestions(res.data);
//       console.log("questions: ",res.data);
//       const responseEndpoint = api.getSResponses.url.replace(':testId', testId);
//       console.log("reponseapi: ",responseEndpoint);
//       const responsesRes = await axios.get(responseEndpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log(responsesRes);
//       const responses = responsesRes.data.responses;
      
//       console.log("result1" , res);
//       console.log("responses" , responses);
//     } catch (error) {
//       console.error("Error fetching test questions:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [testId]);

//   // Check if the current time is after the test end time
//   const canViewSolution = () => {
//     const scheduled = new Date(result.test.scheduledDate);
//     const duration = result.test.duration || 0;
//     const endTime = new Date(scheduled.getTime() + duration * 60000);
//     return new Date() >= endTime;
//   };

//   if (!canViewSolution()) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-100">
//         <div className="bg-white p-6 rounded shadow-lg">
//           <p className="text-lg text-gray-800 mb-4">
//             You cannot view the solutions until the test time has ended.
//           </p>
//           <button
//             onClick={onBack}
//             className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-lg text-gray-700">
//         Loading solution...
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen mt-5 bg-gray-100">
//       <FaBars 
//         className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
//         onClick={onBack}
//       />
//       <StudentSidebar isOpen={false} toggleSidebar={() => {}} role="student" />
//       <div className="flex-1 mt-4 p-8 overflow-y-auto">
//         <button
//           onClick={onBack}
//           className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
//         >
//           &larr; Back
//         </button>
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">
//           Solution for Test #{testId}
//         </h1>
//         {questions.map((question) => {
//           const correctAns = question.correctOption.toLowerCase();
//           // Use student's answer if available; otherwise display "Not Attempted"
//           const studentAns = result.answers && result.answers[question.id]
//             ? result.answers[question.id].toLowerCase()
//             : "Not Attempted";
//           return (
//             <div key={question.id} className="mb-6 p-4 bg-white shadow rounded">
//               <div className="flex items-center mb-2">
//                 <p className="font-semibold text-gray-800">
//                   Q: {question.queText}
//                 </p>
//                 <span className="ml-4 text-sm text-gray-600">
//                   (Marks: {question.maxMark})
//                 </span>
//               </div>
//               <div className="space-y-2">
//                 {['a', 'b', 'c', 'd'].map((letter) => {
//                   const optionText = question[`option${letter.toUpperCase()}`];
//                   const isCorrect = letter.toLowerCase() === correctAns;
//                   return (
//                     <div key={letter} className="flex items-center">
//                       <span
//                         className={`w-8 font-bold ${isCorrect ? "text-green-600" : "text-gray-800"}`}
//                       >
//                         {letter.toUpperCase()}.
//                       </span>
//                       <span className="ml-2 text-gray-700">{optionText}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//               <p className="mt-2 text-sm text-gray-600">
//                 Your choice: {studentAns === "Not Attempted" ? "Not Attempted" : studentAns.toUpperCase()}{" "}
//                 {studentAns === correctAns ? "(Correct)" : studentAns === "Not Attempted" ? "" : "(Incorrect)"}
//               </p>
//             </div>
//           );
//         })}
//         <div className="mt-8 p-4 bg-white shadow rounded">
//           <h2 className="text-xl font-bold text-gray-800">
//             Total Score: {result.scoredmarks} / {result.totalmarks}
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentResults;

import React, { useState, useEffect } from 'react';
import StudentSidebar from '../Sidebar/studentSidebar';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';

const StudentResults = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in.');
      const res = await axios.get(api.getSResults.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Error fetching results.');
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleViewSolution = (result) => {
    setSelectedResult(result);
  };

  if (!selectedResult) {
    return (
      <div className="flex h-screen mt-5 bg-gray-100">
        <FaBars 
          onClick={toggleSidebar} 
          className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
        />
        <StudentSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} role="student" />
        <div className="flex-1 mt-5 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Completed Tests</h1>
          {error && <p className="text-red-500">{error}</p>}
          {results.length === 0 ? (
            <p className="text-gray-600">No completed tests found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map(result => (
                <div key={result.testId} className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-700">{result.test.title}</h3>
                  <p className="text-gray-500">Subject: {result.test.subject}</p>
                  <p className="text-gray-500">
                    Score: {result.scoredmarks} / {result.totalmarks}
                  </p>
                  <button
                    onClick={() => handleViewSolution(result)}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    View Solution
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return <StudentResultDetail result={selectedResult} onBack={() => setSelectedResult(null)} />;
  }
};

const StudentResultDetail = ({ result, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const testId = result.testId;

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found.");
      
      // Fetch questions
      const questionEndpoint = api.getSQuestions.url.replace(':testid', testId);
      const questionsRes = await axios.get(questionEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(questionsRes.data);

      // Fetch responses
      const responseEndpoint = api.getSResponses.url.replace(':testId', testId);
      const responsesRes = await axios.get(responseEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Ensure responses is an array
      const fetchedResponses = Array.isArray(responsesRes.data?.responses) 
        ? responsesRes.data.responses 
        : [];
      setResponses(fetchedResponses);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  const canViewSolution = () => {
    const scheduled = new Date(result.test.scheduledDate);
    const duration = result.test.duration || 0;
    const endTime = new Date(scheduled.getTime() + duration * 60000);
    return new Date() >= endTime;
  };

  if (!canViewSolution()) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-lg">
          <p className="text-lg text-gray-800 mb-4">
            You cannot view the solutions until the test time has ended.
          </p>
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-700">
        Loading solution...
      </div>
    );
  }

  return (
    <div className="flex h-screen mt-5 bg-gray-100">
      <FaBars 
        className="cursor-pointer fixed text-xl text-white ml-1 z-20 hover:text-gray-400" 
        onClick={onBack}
      />
      <StudentSidebar isOpen={false} toggleSidebar={() => {}} role="student" />
      <div className="flex-1 mt-4 p-8 overflow-y-auto">
        <button
          onClick={onBack}
          className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Solution for {result.test.title}
        </h1>
        
        {questions.map((question, index) => {
          // Find the response for this question
          const response = responses.find(r => 
            r.question && (r.question.id === question.id || r.question.queText === question.queText)
          ) || {};
          
          const selectedOption = response.selectedOption 
            ? response.selectedOption.toLowerCase() 
            : "Not Attempted";
          
          const correctAns = question.correctOption.toLowerCase();
          const isCorrect = selectedOption === correctAns;

          return (
            <div key={question.id || index} className="mb-6 p-4 bg-white shadow rounded">
              <div className="flex items-center mb-2">
                <p className="font-semibold text-gray-800">
                  Q{index + 1}: {question.queText}
                </p>
                <span className="ml-4 text-sm text-gray-600">
                  (Marks: {question.maxMark})
                </span>
              </div>
              
              <div className="space-y-2">
                {['a', 'b', 'c', 'd'].map((letter) => {
                  const optionText = question[`option${letter.toUpperCase()}`];
                  const isThisCorrect = letter === correctAns;
                  const isSelected = letter === selectedOption;
                  
                  return (
                    <div 
                      key={letter} 
                      className={`flex items-center p-2 rounded ${
                        isSelected 
                          ? isCorrect ? 'bg-green-100' : 'bg-red-100'
                          : isThisCorrect ? 'bg-green-50' : ''
                      }`}
                    >
                      <span
                        className={`w-8 font-bold ${
                          isThisCorrect ? "text-green-600" : "text-gray-800"
                        }`}
                      >
                        {letter.toUpperCase()}.
                      </span>
                      <span className="ml-2 text-gray-700">{optionText}</span>
                    </div>
                  );
                })}
              </div>
              
              <p className="mt-2 text-sm text-gray-600">
                Your choice: {selectedOption.toUpperCase()}{" "}
                {selectedOption === "Not Attempted" 
                  ? "(Not Attempted)" 
                  : isCorrect ? "(Correct)" : "(Incorrect)"}
              </p>
            </div>
          );
        })}
        
        <div className="mt-8 p-4 bg-white shadow rounded">
          <h2 className="text-xl font-bold text-gray-800">
            Total Score: {result.scoredmarks} / {result.totalmarks}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StudentResults;