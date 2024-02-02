import React from "react";

const FileInput = ({ onFileSelect }) => (
  <input
    type="file"
    onChange={(e) => onFileSelect(e.target.files[0])}
    accept="application/pdf"
    required
  />
);

export default FileInput;
