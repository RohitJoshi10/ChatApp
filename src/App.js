import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';

// Firebase hooks. This hook will get the user variable from Google
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Initializing the App
firebase.initializeApp({
  apiKey: "AIzaSyAJCZ6tc6exkqZSIT5nnv6AkO-W6EsA-w8",
  authDomain: "baatein-kare.firebaseapp.com",
  projectId: "baatein-kare",
  databaseURL: "https:/baatein-kare.firebaseio.com",
  storageBucket: "baatein-kare.appspot.com",
  messagingSenderId: "53022331216",
  appId: "1:53022331216:web:c1efb64d624802255ddc55",
  measurementId: "G-QK95PQMPNN"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  // This is mainly for the design part of our app
  return (
    <div className="App">
      <header>
        <h1>Sawagt hai apka😎💜💜 Kirpiya SignIn kre aur Baatein Kre</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign In with Google</button>
      <p>Aaiye milkar Baatein Kare🗣️📤📩😊</p>
    </>
  );
}

function SignOut() {
  // If the current user is signed in, show the Sign Out button
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}> Sign Out</button>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');

  // Order by whoever sent the message first should come first
  const query = messagesRef.orderBy('createdAt').limit(10000);

  // Query for displaying messages
  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Likh bhi le bhai kuch🥱"></input>
        <button className="sent-btn" type="submit" disabled={!formValue}>Daba Isko😂</button>
      </form>

      <div ref={dummy}></div>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  if (!photoURL) {
    console.error("No photoURL provided:", props.message);
    return null;
  }

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="User" onError={() => console.error("Image failed to load:", photoURL)} />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
 
