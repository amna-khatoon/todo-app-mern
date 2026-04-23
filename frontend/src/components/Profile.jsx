import React from "react";
import "../style/profile.css";
import avatarImg from "../assets/avatar.png";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          <img
            src={user?.avatar || avatarImg} // user.avatar hai toh wahi, otherwise default
            alt="Profile Avatar"
            className="avatar-img"
          />
        </div>

        <h2>{user?.name}</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Joined:</strong> {user?.joined}
        </p>

        <div className="profile-actions">
          <button
            className="btn-edit"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
          <button
            className="btn-password"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
