import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth, storage } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [opensignin, setopensignin] = useState(false);
  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [user, setuser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setuser(authUser);
      } else {
        setuser(null);
      }

      return () => {
        unsubscribe();
      };
    });
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setposts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const SignIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setopensignin(false);
  };

  const SignUP = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setopen(false);
  };

  return (
    <div className="app">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__logincontainer">
            <Button onClick={() => setopensignin(true)}>Sign In</Button>
            <Button onClick={() => setopen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setopen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="username..."
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />

            <Input
              placeholder="email..."
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />

            <Input
              placeholder="password..."
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />

            <Button onClick={SignUP}>Sign UP</Button>
          </form>
        </div>
      </Modal>

      <Modal open={opensignin} onClose={() => setopensignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email..."
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />

            <Input
              placeholder="password..."
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />

            <Button onClick={SignIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__post">
        <div className="post__left">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postid={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageurl={post.imageurl}
            />
          ))}
        </div>

        <div className="post__right">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3> Sorry !!! You need to login </h3>
      )}
    </div>
  );
}

export default App;
