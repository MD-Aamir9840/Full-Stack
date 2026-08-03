import React, { useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Twitter");
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const limit =
    platform === "Twitter"
      ? 280
      : platform === "Instagram"
      ? 2200
      : 700;

  const publishBlog = () => {
    if (
      title.trim() === "" ||
      author.trim() === "" ||
      content.trim() === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (content.length > limit) {
      alert("Character limit exceeded.");
      return;
    }

    const blog = {
      id: editId ? editId : Date.now(),
      title,
      author,
      platform,
      content,
    };

    if (editId) {
      setBlogs(
        blogs.map((item) => (item.id === editId ? blog : item))
      );
      setMessage("✅ Blog Updated Successfully!");
    } else {
      setBlogs([blog, ...blogs]);
      setMessage("✅ Blog Published Successfully!");
    }

    setTitle("");
    setAuthor("");
    setContent("");
    setPlatform("Twitter");
    setEditId(null);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const editBlog = (blog) => {
    setTitle(blog.title);
    setAuthor(blog.author);
    setPlatform(blog.platform);
    setContent(blog.content);
    setEditId(blog.id);
  };

  const deleteBlog = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <div className="container">
      <div className="card">
        <h1>📝 Blog Post Composer</h1>

        <label>Platform</label>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option>Twitter</option>
          <option>Instagram</option>
          <option>LinkedIn</option>
        </select>

        <label>Blog Title</label>

        <input
          type="text"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Author</label>

        <input
          type="text"
          placeholder="Enter author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <label>Content</label>

        <textarea
          placeholder="Write your blog..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="counter">
          <span>Characters</span>

          <span
            className={
              content.length > limit
                ? "danger"
                : content.length > limit * 0.8
                ? "warning"
                : "success"
            }
          >
            {content.length}/{limit}
          </span>
        </div>

        {content.length > limit && (
          <p className="error">Character limit exceeded!</p>
        )}

        <div className="preview">
          <h2>Live Preview</h2>

          <div className="preview-box">
            <h3>{title || "Blog Title"}</h3>

            <p>
              <strong>Author:</strong> {author || "Author"}
            </p>

            <p>
              <strong>Platform:</strong> {platform}
            </p>

            <hr />

            <p>{content || "Your blog preview appears here..."}</p>
          </div>
        </div>

        {message && (
          <p className="success-message">{message}</p>
        )}

        <button
          onClick={publishBlog}
          disabled={content.length > limit}
        >
          {editId ? "Update Blog" : "Publish Blog"}
        </button>
                <div className="published-section">
          <h2>Published Blogs</h2>

          {blogs.length === 0 ? (
            <p>No blogs published yet.</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="preview-box">
                <h3>{blog.title}</h3>

                <p>
                  <strong>Author:</strong> {blog.author}
                </p>

                <p>
                  <strong>Platform:</strong> {blog.platform}
                </p>

                <p>{blog.content}</p>

                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => editBlog(blog)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteBlog(blog.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default App;