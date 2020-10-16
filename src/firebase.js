import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCr-06_kTqD1m-sxu5LZeJh9OjYOxWsICg",
  authDomain: "instagram-clone-a6369.firebaseapp.com",
  databaseURL: "https://instagram-clone-a6369.firebaseio.com",
  projectId: "instagram-clone-a6369",
  storageBucket: "instagram-clone-a6369.appspot.com",
  messagingSenderId: "1015632294688",
  appId: "1:1015632294688:web:d8e90fc632f78aa398dd45",
  measurementId: "G-MM03549XNQ",
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
