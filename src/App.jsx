import { useEffect, useState, useRef } from 'react';
import './App.css';
import * as pdfjsLib from "pdfjs-dist/webpack";
import Video from './components/video';
import pdfToText from 'react-pdftotext'

function App() {
  const [role, setRole] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [responseType, setResponseType] = useState(1); // 1: Expecting Question, 0: Expecting Response
  const [resumeText, setResumeText] = useState("");

  const ws = useRef(null);
  const recognition = useRef(null);
  const resumeRef = useRef(null);

  // Convert Text to Speech
  const textToSpeech = (text) => {
    return new Promise((resolve, reject) => {
      const speech = new SpeechSynthesisUtterance(text);
      speech.onend = resolve;
      speech.onerror = reject;
      window.speechSynthesis.speak(speech);
    });
  };

  //  Read and Extract Text from PDF
  async function readPDF() {
    const file = resumeRef.current?.files[0];
    if (!file) {
        console.log(" No file selected!");
        return;
    }
    console.log("📂 Selected file:", file.name);

    const reader = new FileReader();

    reader.onload = async function () {
        try {
            const pdfData = new Uint8Array(this.result);
            console.log(" PDF Data Loaded:", pdfData.length);

            const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
            console.log(` PDF has ${pdfDoc.numPages} pages`);

            let pdfText = "";
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                pdfText += pageText + '\n';
            }

            console.log(" Extracted Resume Text (First 500 chars):", pdfText.substring(0, 500));

        
            if (!pdfText.trim()) {
                console.error(" ERROR: No text extracted from PDF");
                return;
            }

            console.log(" Sending resume data...");
            const response = await fetch('https://jobreadypro-fatsapi.onrender.com/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resume_dt: pdfText,
                    job_description: jobDescription,
                    jobType: jobType
                })
            });

            console.log(" Sent request to FastAPI");

            

        } catch (error) {
            console.error(" Error processing PDF:", error);
        }
    };

    reader.onerror = () => {
        console.log(" Error while reading the PDF");
    };

    reader.readAsArrayBuffer(file);
}



function extractText(event) {
  const file = event.target.files[0]
  pdfToText(file)
      .then(text => setResumeText(text))
      .catch(error => console.error("Failed to extract text from pdf"))
} 
  
  //  Speech Recognition Setup
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;  
    recognition.current.interimResults = false;
    recognition.current.lang = "en-US";
    recognition.current.start();

    recognition.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("Recognized:", transcript);

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(transcript);
      } else {
        console.warn("WebSocket is not open. Could not send answer.");
      }
    };
  };

  //  Start Interview Function
  const handleStartInterview = async() => {
    const response = await fetch('https://jobreadypro-fatsapi.onrender.com/resume', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          resume_dt: resumeText,
          job_description: jobDescription,
          jobType: jobType
      })
  });
 
  if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
   
    ws.current = new WebSocket(`ws://127.0.0.1:8000/interview/${role}`);
    console.log("Connnecte to websocket 1")
  }  
  ws.current.onopen = () => console.log("Connected to interview WebSocket");
  ws.current.onmessage = async (event) => {
    const eventdata = event.data.trim();
    if (responseType === 1) {
      setQuestions((prev) => [...prev, eventdata]);
      await textToSpeech(eventdata);
      setResponseType(0);
      startListening();
    } else {
      setResponses((prev) => [...prev, eventdata]);
      await textToSpeech(eventdata);
      setResponseType(1);
    }
  };

    readPDF()
  };

  return (
    <div className="container">
      <h1>AI Interview System</h1>

      <label>Select Role:</label>
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="AIML">AIML</option>
        <option value="WebDevelopment">Web Development</option>
        <option value="DataScience">Data Science</option>
        <option value="CloudComputing">Cloud Computing</option>
        <option value="CyberSecurity">Cyber Security</option>
        <option value="Blockchain">Blockchain</option>
        <option value="DevOps">DevOps</option>
        <option value="UIUXDesign">UI/UX Design</option>
      </select>

      <label>Enter Job Description:</label>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter job description"
      />

      <label>Select Job Type:</label>
      <select onChange={(e) => setJobType(e.target.value)}>
        <option value="">Select Job Type</option>
        <option value="intern">Intern</option>
        <option value="full_time">Full Time</option>
      </select>

      <label>Upload Resume (PDF):</label>
      <input type="file" id="resume" ref={resumeRef} accept="application/pdf" onChange={extractText} />

      <button onClick={handleStartInterview}>Start Interview</button>

    <Video/>
    </div>
  );
}

export default App;
