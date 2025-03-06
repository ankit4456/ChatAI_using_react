import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { SocialIcon } from 'react-social-icons';

function App() {
  const [userInput, setUserInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const createStar = () => {
      const star = document.createElement("div");
      star.classList.add("falling-star");
      document.body.appendChild(star);

      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      star.style.top = `${Math.random() * window.innerHeight}px`;
      star.style.left = `${Math.random() * window.innerWidth}px`;

      setTimeout(() => {
        star.remove();
      }, 10000);
    };

    const starInterval = setInterval(createStar, 50);
    return () => clearInterval(starInterval);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  const generateAnswer = async () => {
    if (!userInput.trim()) {
      setError("Please enter a question");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC7zeNlxwI8oJYgeIf-KHxx4AIMNVixElA",
        { contents: [{ parts: [{ text: userInput }] }] }
      );
      const content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAnswer(content || "No answer found");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); 
      generateAnswer();
    }
  };

  const handleMouseOver = (event) => {
    event.target.classList.add("blink");
  };

  const handleMouseOut = (event) => {
    event.target.classList.remove("blink");
  };

  return (
    <div className="App">
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div className="container">
        <h1 className="title">Ask AI</h1>

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown} 
          placeholder="Enter your question..."
          rows="4"
          className="no-scroll"
        />

        <div className="button-group">
          <button
            className="generate-button"
            onClick={generateAnswer}
            disabled={loading}
          >
            {loading ? "Generating..." : "Get Answer"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {answer && <div className="answer">{answer}</div>}
      </div>

      {/* Fixed Contact Links at Bottom Right */}
      <div className="fixed-contact-links">
        <div className="contact-link">
          <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <SocialIcon url="https://www.linkedin.com/in/ankit-raj-957a08245/" target="_blank" rel="noopener noreferrer" fgColor="#fff" style={{ height: 30, width: 30 }} />
          </div>
        </div>
        <div className="contact-link">
          <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <SocialIcon url="https://www.instagram.com/whoankitguptaa/" target="_blank" rel="noopener noreferrer" fgColor="#fff" style={{ height: 30, width: 30 }} />
          </div>
        </div>
        <div className="contact-link">
          <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <SocialIcon url="mailto:akii4raj@gmail.com" target="_blank" rel="noopener noreferrer" fgColor="#fff" style={{ height: 30, width: 30 }} />
          </div>
        </div>
        {/* <div className="contact-link">
          <a href="/ANKIT_RESUME.pdf" target="_blank" rel="noopener noreferrer" className="text-link">
            Resume
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default App;
