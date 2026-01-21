import "./Comment.css";
// Comment component: displays a single comment
const Comment = ({ comment }) => {
  return (
    <li>
      {comment.author?.username ? <b>{comment.author.username}: </b> : null}
      {comment.text || comment.content}
    </li>
  );
};

export default Comment;
