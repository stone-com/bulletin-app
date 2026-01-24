import { useState, useEffect } from "react";
import "./Home.css";
import Post from "./Post";
import PostForm from "./PostForm";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Home component: main dashboard after login
const Home = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch posts from backend on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/posts`);
        const data = await res.json();
        // Always sort posts by createdAt descending (newest first)
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(data);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter posts by search input (title or content)
  const filteredPosts = posts.filter(
    (post) =>
      (post.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (post.content?.toLowerCase() || "").includes(search.toLowerCase()),
  );

  // Function to handle new post creation (passed as prop to post form component)
  const handleCreatePost = async (content, clearInput) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create post");
      }
      const newPost = await res.json();
      setPosts((prev) => [newPost, ...prev]); // Newest always at top
      if (clearInput) clearInput();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="home-container">
      {/* Top menu bar: search, username, logout */}
      <header className="top-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <span className="username">{user?.username}</span>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>
      {/* New Post Form below search bar, above posts */}
      <PostForm onCreate={handleCreatePost} />
      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="posts-list">
        {/* Render each post as a card */}
        {filteredPosts.map((post) => (
          <Post
            key={post._id}
            post={post}
            user={user}
            onAddComment={async (postId, text, clearInput) => {
              setError("");
              try {
                const res = await fetch(`${API_BASE}/api/comments/create`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({ postId, content: text }),
                });
                if (!res.ok) {
                  const data = await res.json();
                  throw new Error(data.message || "Failed to add comment");
                }
                // Update UI instantly
                setPosts((prev) =>
                  prev.map((p) =>
                    p._id === postId
                      ? {
                          ...p,
                          comments: [
                            ...(p.comments || []),
                            {
                              content: text,
                              author: { username: user.username },
                            },
                          ],
                        }
                      : p,
                  ),
                );
                if (clearInput) clearInput();
              } catch (err) {
                setError(err.message);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
