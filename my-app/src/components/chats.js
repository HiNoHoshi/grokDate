import React, {useState, useRef, Component} from 'react'
import PCard from './profileCard'
import ArrowButton from "./arrow_button"
import GenIcebreaker from "./genIcebreakers"
import { auth } from '../comm/firebaseCredentials'

function Chats(props){

    return (
        <div className="Chats">
            <PrivateChat dbManager={props.dbManager}/>
        </div>
      );

}

function PrivateChat(props) {

    const uid1 = auth.currentUser.uid;
    const uid2 = "67t6Yt6Z8IUuBfJU1VORFNbFFoT2"; // TODO how to get other user's ID?

    const [messagesRef, messages] = props.dbManager.getMessages(uid1, uid2);

    const sendMessage = async (event) => {
        event.preventDefault();

        await messagesRef.add({
          text: formValue,
          createdAt: props.dbManager.getTimestamp(),
          uid: uid1,
        })

        setFormValue('');
    }

    const [formValue, setFormValue] = useState('');

    console.log(messages);

    return (
    <>
        <main>

            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        </main>

        <form onSubmit={sendMessage}>

            <input value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="[insert text here]" />

            <button type="submit" disabled={!formValue}>Send</button>

        </form>
    </>
    );
}

function ChatMessage(props) {
    const { text, uid} = props.message;

  // Here we set it up so we can apply different styling based on whether the message is sent or received
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  </>)
}

export default Chats;