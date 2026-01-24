import { useState } from "react";
import "./PostForm.css";

const PostForm = ({ onCreate }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Post content cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onCreate(content, () => setContent(""));
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        className="post-form-textarea"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        rows={3}
        disabled={loading}
      />
      <div className="post-form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
        <span className="post-form-error">{error}</span>
      </div>
    </form>
  );
};

export default PostForm;
