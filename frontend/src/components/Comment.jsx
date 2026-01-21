import "./Comment.css";
// Comment component: displays a single comment

const Comment = ({ comment, timeAgo }) => {
  return (
    <li className="comment-item">
      <span>
        {comment.author?.username ? <b>{comment.author.username}: </b> : null}
        {comment.text || comment.content}
      </span>
      <span className="comment-time">{timeAgo}</span>
    </li>
  );
};

export default Comment;
