import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css"
import Backtbtn from "./back";
import { NavLink } from "react-router-dom";

function Signup() {
  const [userName, setName] = useState("");

  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await fetch("/api-node/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName, email: userEmail, password: userPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("SignUp successfull! Details are sent to your mail. Please Login to continue");

      const intendedRoute = localStorage.getItem('intendedRoute');

      if (intendedRoute) {
        localStorage.setItem('redirectAfterLogin', intendedRoute);
        localStorage.removeItem('intendedRoute');
      }

      navigate("/login");

    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <div className="back-btn">
        <NavLink to="/"><Backtbtn /></NavLink>

      </div>

      <div className="signup-body">
        <div className="login-heading">
                  Sign Up for success 🚀
        </div>
        <div className="signup-main">
          <div className="signup-inputs">
            <label htmlFor="">Name : </label>
            <input value={userName} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          </div>

          <div className="signup-inputs">
            <label htmlFor="">Email : </label>
            <input value={userEmail} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>

          <div className="signup-inputs">
            <label htmlFor="">password : </label>
            <input type="password" value={userPassword} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>

          <div className="signup-btn">
            <button onClick={handleSignup}>Sign UP</button>

          </div>
        </div>

      </div>

    </div>
  );
}
export default Signup;