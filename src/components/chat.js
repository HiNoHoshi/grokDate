import React, {useState, useRef, Component} from 'react'
import { auth } from '../comm/firebaseCredentials'
import Post from "./post"

function Chat(props){

    return (
        <div className="chat">
            <PrivateChat dbManager={props.dbManager} uid1={props.uid1} uid2={props.uid2} u2Username = {props.u2Username} u2Pic = {props.u2Pic}/>
        </div>
      );

}

function PrivateChat(props) {

    const dummy = useRef(); // for scrolling to bottom

    const uid1 = props.uid1;
    const uid2 = props.uid2;

    var user1 = props.dbManager.getUserInfo(uid1)
    var user2 = props.dbManager.getUserInfo(uid2)

    const [messagesRef1, collectionRef1, messages1] = props.dbManager.getMessagesBetween2Users(uid1, uid2);
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
        var username1 = null;
        await user1.then( (user) => { 
          if(user){
            username1 = user.username; 
          }
        })
        
        var username2 = null;
        console.log(user2)
        console.log(uid2)
        await user2.then( (user) => { 
          if(user){ 
            username2 = user.username; 
          }
        })

        // Add other person's username to document
        if(username2){
          await messagesRef1.set({
            username: username2
          }, { merge: true });
        }
        if(username1){
          await messagesRef2.set({
            username: username1,
          }, {merge: true});
        }

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' }); //for scrolling to bottom
    }

    const [formValue, setFormValue] = useState('');
    return (
    <>
        <h2 className='chat-header'>
          <img className= 'profile-pic' src={props.u2Pic}/>
          <a className='profile-username'>{props.u2Username}</a>
          </h2>

        <main>
          {messages1 && messages1.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
          <span ref={dummy}/>
        </main>

        { uid2.length === 0 ? <p className='no-results'>Select a message to view</p> :
        <form className= 'chat-input' onSubmit={sendMessage}>

            <input value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="Type something here … " />

            <button className = 'send-chat-button' type="submit" disabled={!formValue}>Send</button>

        </form>}
    </>
    );
}

function ChatMessage(props) {
  const { text, uid, is_icebreaker, icebreaker } = props.message;

  // Here we set it up so we can apply different styling based on whether the message is sent or received
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
    {is_icebreaker ? <Post data={icebreaker} /> : null}
  </>)
}

export default Chat;