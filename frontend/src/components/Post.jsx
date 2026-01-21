import { useState } from "react";
import "./Post.css";
import Comment from "./Comment";

// Helper to format time ago
function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (isNaN(diff)) return "";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Post component: displays a single post, its comments, and comment input
const Post = ({ post, user, onAddComment }) => {
  // State to show/hide comments
  const [showComments, setShowComments] = useState(false);
  // State to show/hide comment input
  const [showInput, setShowInput] = useState(false);
  // State for this post's comment input
  const [commentText, setCommentText] = useState("");

  // Handle submitting a new comment
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post._id, commentText, () => setCommentText(""));
    setShowInput(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <span
          className="comment-count"
          onClick={() => setShowComments((v) => !v)}
          style={{ cursor: "pointer" }}
          title="Show comments"
        >
          💬 {post.comments?.length || 0}
        </span>
        <span className="post-meta-top">
          <span className="post-author">
            {post.author?.username ? `by ${post.author.username}` : ""}
          </span>
          <span className="post-time">
            {post.createdAt ? timeAgo(post.createdAt) : ""}
          </span>
        </span>
      </div>
      <p>{post.content}</p>
      <button onClick={() => setShowInput((v) => !v)}>
        {showInput ? "Cancel" : "Add Comment"}
      </button>
      {showInput && (
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Comment</button>
        </form>
      )}
      {showComments && (
        <div className="comments-section">
          <ul>
            {(post.comments || []).map((c, i) => (
              <Comment key={c._id || i} comment={c} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Post;
