import React, { useState } from "react";
import FileInput from "./FileInput";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Point to the PDF.js worker script in the public folder
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const ResumeInput = () => {
  const [jsonOutput, setJsonOutput] = useState("");

  const handleFileSelect = async (file) => {
    const firstPageText = await extractTextFromPDF(file);
    const page = JSON.stringify({ content: firstPageText }, null, 2);
    setJsonOutput(page);
  };

  const extractTextFromPDF = async (file) => {
    const fileURL = URL.createObjectURL(file);
    const loadingTask = getDocument(fileURL);
    const pdf = await loadingTask.promise;

    let firstPageText = "";

    // Only process the first page
    if (pdf.numPages > 0) {
      const page = await pdf.getPage(1); // Get only the first page
      const textContent = await page.getTextContent();
      firstPageText = textContent.items.map((item) => item.str).join(" ");
    }

    return firstPageText;
  };

  return (
    <div>
      <FileInput onFileSelect={handleFileSelect} />
      <pre>{jsonOutput}</pre>
    </div>
  );
};

export default ResumeInput;
