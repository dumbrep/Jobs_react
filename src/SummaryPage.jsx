import axios from "axios";
import { useEffect, useState } from "react";
import SummaryCard from "./components/SummaryCard.jsx";
import { NavLink } from "react-router-dom";
import "./SummaryPage.css";
import Backtbtn from "./back";

const SummaryPage = () => {
    const [summary, setSummary] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
        const storedName = localStorage.getItem("jobreadyproUsername");
        setName(storedName);
    }, [summary]);

    useEffect(() => {
        const fetchData = async () => {
            const email = localStorage.getItem("jobreadyproEmail");
            const response = await axios.post("https://jobs-nodejs.onrender.com/getSummaries", { email: email });
            setSummary(response.data);
        }
        fetchData();
    }, []);

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1 className="greeting">Hi {name} !</h1>
                <NavLink to="/interviewForm"><Backtbtn /></NavLink>
            </header>

            <div className="summary-list">
                {summary.length > 0 ? (
                    summary.map((data, index) => (
                        <SummaryCard {...data} key={index} />
                    ))
                ) : (
                    <div className="no-summary">No summaries found.</div>
                )}
            </div>
            <div className="no-summary">Recent summaries may take some time to generate</div>
        </div>
    );
};

export default SummaryPage;
