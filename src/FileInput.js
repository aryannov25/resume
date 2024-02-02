import React from "react";

const FileInput = ({ onFileSelect }) => (
  <input
    type="file"
    onChange={(e) => onFileSelect(e.target.files[0])}
    accept="application/pdf"
    required
    className="text-lg text-gray-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-lg file:font-semibold
    file:bg-blue-100 file:text-blue-700
    hover:file:bg-blue-200"
  />
);

export default FileInput;
