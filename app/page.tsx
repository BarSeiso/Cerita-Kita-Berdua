"use client"

import "../public/styles.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/script.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Cerita Kita Berdua 💕</h1>
        <p className="subtitle">Our Daily Stories Together</p>
      </header>

      <div className="author-selector">
        <button id="barBtn" className="author-btn active" data-author="bar">Bar's Stories 🌸</button>
        <button id="araBtn" className="author-btn" data-author="ara">Ara's Stories 🌺</button>
      </div>

      <div className="add-entry-section">
        <h3>Write a New Story</h3>
        <form id="entryForm">
          <select id="authorSelect" required>
            <option value="">Choose Author</option>
            <option value="bar">Bar</option>
            <option value="ara">Ara</option>
          </select>
          <input type="text" id="titleInput" placeholder="Story title..." required />
          <textarea id="contentInput" placeholder="Share your story..." required></textarea>
          <button type="submit">Share Story 💕</button>
        </form>
      </div>

      <div className="entries-container">
        <div id="barEntries" className="entries-section">
          <h2>Bar's Stories 🌸</h2>
          <div className="entries-list" id="barEntriesList"></div>
        </div>
        <div id="araEntries" className="entries-section" style={{ display: "none" }}>
          <h2>Ara's Stories 🌺</h2>
          <div className="entries-list" id="araEntriesList"></div>
        </div>
      </div>
    </div>
  );
}
