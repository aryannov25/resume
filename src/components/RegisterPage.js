import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.config";
import Navbar from "./Navbar";
import Modal from "./Modal";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*]).*$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must include at least one uppercase letter and one special character."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered:", userCredential.user);

      await updateProfile(userCredential.user, {
        displayName: username,
      });
      console.log("Profile updated for:", username);

      setModalMessage("User registered and profile updated");
      setModalOpen(true); // Ensure this is set after all other states are updated
    } catch (error) {
      console.error("Error registering:", error);
      setModalMessage(`Error registering: ${error.message}`); // Use modalMessage for displaying registration errors
      setModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-6 py-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded shadow-md px-10 py-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Register
          </h2>
          <form className="space-y-6" onSubmit={handleRegister}>
            <input
              type="text"
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Password Input */}
            <input
              type="password"
              className={`input ${
                passwordError ? "border-red-500" : ""
              } appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(""); // Clear error when user starts correcting the password
              }}
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to Login
              </Link>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs italic">{passwordError}</p>
            )}
          </form>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => {
          setModalOpen(false);
          navigate("/login"); // Adjust this as needed
        }}
      />
    </div>
  );
};

export default RegisterPage;
