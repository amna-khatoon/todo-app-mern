import React, { useEffect, useState } from "react";
import "../style/addtask.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  });

  const handleLogin = async () => {
    console.log(userData);
    let result = await fetch("http://localhost:3200/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result.success) {
      document.cookie = "token=" + result.token;
      localStorage.setItem("login", userData.email);
      window.dispatchEvent(new Event("localStorage-change"));
      navigate("/");
    } else {
      alert("try after sometime");
    }
  };
  return (
    <div className="container">
      <h1>Login</h1>

      <label htmlFor="">Email</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, email: event.target.value })
        }
        type="text"
        name="email"
        placeholder="Enter user email"
      />

      <label htmlFor="">Password</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, password: event.target.value })
        }
        type="password"
        name="password"
        placeholder="Enter user password"
      />
      <button onClick={handleLogin} className="submit">
        Login
      </button>
      <Link className="link" to="/signup">
        Sign up
      </Link>
    </div>
  );
}

export default Login;
