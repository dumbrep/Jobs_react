import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import InterviewForm from "./interview_form";
import Interview from "./interview_page";
import Ats from "./atspage";
import Home from "./homepage";
import Jobs from "./jobPage";
import PrivateRoute from "./privateRoute";
import Login from "./login";
import Signup from "./signup";
import SummaryPage from "./SummaryPage";

function Route_page() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />

            <Route path="/interviewForm" element={<PrivateRoute redirectTo="/login"><InterviewForm /></PrivateRoute>} />
            <Route path="/atsChecking" element={<PrivateRoute redirectTo="/login"><Ats /></PrivateRoute>} />        
            <Route path="/jobs" element={<PrivateRoute redirectTo="/login"><Jobs /></PrivateRoute>} />
        
            <Route path="/login" element = {<Login />} />
            <Route path="/signup" element = {<Signup />} />
            <Route path="/summary" element = {<SummaryPage/>}/>

      </Routes>
    </Router>
  );
}

export default Route_page;
