import React from "react";

const Modal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-60 flex justify-center items-center"
      onClick={onClose} // Allow modal to close when the background is clicked
    >
      <div
        className="bg-white rounded-lg shadow-md max-w-md mx-auto text-center"
        onClick={(e) => e.stopPropagation()} // Prevent modal close function when the modal content is clicked
      >
        <div className="p-6 md:p-8 lg:p-10">
          <div className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">
            {message}
          </div>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
