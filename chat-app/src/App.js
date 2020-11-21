// Based on tutorial at https://fireship.io/lessons/react-firebase-chat-app-tutorial/

import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    // This data is copied from adding a web app to Firebase, in the project settings
    apiKey: "AIzaSyD-cNAtjiQgnStGM3HEQv4Rlgq3kMhWXi4",
    authDomain: "grokdate-fdf76.firebaseapp.com",
    databaseURL: "https://grokdate-fdf76.firebaseio.com",
    projectId: "grokdate-fdf76",
    storageBucket: "grokdate-fdf76.appspot.com",
    messagingSenderId: "452875068925",
    appId: "1:452875068925:web:8188d275aa3f8c51b26594"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <GroupChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

//TODO we don't just want to sign in with Google, we want to have our own signup.
function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


// Tips from here: https://edisondevadoss.medium.com/react-native-chat-using-firebase-d4c0ef1ab0b5 
function PrivateChat() {

    const { uid, photoURL } = auth.currentUser;
    
    // Merge two user IDs and create a new chat ID
    const chatID = () => {
        const uid1 = uid; 
        const uid2 = uid; // TODO how to get other user's ID?
        const chatIDpre = [];
        chatIDpre.push(uid1);
        chatIDpre.push(uid2);
        chatIDpre.sort();
        return chatIDpre.join('_');
    };
    
    const dummy = useRef(); // for scrolling to bottom
    
    // Get messages
    const messagesRef = firestore.collection('messages').doc(chatID.call()).collection('chat');
    const query = messagesRef.orderBy('createdAt');
    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');
    
    // Send messages
    const sendMessage = async (e) => {
        e.preventDefault();

        await messagesRef.add({
          text: formValue,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          photoURL
        })

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' }); //for scrolling to bottom
    }
  

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      {/*Adding this empty dummy makes it so it scrolls to the bottom when there are new messages -->*/}
      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}

function GroupChatRoom() {

  const dummy = useRef(); // for scrolling to bottom
  const messagesRef = firestore.collection('messages').doc('group').collection('chat');
  const query = messagesRef.orderBy('createdAt').limit(25);

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
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' }); //for scrolling to bottom
  }
  

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      {/*Adding this empty dummy makes it so it scrolls to the bottom when there are new messages -->*/}
      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}



function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  // Here we set it up so we can apply different styling based on whether the message is sent or received
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;

/* Note: Also edited the "Rules" in Firebase like so:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if
          request.time < timestamp.date(2020, 12, 19);
    }
    
    match /messages/{docId}{
    	allow read: if request.auth.uid != null;
      allow create: if canCreateMessage();
    }
    
    function canCreateMessage(){
    	let isSignedIn = request.auth.uid != null;
      let isOwner = request.auth.uid == request.resource.data.uid;
      
      return isSignedIn && isOwner;
    }
  }
}
*/