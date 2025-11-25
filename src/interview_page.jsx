import React, { useRef, useState } from "react";
import Video from './components/video';
import "./interview_page.css";
import { NavLink } from "react-router-dom";
import Backtbtn from "./back";
import axios from "axios";

const Interview = () => {

    const ws = useRef(null);
    const recognition = useRef(null);
    const [isReady, setIsReady] = useState(true);
    const [responseType, setResponseType] = useState(1); // 1 = expecting question, 0 = expecting answer

    
    let session_id = localStorage.getItem("jobReadyPro-interviewSessionID");
    if (!session_id) {
        session_id = crypto.randomUUID();
        localStorage.setItem("jobReadyPro-interviewSessionID", session_id);
    }

    const textToSpeech = (text) => {
        return new Promise((resolve, reject) => {
            const speech = new SpeechSynthesisUtterance(text);
            speech.onend = resolve;
            speech.onerror = reject;
            window.speechSynthesis.speak(speech);
        });
    };

    const startListening = async () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = "en-US";
        recognition.current.start();

        recognition.current.onresult = async (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            console.log("Recognized:", transcript);

            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(transcript);
            } else {
                console.warn("WebSocket is not open. Could not send answer.");
            }
        };
    };

    // ---------------------------
    // Start Interview
    // ---------------------------
    const handleStartInterview = async () => {
        setIsReady(false);

        // Open WebSocket with session_id
        ws.current = new WebSocket(`ws://3.110.117.237/interview?session_id=${session_id}`);
        console.log("Connected to WebSocket with session:", session_id);

        ws.current.onopen = () => console.log("Interview WebSocket connected");

        ws.current.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            const text = message.text;

            console.log("WS Message:", message);

            if (message.type === "question") {
                await textToSpeech(text);
                setResponseType(0); // expecting answer
                startListening();
            }

            if (message.type === "feedback") {
                await textToSpeech(text);
                setResponseType(1); // expecting next question
            }
        };
    };

    // ---------------------------
    // End session
    // ---------------------------
    async function endSession() {
        setIsReady(true);
        window.speechSynthesis.cancel();

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.close();
            console.log("WebSocket closed.");
        }

        const email = localStorage.getItem("jobreadyproEmail");
        localStorage.removeItem("jobReadyPro-interviewSessionID");

        try {
            const form = new FormData();
            form.append("email", email);
            form.append("session_id", session_id);

            const req = await axios.post("http://3.110.117.237/summary", form);

            console.log("Summary Response:", req.data);
            localStorage.removeItem("jobReadyPro-interviewSessionID");
            

        } catch (err) {
            console.log("Summary Error:", err);
        }
    }

    return (
        <div className="body">
            <div className="headers_interview_page">
                <NavLink to="/interviewForm"><Backtbtn /></NavLink>
            </div>

            <div className="interviewInstruction">
                <p>1. Press Ready to start the interview and End Session to stop.</p>
                <p>2. Response depends on internet speed.</p>
            </div>

            <h1>Real Time Interview with Face Analysis</h1>

            <div className="video">
                <Video />
            </div>

            <div className="buttons">
                {isReady && <button onClick={handleStartInterview}>Ready</button>}
                <NavLink to="/interviewForm">
                    <button onClick={endSession}>End Session</button>
                </NavLink>
            </div>
        </div>
    );
};

export default Interview;
