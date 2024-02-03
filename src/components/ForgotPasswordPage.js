import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Modal from "./Modal"; // Make sure to import the Modal component

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setModalMessage(
          "If your email is registered, you will receive a password reset link shortly."
        );
        setModalOpen(true);
        setTimeout(() => navigate("/login"), 5000);
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        setModalMessage("An error occurred. Please try again later.");
        setModalOpen(true);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-10">
        <div className="max-w-md w-full space-y-8 bg-white rounded shadow-md p-10">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <input
              type="email"
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Reset Link
            </button>
            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to Login
              </Link>
            </div>
            {modalMessage && (
              <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
