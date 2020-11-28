import React, {Component, useState} from 'react'
import Chat from './chat'
import { auth } from '../comm/firebaseCredentials'


function Chats(props){

     const [requests, chats] = GetAllMessages(props);
     const [selectedMessager, setSelectedMessager] = useState([]);

     const requestButtons = [];
     for(let request of requests){
        var username = "temp";
        console.log(request);
        requestButtons.push(<button className= 'chat-menu-tab' value = {request} onClick = {ChangeSelectedMessager}>{username}</button>)
     }

     const chatButtons = [];
     for(let chat of chats){
        var username = "";
        var user = props.dbManager.getUsernameFromUID(chat);
        var un = user.then((username)=>{
            console.log(username);
        });
        console.log(un)

        chatButtons.push(<button className= 'chat-menu-tab' value = {chat} onClick = {ChangeSelectedMessager}>{chat}</button>)
     }

     function ChangeSelectedMessager(event){
        const selection = event.target.value;
        console.log(selection);
        setSelectedMessager(selectedMessager => selection);
    }

    return  (
        <div className='chats-container'>
            <div className='chat-menu-container'>
                <div className= 'chat-request-tabs'>
                    <p className='chat-type-header'>Requests</p>
                    {requestButtons}
                </div>
                <hr/>
                <div className= 'chat-menu-tabs'>
                    <p className='chat-type-header'>Chats</p>
                    {chatButtons}
                </div>

            </div>
            <div className='chat-container'>
                    <Chat dbManager={props.dbManager} uid1 = {auth.currentUser.uid} uid2 = {selectedMessager}/>
            </div>
            {/*< Menu changeSection = {this.changeSection} SignOut= {this.props.SignOut}/>
            {displayedSection}*/}
        </div>
    );
}

function GetAllMessages(props){
    const uid = auth.currentUser.uid;
    const [requests, chats] = props.dbManager.getAllMessages(uid);

    return [requests, chats];
}

export default Chats;