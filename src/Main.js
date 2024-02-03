import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import FileInput from "./FileInput";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { auth } from "./firebase.config"; // Adjust the path as necessary
import { signOut } from "firebase/auth";
import jsPDF from "jspdf";
import Modal from "./components/Modal";

GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const Main = () => {
  const [response, setResponse] = useState(null);
  const [text, setText] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [username, setUsername] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isSignedOut, setIsSignedOut] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || user.email || "User");
    }
  }, []);

  const convertToRichText = (jsonOutput) => {
    if (!jsonOutput) return "";

    let parsedData;
    try {
      parsedData = JSON.parse(jsonOutput);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return ""; // Return empty string or some error message if JSON is invalid
    }
    const lines = parsedData.content.split(".\n");
    const richText = lines.map((para) => `${para}`).join("");

    return richText;
  };

  const richText = jsonOutput ? convertToRichText(jsonOutput) : "";

  const fetchData = async () => {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const result = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `You're a greatest tech recruiter who has experience working with multiple startups and scaled up companies as well.

            I want you to carefully review ${richText} which is my resume and ${text} which is the job description of the job that I am applying to.
            
            I want you to show your expertise and generate a new resume based on the job description and use ${richText} as my current experience but make sure to add some made up experience yourself to make sure this resume gets shortlisted for the job.
            
            Please make sure the resume is ATS screenable and friendly for the job role.
            
            Please make tailor made resume according to the job description 
            
            I really want to get shortlised for this role, and if you can help me that will be very very helpful.
            
            Thanks `,
          },
          {
            role: "user",
            content: `I want you to follow my instructions very clearly and word by word and make a tailor made resume according to the job description.

            And feel free to make up the experience in a way that closely relate to the job description. But only do this if my current experience is really unrelated to the job description

            You're a greatest tech recruiter who has experience working with multiple startups and scaled up companies as well.
            
            I want you to carefully review ${richText} which is my resume and ${text} which is the job description of the job that I am applying to.
            
            I want you to show your expertise and generate a new resume based on the job description and use ${richText} as my current experience.
            
           
            
            Make my experience outcome driven showing the numbers or % change and also make it really detailed also share what I did that make this outcome happen.
            
            Please make the output in a structure of resume, which I can use to re-write my resume.
            
            I really want to get shortlised for this role make sure the resume has more than 99% chance of shortlisting, and if you can help me that will be very very helpful.
            
            Just keep the output strictly only for resume don't add any single other words apart from that including reference or any other text. Also, use normal words - don't use jargons. 
            
            Thanks `,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
      });

      // setResponse(result);
      setResponse(result?.choices[0]?.message?.content);
    } catch (error) {
      console.error("Error fetching data from OpenAI:", error);
      setResponse(null);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
    console.log("Hitted");
  };

  const handleFileSelect = async (file) => {
    const firstPageText = await extractTextFromPDF(file);
    if (firstPageText) {
      const page = JSON.stringify({ content: firstPageText }, null, 2);
      setJsonOutput(page);
      console.log("File selected");
    } else {
      setJsonOutput(""); // Reset or handle error
    }
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

  const handleSignOut = async () => {
    try {
      setModalTitle("Sign Out");
      setModalMessage("Sign out successful \n Redirecting to login page.");

      setTimeout(async () => {
        await signOut(auth);
        setIsSignedOut(true);
      }, 4000);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(`Error signing out: ${error.message}`);
    }
    setModalOpen(true);
  };

  useEffect(() => {
    if (isSignedOut && !modalOpen) {
    }
  }, [isSignedOut, modalOpen]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setModalTitle("Copy to Clipboard");
      setModalMessage("Copied to clipboard!");
      setModalOpen(true);
    } catch (err) {
      setModalTitle("Error");
      setModalMessage("Failed to copy");
      setModalOpen(true);
    }
  };

  const downloadPDF = (text) => {
    const doc = new jsPDF();

    // Define margins and page width
    const margins = {
      top: 10,
      bottom: 10,
      left: 10,
      width: 180,
    };

    // Use splitTextToSize to handle long text
    const splitText = doc.splitTextToSize(text, margins.width);

    // Initial vertical offset for lines
    let verticalOffset = margins.top;

    splitText.forEach((line, index) => {
      if (verticalOffset + 10 > doc.internal.pageSize.height - margins.bottom) {
        doc.addPage();
        verticalOffset = margins.top; // Reset vertical offset for the new page
      }
      doc.text(line, margins.left, verticalOffset);
      verticalOffset += 10; // Increase vertical offset for next line
    });

    doc.save("resume.pdf");
  };

  const handleReset = () => {
    setText(""); // Clear text area
    setResponse(null); // Clear response
    setFileInputKey(Date.now());
    setModalTitle("Reset");
    setModalMessage("Fields Resetted ");
    setModalOpen(true); // Reset FileInput by changing its key
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sign-out button container */}

      <div className="flex justify-between items-center bg-gray-900 text-white p-4">
        <h1 className="text-xl font-semibold">Hello, {username}</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-150"
        >
          Sign Out
        </button>
      </div>

      {/* Main content container */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-8">QwikResume</h1>
          <textarea
            className="w-full max-w-3xl p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Paste the job description here..."
            rows="6"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <FileInput key={fileInputKey} onFileSelect={handleFileSelect} />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate Resume
          </button>

          {response && (
            <div>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => copyToClipboard(response)}
                  className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 text-white font-bold rounded transition ease-in-out duration-150"
                >
                  Copy Response
                </button>
                <button
                  type="button"
                  onClick={() => downloadPDF(response)}
                  className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 text-white font-bold rounded transition ease-in-out duration-150"
                >
                  Download as PDF
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 text-white font-bold rounded transition ease-in-out duration-150"
                >
                  Reset
                </button>
              </div>
              <div className="mt-8 p-4 bg-white shadow rounded-lg w-full max-w-3xl">
                <h2 className="text-2xl font-semibold mb-2">
                  Formatted Resume:
                </h2>
                <div className="whitespace-pre-wrap">{response}</div>
              </div>
            </div>
          )}
        </div>
      </form>
      <Modal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default Main;
