import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import { FaClipboardList, FaBolt } from "react-icons/fa";

function NavBar() {
  const [login, setlogin] = useState(localStorage.getItem("login"));
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("login");
    setlogin(null);
    setTimeout(() => {
      navigate("/login");
    }, 0);
  };

  useEffect(() => {
    const handleStorage = () => {
      setlogin(localStorage.getItem("login"));
    };
    window.addEventListener("localStorage-change", handleStorage);

    return () => {
      window.removeEventListener("localStorage-change", handleStorage);
    };
  }, []);
  return (
    <nav className="navbar">
      <div className="logo">
        <FaClipboardList size={28} color="#00bcd4" />
        <FaBolt size={18} color="#1de9b6" style={{ marginLeft: "-8px" }} />
        <span>Smart Task</span>
      </div>
      <ul className="nav-link">
        {login ? (
          <>
            <li>
              <Link to="/">List</Link>
            </li>
            <li>
              <Link to="/add">Add Task</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link onClick={logout}>Logout</Link>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}

export default NavBar;
