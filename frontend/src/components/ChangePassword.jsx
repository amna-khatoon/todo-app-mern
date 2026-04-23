import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/editprofile.css";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    let res = await fetch("http://localhost:3200/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 cookies send karne ke liye
      body: JSON.stringify({
        email: user.email,
        oldPassword,
        newPassword,
      }),
    });

    res = await res.json();

    if (res.success) {
      alert("Password Updated!");
      navigate("/profile");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="container">
      <h1>Change Password</h1>
      <input
        type="password"
        placeholder="Enter current password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        className="input1"
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button className="btn" onClick={handlePasswordChange}>
        Update Password
      </button>
    </div>
  );
}

export default ChangePassword;
