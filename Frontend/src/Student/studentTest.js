// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import api from '../api';
// import * as blazeface from '@tensorflow-models/blazeface';
// import '@tensorflow/tfjs-backend-webgl';
// import NoCopy from './noCopy';

// const StudentTest = () => {
//   const { testId } = useParams();
//   const navigate = useNavigate();
  
//   // Local state for questions and answers
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [submitMessage, setSubmitMessage] = useState('');
  
//   // Security metrics
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);
//   const [fullScreenExits, setFullScreenExits] = useState(0);
//   const [maxFaceCount, setMaxFaceCount] = useState(0);
  
//   const videoRef = useRef(null);
//   const faceDetectionInterval = useRef(null);
  
//   // --- State Persistence: On mount, check if there's a saved state for this test ---
//   useEffect(() => {
//     const savedState = localStorage.getItem(`studentTestState_${testId}`);
//     if (savedState) {
//       const parsed = JSON.parse(savedState);
//       setAnswers(parsed.answers || {});
//       setTabSwitchCount(parsed.tabSwitchCount || 0);
//       setFullScreenExits(parsed.fullScreenExits || 0);
//       setMaxFaceCount(parsed.maxFaceCount || 0);
//       // Optionally, notify the user that previous state has been restored.
//     }
//   }, [testId]);
  
//   // --- Request full-screen immediately on mount ---
//   useEffect(() => {
//     enterFullScreen();
//     disableCopyPaste();
//   }, []);
  
//   // --- Force full-screen on left arrow press ---
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'ArrowLeft') {
//         enterFullScreen();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);
  
//   // Fetch test questions using the student questions endpoint
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error("No token found. Please log in.");
//         const questionEndpoint = api.getSQuestions.url.replace(':testid', testId);
//         const res = await axios.get(questionEndpoint, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setQuestions(res.data);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchQuestions();
//   }, [testId]);
  
//   // Handle answer selection for each question
//   const handleOptionChange = (questionId, option) => {
//     setAnswers(prev => {
//       const newAnswers = { ...prev, [questionId]: option };
//       // Save current answers and security metrics to localStorage
//       const stateToSave = {
//         answers: newAnswers,
//         tabSwitchCount,
//         fullScreenExits,
//         maxFaceCount
//       };
//       localStorage.setItem(`studentTestState_${testId}`, JSON.stringify(stateToSave));
//       return newAnswers;
//     });
//   };

//   // Security: Track tab switching and full-screen exits and persist state
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setTabSwitchCount(prev => {
//           const newVal = prev + 1;
//           updateSavedState({ tabSwitchCount: newVal });
//           return newVal;
//         });
//       }
//     };
//     const handleFullScreenChange = () => {
//       if (!document.fullscreenElement) {
//         setFullScreenExits(prev => {
//           const newVal = prev + 1;
//           updateSavedState({ fullScreenExits: newVal });
//           return newVal;
//         });
//         alert("You exited fullscreen! This will be recorded. Returning to dashboard.");
//         navigate('/student-exams');
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     document.addEventListener("fullscreenchange", handleFullScreenChange);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       document.removeEventListener("fullscreenchange", handleFullScreenChange);
//     };
//   }, [navigate, tabSwitchCount, fullScreenExits, maxFaceCount, testId]);
  
//   // Helper: update saved state in localStorage with partial changes
//   const updateSavedState = (partial) => {
//     const existing = JSON.parse(localStorage.getItem(`studentTestState_${testId}`)) || {};
//     const newState = { ...existing, ...partial };
//     localStorage.setItem(`studentTestState_${testId}`, JSON.stringify(newState));
//   };

//   // Security: Start face detection using BlazeFace
//   useEffect(() => {
//     const startFaceDetection = async () => {
//       try {
//         const model = await blazeface.load();
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.onloadedmetadata = async () => {
//             await videoRef.current.play();
//             detectFaces(model);
//           };
//         }
//       } catch (error) {
//         console.error("Error starting face detection:", error);
//       }
//     };
    
//     const detectFaces = async (model) => {
//       if (!videoRef.current || videoRef.current.videoWidth === 0) return;
//       try {
//         const predictions = await model.estimateFaces(videoRef.current, false);
//         setMaxFaceCount(prev => {
//           const newVal = Math.max(prev, predictions.length);
//           updateSavedState({ maxFaceCount: newVal });
//           return newVal;
//         });
//         faceDetectionInterval.current = requestAnimationFrame(() => detectFaces(model));
//       } catch (error) {
//         console.error("Error detecting faces:", error);
//       }
//     };

//     startFaceDetection();

//     return () => stopCamera();
//   }, []);

//   // Auto-submit test if time is over
//   useEffect(() => {
//     let timer;
//     const fetchTestDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error("No token found. Please log in.");
//         const testDetailEndpoint = api.getSTest.url.replace(':testid', testId);
//         const res = await axios.get(testDetailEndpoint, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const test = res.data;
//         const scheduled = new Date(test.scheduledDate);
//         const endTime = new Date(scheduled.getTime() + test.duration * 60000);
//         timer = setInterval(() => {
//           const now = new Date();
//           if (now >= endTime) {
//             handleSubmitTest();
//             clearInterval(timer);
//           }
//         }, 1000);
//       } catch (error) {
//         console.error("Error fetching test details:", error);
//       }
//     };
//     fetchTestDetails();
//     return () => clearInterval(timer);
//   }, [testId]);

//   const enterFullScreen = () => {
//     const elem = document.documentElement;
//     if (elem.requestFullscreen) {
//       elem.requestFullscreen().catch((err) =>
//         console.error("Error enabling full-screen mode:", err)
//       );
//     }
//   };

//   const exitFullScreenMode = () => {
//     if (document.exitFullscreen) {
//       document.exitFullscreen().catch((err) =>
//         console.error("Error exiting full-screen mode:", err)
//       );
//     }
//   };

//   const stopCamera = () => {
//     if (faceDetectionInterval.current) cancelAnimationFrame(faceDetectionInterval.current);
//     if (videoRef.current && videoRef.current.srcObject) {
//       const tracks = videoRef.current.srcObject.getTracks();
//       tracks.forEach(track => track.stop());
//     }
//   };

//   const disableCopyPaste = () => {
//     const blockEvent = (e) => e.preventDefault();
//     document.addEventListener('contextmenu', blockEvent);
//     document.addEventListener('copy', blockEvent);
//     document.addEventListener('paste', blockEvent);
//     return () => {
//       document.removeEventListener('contextmenu', blockEvent);
//       document.removeEventListener('copy', blockEvent);
//       document.removeEventListener('paste', blockEvent);
//     };
//   };

//   // Submit test answers and security metrics
//   const handleSubmitTest = async () => {
//     try {
//       stopCamera();
//       exitFullScreenMode();
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("No token found. Please log in.");
//       const submitEndpoint = api.getSTestSubmit.url.replace(':testid', testId);
//       await axios.post(
//         submitEndpoint,
//         {
//           answers,
//           security: {
//             tabSwitchCount,
//             fullScreenExits,
//             maxFaceCount,
//           },
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Submit endpoint:", submitEndpoint);
//       setSubmitMessage("Test submitted successfully!");
//       localStorage.removeItem(`studentTestState_${testId}`);
//       navigate(`/student-exams`);
//     } catch (error) {
//       console.error("Error submitting test:", error);
//       setSubmitMessage("Error submitting test.");
//     }
//   };

//   const handleTestSubmit = (e) => {
//     e.preventDefault();
//     handleSubmitTest();
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-lg text-gray-700">
//         Loading test...
//       </div>
//     );
//   }

//   return (
//     // Wrap the entire test content with DisableSelect to deter copying
//     <NoCopy>
//       <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen relative pb-40">
//         <h1 className="text-3xl font-bold mb-6">Test #{testId}</h1>
//         <form onSubmit={handleTestSubmit}>
//           {questions.length === 0 ? (
//             <p className="text-gray-600">No questions found for this test.</p>
//           ) : (
//             questions.map((question) => (
//               <div key={question.id} className="mb-6 p-4 bg-white shadow rounded">
//                 <p className="font-semibold text-gray-800 mb-2">Q: {question.queText}</p>
//                 <div className="space-y-2">
//                   {['a', 'b', 'c', 'd'].map(letter => (
//                     <label key={letter} className="flex items-center">
//                       <input
//                         type="radio"
//                         name={`question-${question.id}`}
//                         value={letter}
//                         checked={answers[question.id] === letter}
//                         onChange={() => handleOptionChange(question.id, letter)}
//                         className="mr-2"
//                       />
//                       <span className="text-gray-700">
//                         {letter.toUpperCase()}: {question[`option${letter.toUpperCase()}`]}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))
//           )}
//           <button type="submit" className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
//             Submit Test
//           </button>
//           {submitMessage && (
//             <p className="mt-4 text-center text-lg text-gray-700">{submitMessage}</p>
//           )}
//         </form>
//         <div className="fixed bottom-4 right-4 w-64 h-48 z-50 border-2 border-red-500 rounded shadow-lg">
//           <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
//         </div>
//       </div>
//     </NoCopy>
//   );
// };

// export default StudentTest;


import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs-backend-webgl';
import NoCopy from './noCopy';

const StudentTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  // Local state for questions and answers
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState(''); // Timer state
  
  // Security metrics
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullScreenExits, setFullScreenExits] = useState(0);
  const [maxFaceCount, setMaxFaceCount] = useState(0);
  
  const videoRef = useRef(null);
  const faceDetectionInterval = useRef(null);
  
  // --- Restore any saved state ---
  useEffect(() => {
    const savedState = localStorage.getItem(`studentTestState_${testId}`);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setAnswers(parsed.answers || {});
      setTabSwitchCount(parsed.tabSwitchCount || 0);
      setFullScreenExits(parsed.fullScreenExits || 0);
      setMaxFaceCount(parsed.maxFaceCount || 0);
    }
  }, [testId]);
  
  // --- Request full-screen on mount and disable copy/paste ---
  useEffect(() => {
    enterFullScreen();
    disableCopyPaste();
  }, []);
  
  // --- Force full-screen on left arrow press ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        enterFullScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // --- Fetch test questions ---
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found. Please log in.");
        const questionEndpoint = api.getSQuestions.url.replace(':testid', testId);
        const res = await axios.get(questionEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [testId]);
  
  // --- Handle answer selection ---
  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: option };
      const stateToSave = {
        answers: newAnswers,
        tabSwitchCount,
        fullScreenExits,
        maxFaceCount
      };
      localStorage.setItem(`studentTestState_${testId}`, JSON.stringify(stateToSave));
      return newAnswers;
    });
  };

  // --- Track tab switching and full-screen exits ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newVal = prev + 1;
          updateSavedState({ tabSwitchCount: newVal });
          return newVal;
        });
      }
    };
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setFullScreenExits(prev => {
          const newVal = prev + 1;
          updateSavedState({ fullScreenExits: newVal });
          return newVal;
        });
        alert("You exited fullscreen! This will be recorded. Returning to dashboard.");
        navigate('/student-exams');
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [navigate, testId]);
  
  // --- Helper: update saved state in localStorage ---
  const updateSavedState = (partial) => {
    const existing = JSON.parse(localStorage.getItem(`studentTestState_${testId}`)) || {};
    const newState = { ...existing, ...partial };
    localStorage.setItem(`studentTestState_${testId}`, JSON.stringify(newState));
  };

  // --- Start face detection using BlazeFace ---
  useEffect(() => {
    const startFaceDetection = async () => {
      try {
        const model = await blazeface.load();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = async () => {
            await videoRef.current.play();
            detectFaces(model);
          };
        }
      } catch (error) {
        console.error("Error starting face detection:", error);
      }
    };
    
    const detectFaces = async (model) => {
      if (!videoRef.current || videoRef.current.videoWidth === 0) return;
      try {
        const predictions = await model.estimateFaces(videoRef.current, false);
        setMaxFaceCount(prev => {
          const newVal = Math.max(prev, predictions.length);
          updateSavedState({ maxFaceCount: newVal });
          return newVal;
        });
        faceDetectionInterval.current = requestAnimationFrame(() => detectFaces(model));
      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    };

    startFaceDetection();

    return () => stopCamera();
  }, []);

  // --- Timer: Auto-submit test if time is over and update remaining time ---
  useEffect(() => {
    let timer;
    const fetchTestDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found. Please log in.");
        const testDetailEndpoint = api.getSTest.url.replace(':testid', testId);
        const res = await axios.get(testDetailEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const test = res.data;
        const scheduled = new Date(test.scheduledDate);
        const endTime = new Date(scheduled.getTime() + test.duration * 60000);
        timer = setInterval(() => {
          const now = new Date();
          const diff = endTime - now;
          if (diff <= 0) {
            handleSubmitTest();
            clearInterval(timer);
          } else {
            setRemainingTime(formatTime(diff));
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };
    fetchTestDetails();
    return () => clearInterval(timer);
  }, [testId]);

  // --- Helper: format time (mm:ss) ---
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) =>
        console.error("Error enabling full-screen mode:", err)
      );
    }
  };

  const exitFullScreenMode = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) =>
        console.error("Error exiting full-screen mode:", err)
      );
    }
  };

  const stopCamera = () => {
    if (faceDetectionInterval.current) cancelAnimationFrame(faceDetectionInterval.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const disableCopyPaste = () => {
    const blockEvent = (e) => e.preventDefault();
    document.addEventListener('contextmenu', blockEvent);
    document.addEventListener('copy', blockEvent);
    document.addEventListener('paste', blockEvent);
    return () => {
      document.removeEventListener('contextmenu', blockEvent);
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('paste', blockEvent);
    };
  };

  // --- Submit test answers and security metrics ---
  const handleSubmitTest = async () => {
    try {
      stopCamera();
      exitFullScreenMode();
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found. Please log in.");
      const submitEndpoint = api.getSTestSubmit.url.replace(':testid', testId);
      await axios.post(
        submitEndpoint,
        {
          answers,
          security: {
            tabSwitchCount,
            fullScreenExits,
            maxFaceCount,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Submit endpoint:", submitEndpoint);
      setSubmitMessage("Test submitted successfully!");
      localStorage.removeItem(`studentTestState_${testId}`);
      navigate(`/student-exams`);
    } catch (error) {
      console.error("Error submitting test:", error);
      setSubmitMessage("Error submitting test.");
    }
  };

  const handleTestSubmit = (e) => {
    e.preventDefault();
    handleSubmitTest();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-700">
        Loading test...
      </div>
    );
  }

  return (
    <NoCopy>
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen relative pb-40">
        {/* Fixed Timer Display */}
        <div className="fixed top-4 mt-12 right-4 bg-gray-800 text-white px-4 py-2 rounded z-50">
          Time Remaining: {remainingTime}
        </div>
        <h1 className="text-3xl font-bold mb-6">Test #{testId}</h1>
        <form onSubmit={handleTestSubmit}>
          {questions.length === 0 ? (
            <p className="text-gray-600">No questions found for this test.</p>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="mb-6 p-4 bg-white shadow rounded">
                <p className="font-semibold text-gray-800 mb-2">Q: {question.queText}</p>
                <div className="space-y-2">
                  {['a', 'b', 'c', 'd'].map(letter => (
                    <label key={letter} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={letter}
                        checked={answers[question.id] === letter}
                        onChange={() => handleOptionChange(question.id, letter)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">
                        {letter.toUpperCase()}: {question[`option${letter.toUpperCase()}`]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
          <button type="submit" className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
            Submit Test
          </button>
          {submitMessage && (
            <p className="mt-4 text-center text-lg text-gray-700">{submitMessage}</p>
          )}
        </form>
        <div className="fixed bottom-4 right-4 w-64 h-48 z-50 border-2 border-red-500 rounded shadow-lg">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
        </div>
      </div>
    </NoCopy>
  );
};

export default StudentTest;
