import React, { useState } from "react";
import "../style/editprofile.css";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(user.name || "");
  const navigate = useNavigate();

  const updateProfile = async () => {
    try {
      const res = await fetch("http://localhost:3200/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ important for cookies
        body: JSON.stringify({ email: user.email, name }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name,
          })
        );
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Server error. Try again!");
    }
  };

  return (
    <div className="container">
      <h1>Edit Profile</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button className="btn1" onClick={updateProfile}>
        Save Changes
      </button>
    </div>
  );
}

export default EditProfile;
