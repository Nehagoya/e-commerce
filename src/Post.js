import React, { useState, useEffect } from "react";
import "./Post.css";
import { db } from "./firebase";
import firebase from "firebase";
import { Avatar, Input, Button } from "@material-ui/core";

function Post(props) {
  const [comments, setcomments] = useState([]);
  const [comment, setcomment] = useState([]);

  const postcomment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(props.postid).collection("comments").add({
      comment: comment,
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setcomment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (props.postid) {
      const unsubscribe = db
        .collection("posts")
        .doc(props.postid)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setcomments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [props.postid]);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt="username" src="" />
        <h3>{props.username}</h3>
      </div>

      <img className="post__image" src={props.imageurl} alt="" />
      <h4 className="post__text">
        <strong>{props.username} : </strong> {props.caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <b>{comment.username}</b>
            {comment.comment}
          </p>
        ))}
      </div>

      {props.user && (
        <form className="post__comment">
          <Input
            className="post__input"
            type="text"
            placeholder="Enter a comment..."
            value={comment}
            onChange={(e) => setcomment(e.target.value)}
          />

          <Button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postcomment}>
            Post
          </Button>
        </form>
      )}
    </div>
  );
}

export default Post;
