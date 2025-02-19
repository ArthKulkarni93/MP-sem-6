import React from "react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const handleSignup = () => {
      navigate("/signup"); // Navigate to the Signup component
  };
  const handlelogin = () => {
    navigate("/login"); // Navigate to the login component
};
const handlehome = () => {
  navigate("/"); // Navigate to the home component
};
const handlehome1 = () => {
  // navigate("/"); // Navigate to the home component
};
    return (
      <div class="flex w-full z-10 flex-row justify-between bg-gray-700 top-0 fixed left-0 right-0 py-2 ">
  <div class="flex-1">
    <button class=" text-white font-bold py-2 px-4 ml-6 rounded"
    onClick={handlehome1}>
      Secure Exam Portal
    </button>
  </div>
  <div class="flex-1 text-right mr-2">
    <button class="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-4  mx-2 rounded"
     onClick={handlehome}>
      Home
    </button>
    <button class="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-4 mx-2 rounded"
    onClick={handleSignup}>
      Signup
    </button>
    <button class="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-4  rounded"
    onClick={handlelogin}>
      Login
    </button>
  </div>
</div>
    )
}
export default Header;