import React, { useEffect, useState } from "react";
import "../style/addtask.css";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleSignup = async () => {
    let result = await fetch("http://localhost:3200/signup", {
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

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: userData.name,
          email: userData.email,
          joined: new Date().toLocaleDateString(),
        })
      );

      localStorage.setItem("login", true);

      navigate("/");
    } else {
      alert("Try again later");
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <label>Name</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, name: event.target.value })
        }
        type="text"
        placeholder="Enter user name"
      />

      <label>Email</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, email: event.target.value })
        }
        type="email"
        placeholder="Enter user email"
      />

      <label>Password</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, password: event.target.value })
        }
        type="password"
        placeholder="Enter user password"
      />

      <button onClick={handleSignup} className="submit">
        Sign Up
      </button>

      <Link className="link" to="/login">
        Login
      </Link>
    </div>
  );
}

export default SignUp;
