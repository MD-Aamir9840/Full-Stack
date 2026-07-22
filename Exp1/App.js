import React, { useState } from "react";

function App() {

  const [post, setPost] = useState("");
  const [platform, setPlatform] = useState("Twitter");


  const limit = platform === "Twitter" ? 280 :
                platform === "Instagram" ? 2200 : 700;


  return (
    <div>

      <h1>Post Composer</h1>


      <select onChange={(e) => setPlatform(e.target.value)}>

        <option>Twitter</option>
        <option>Instagram</option>
        <option>LinkedIn</option>

      </select>


      <br /><br />


      <textarea

        placeholder="Write your post"

        onChange={(e) => setPost(e.target.value)}

      />


      <p>
        Characters: {post.length}/{limit}
      </p>


      {
        post.length > limit &&
        <p style={{color:"red"}}>
          Character limit exceeded
        </p>
      }


      <h2>Preview</h2>

      <p>
        Platform: {platform}
      </p>

      <p>
        {post}
      </p>


      <button disabled={post.length > limit}>
        Post
      </button>


    </div>
  );
}


export default App;