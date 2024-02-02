import React, { useState } from "react";
import OpenAI from "openai";
import "./App.css";
import FileInput from "./FileInput";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

import { auth } from "./firebase.config"; // Adjust the path as necessary
import { signOut } from "firebase/auth";

GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const Main = () => {
  const [response, setResponse] = useState(null);
  const [text, setText] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");

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
      await signOut(auth);
      alert("User signed out successfully");
      // Redirect to login page or handle the user sign-out UI update as needed
    } catch (error) {
      alert("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sign-out button container */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Main content container */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-8">
            Resume Assistant
          </h1>
          <textarea
            className="w-full max-w-3xl p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Paste the job description here..."
            rows="6"
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <FileInput onFileSelect={handleFileSelect} />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate Resume
          </button>

          {response && (
            <div className="mt-8 p-4 bg-white shadow rounded-lg w-full max-w-3xl">
              <h2 className="text-2xl font-semibold mb-2">Formatted Resume:</h2>
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Main;
