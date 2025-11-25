import React, { useState } from "react";
import "./atspage.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { NavLink } from "react-router-dom";
import Backtbtn from "./back";

function Ats() {
    const [resume, setResume] = useState(null);
    const [description, setDescription] = useState("");
    const [result, setResult] = useState("Analyse your resume with Google Gemini 2.0 Flash...");

    function handelResume(e) {
        setResume(e.target.files[0]);
    }

    function handleDescription(e) {
        setDescription(e.target.value);
    }

    async function sendData(prompt) {
        if (!resume) {
            setResult("⚠️ Please upload resume");
            return;
        }
        if (!description) {
            setResult("⚠️ Please provide job description");
            return;
        }

        setResult("⏳ Generating response...");

        let session_id = localStorage.getItem("jobReadyPro-atsCheckingID");
        if (!session_id) {
            session_id = crypto.randomUUID();
            localStorage.setItem("jobReadyPro-atsCheckingID", session_id);
        }

        // 1️⃣ Upload resume
        const formdata = new FormData();
        formdata.append("ATSdescription", description);
        formdata.append("prompt_number", prompt);
        formdata.append("file", resume);
        formdata.append("session_id", session_id);

        await axios.post("http://3.110.117.237/get_resume_file", formdata);

        // 2️⃣ Request ATS response
        const formdata_new = new FormData();
        formdata_new.append("session_id", session_id);

        const response = await axios.post(
            "http://3.110.117.237/ats_response",
            formdata_new
        );

        let output = response.data;

        if (typeof output === "object" && output.result) {
            output = output.result;
        }

        // Remove unwanted characters and fix formatting
        output = output
            .replace(/^["{]+/, "")
            .replace(/[}"]+$/, "")
            .replace(/\\n/g, "\n")
            .trim();

        setResult(output);
    }

    return (
        <div className="ats">
            <div className="headers_ats_page">
                <NavLink
                    to="/"
                    onClick={() => localStorage.removeItem("jobReadyPro-atsCheckingID")}
                >
                    <Backtbtn />
                </NavLink>
            </div>

            <h1>ATS Checking with HR Thoughts</h1>

            <div className="resume">
                <label>Upload your resume</label>
                <input onChange={handelResume} type="file" />
            </div>

            <div className="descriptions">
                <textarea
                    onChange={handleDescription}
                    placeholder="Enter Job Descriptions..."
                />
            </div>

            <div className="buttons">
                <button onClick={() => sendData(1)}>HR Thoughts</button>
                <button onClick={() => sendData(2)}>ATS Checking</button>
            </div>

            <div className="results markdown-body">
                <div
                    className="result-html"
                    dangerouslySetInnerHTML={{ __html: result }}
                />
            </div>
        </div>
    );
}

export default Ats;
