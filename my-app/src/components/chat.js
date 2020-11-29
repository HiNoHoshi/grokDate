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

    const [messagesRef1, collectionRef1, messages1]   = props.dbManager.getMessagesBetween2Users(uid1, uid2);
    const [messagesRef2, collectionRef2, messages2] = props.dbManager.getMessagesBetween2Users(uid2, uid1);

    const sendMessage = async (event) => {
        event.preventDefault();
        var timestamp = props.dbManager.getTimestamp()

        // Add message document to collection
        if(collectionRef1 && collectionRef2){
          await collectionRef1.add({
            text: formValue,
            createdAt: timestamp,
            uid: uid1,
          });

          await collectionRef2.add({
            text: formValue,
            createdAt: timestamp,
            uid: uid1,
          });
        }

        // Get usernames
        var user1 = props.dbManager.getUserInfo(uid1)
        var username1 = null;
        await user1.then( user => { username1 = user.username; })

        var user2 = props.dbManager.getUserInfo(uid2)
        var username2 = null;
        await user2.then( user => { username2 = user.username; })

        // Add other person's username to document if it doesn't already exist 
        await messagesRef1.set({
          //senderUID: uid1,
          username: username2
        }, { merge: true });

        await messagesRef2.set({
          //senderUID: uid2,
          username: username1,
        }, {merge: true});

        setFormValue('');
    }

    const [formValue, setFormValue] = useState('');

    return (
    <>
        <main>

        {messages1 && messages1.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        </main>

        { uid2.length == 0 ? <p className='no-results'>Select a message to view</p> :
        <form onSubmit={sendMessage}>

            <input value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="// type your message" />

            <button className = 'send-chat-button' type="submit" disabled={!formValue}>Send</button>

        </form>}
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