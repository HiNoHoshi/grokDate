import React, {useState, useRef, Component} from 'react'
import PCard from './profileCard'
import ArrowButton from "./arrow_button"
import { auth } from '../comm/firebaseCredentials'

function Chat(props){

    return (
        <div className="Chat">
            <PrivateChat dbManager={props.dbManager} uid1={props.uid1} uid2={props.uid2}/>
        </div>
      );

}

function PrivateChat(props) {

    const uid1 = props.uid1;
    const uid2 = props.uid2;

    const [messagesRef, messages] = props.dbManager.getMessagesBetween2Users(uid1, uid2);

    const sendMessage = async (event) => {
        event.preventDefault();

        if(messagesRef){
          await messagesRef.add({
            text: formValue,
            createdAt: props.dbManager.getTimestamp(),
            uid: uid1,
          })
        }

        setFormValue('');
    }

    const [formValue, setFormValue] = useState('');

    return (
    <>
        <main>

            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        </main>

        <form onSubmit={sendMessage}>

            <input value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="// type your message" />

            <button className = 'send-chat-button' type="submit" disabled={!formValue}>Send</button>

        </form>
    </>
    );
}

function ChatMessage(props) {
    const { text, uid } = props.message;

  // Here we set it up so we can apply different styling based on whether the message is sent or received
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  </>)
}

export default Chat;