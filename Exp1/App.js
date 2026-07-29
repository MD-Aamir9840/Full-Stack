import React, { useState } from "react";
import "./App.css";

function App() {
  const [post, setPost] = useState("");
  const [platform, setPlatform] = useState("Twitter");
  const [message, setMessage] = useState("");

  const limit =
    platform === "Twitter"
      ? 280
      : platform === "Instagram"
      ? 2200
      : 700;

  const publishPost = () => {
    setMessage("✅ Post Published Successfully!");

    setPost("");
    setPlatform("Twitter");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>📝 Post Composer</h1>

        <label>Select Platform</label>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="Twitter">Twitter</option>
          <option value="Instagram">Instagram</option>
          <option value="LinkedIn">LinkedIn</option>
        </select>

        <textarea
          placeholder="What's on your mind?"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />

        <div className="counter">
          <span>Characters</span>

          <span
            className={
              post.length > limit
                ? "danger"
                : post.length > limit * 0.8
                ? "warning"
                : "success"
            }
          >
            {post.length}/{limit}
          </span>
        </div>

        {post.length > limit && (
          <p className="error">⚠ Character limit exceeded!</p>
        )}

        <div className="preview">
          <h2>📱 Preview</h2>

          <p>
            <strong>Platform:</strong> {platform}
          </p>

          <div className="preview-box">
            {post || "Your post preview will appear here..."}
          </div>
        </div>

        {message && <p className="success-message">{message}</p>}

        <button
          disabled={post.length > limit || post.length === 0}
          onClick={publishPost}
        >
          🚀 Publish Post
        </button>
      </div>
    </div>
  );
}

export default App;