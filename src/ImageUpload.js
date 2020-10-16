import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import { db, storage } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setcaption] = useState("");
  const [image, setimage] = useState("");
  const [progress, setprogress] = useState("");

  const handlechange = (e) => {
    if (e.target.files[0]) setimage(e.target.files[0]);
  };

  const handleupload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setprogress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageurl: url,
              username: username,
            });

            setprogress(0);
            setcaption("");
            setimage(null);
          });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="image__progress" value={progress} max="100" />
      <Input
        type="text"
        placeholder="enter a caption..."
        value={caption}
        onChange={(event) => setcaption(event.target.value)}
      />

      <Input type="file" onChange={handlechange} />

      <Button onClick={handleupload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
