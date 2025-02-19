import React from "react";
import homepng from "./home.png";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    const handleSignup = () => {
        navigate("/signup"); // Navigate to the Signup component
    };
    return (
    <>
        <div className="grid place-items-center mt-16  ">
            <div className="grid grid-cols-1 lg:grid-cols-2  md:gap-4  place-items-start lg:place-items-center">
                
                <div className="flex  flex-col items-center max-w-2xl ">
                    <h1 className="flex text-6xl text-green-700 font-extrabold mb-6 lg:mb-10">
                    Welcome to Exam Portal
                    </h1>
                    <p className="text-base text-gray-500">A comprehensive solution designed to 
                        maintain the highest standards of academic integrity during online assessments.
                         Whether you are a student preparing for an exam or an admin overseeing the process, 
                         our portal offers the tools and features necessary to ensure a secure and fair testing environment.</p>

                         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-9 rounded-lg"
                         onClick={handleSignup}>
                            Signup
                            </button>

                </div>
                <div className="mb-9 lg:mb-0">
                    <img src={homepng} alt="home_banner" width={600} height={600} />
                </div>
            </div>
        </div>
    </> 
    )
}
export default Home;
