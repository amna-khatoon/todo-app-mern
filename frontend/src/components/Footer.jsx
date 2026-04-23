import React from "react";
import "../style/footer.css";
import { MdOutlineEmail } from "react-icons/md";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Smart Task Management System</h3>
        <p>
          Developed by <strong>Amna Khatoon</strong> | B.Tech (CSE), 5th
          Semester | AKTU
        </p>
        <div className="footer-links">
          <a href="mailto:amnakhatoon793@gmail.com">
            <MdOutlineEmail /> Email
          </a>
          <a
            href="https://www.linkedin.com/in/amna-khatoon-a25743284"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn /> LinkedIn
          </a>
          <a
            href="https://github.com/amna-khatoon"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub /> GitHub
          </a>
        </div>

        <p className="made-in">
          Made with <span className="heart">❤</span> in India
        </p>
        <p className="copyright">Copyright © 2025 All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
