import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./login.css"
import Backtbtn from "./back";


function Login() {
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://13.203.220.9/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("jobreadyproUsername", data.username);
      localStorage.setItem("jobreadyproEmail", userEmail);
      const redirectRoute = localStorage.getItem('redirectAfterLogin');

      if (redirectRoute) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(`/${redirectRoute}`);
      } else {
        navigate("/");
      }
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div>
      <NavLink className="back-btn" to="/"><Backtbtn /></NavLink>
      
      <div className="loginBody">
        <div className="login-heading">
          You need you login first to use AI features 🚀
        </div>
        <div className="login-main">
          <div className="loginInputs">
            <label htmlFor="">Email : </label>
            <input value={userEmail} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="loginInputs">
            <label htmlFor="">Password : </label>
            <input type="password" value={userPassword} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>

          <div className="login-btn">
            <button onClick={handleLogin}>Login  </button>

          </div>
          <p>Don't have an account ? <NavLink to="/signup"> sign up </NavLink>
          </p>
        </div>
      </div>
    </div>


  );
}
export default Login;