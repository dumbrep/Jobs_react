import React, { useRef, useState , useEffect } from "react";
import { NavLink } from "react-router-dom";
import Backtbtn from "./back";
import axios from "axios";
import "./jobPage.css"

function Jobs() {
    const [jobs,setJobs] = useState([]);
    const [isJobs,setIsJobs] = useState("");
    const [note, setNote] = useState(true);

    // Load or create session ID for job search
    let session_id = localStorage.getItem("jobReadyPro-jobSessionID");
    if (!session_id) {
        session_id = crypto.randomUUID();
        localStorage.setItem("jobReadyPro-jobSessionID", session_id);
    }

    async function sendResume(event) {
        const file = event.target.files[0];
        const formdata = new FormData();

        formdata.append("resume", file);
        formdata.append("session_id", session_id);   // IMPORTANT

        const response = await axios.post(
            "/api-fast/jobSearch",
            formdata,
            { headers : { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.jobs && response.data.jobs.length > 0) {
            setJobs(response.data.jobs);
            setIsJobs("");
            setNote(false)
        } else {
            setJobs([]);
            setIsJobs("Sorry, No jobs available right now. Please try again later.");
        }
    }

    return (
        <div className="jobs">
            <div className="back">
                <NavLink to="/"><Backtbtn /></NavLink>
            </div>

            <div className="jobs_title">
                <h1>FIND JOBS USING AI</h1>
            </div>

            <div className="resume">
                <label>Upload Resume (PDF):</label>
                <input type="file" accept="application/pdf" onChange={sendResume}/>
            </div>

            <div className="warning">{isJobs}</div>

            <div className="cards">
                {jobs.map((job, index) => (
                    <div key={index} className="card">
                        <div className="card_title">
                            <img src={job.employer_logo} alt="logo" />
                            <span><a href={job.employer_website} target="_blank">{job.employer_name}</a></span>
                        </div>
                        <p>Role : {job.job_title}</p>
                        <p>Location : {job.job_location}</p>
                        <div className="apply">
                            <a href={job.job_apply_link} target="_blank">
                                <button className="jobsApplyButton">Apply</button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="jobInstrction">
                {note && <p>Note : This may take a few minutes after the resume is uploaded.</p> }
            </div>
        </div>
    );
}

export default Jobs;
