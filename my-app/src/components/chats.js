import React, { Component, useState, useEffect } from 'react'
import Chat from './chat'
import { auth } from '../comm/firebaseCredentials'

class Chats extends Component {

    constructor(props){
        super(props);
        this.state = {
            request_uids: [],
            request_usernames: [],
            chats_uids: [],
            chats_usernames: [],
            selected_messager: null,
        };
        this.selectedMessager = null;
    }

    componentDidMount() {
        // Get requests and chats from db
        var messages_promise = this.props.dbManager.getAllMessages();
        messages_promise.then(messages => {
            var requestIDs = messages[0];
            var chatIDs = messages[1];

            var r_usernames = messages[2];
            var c_usernames = messages[3];

            console.log(chatIDs[0])
            console.log(c_usernames[0])
            
            this.setState({ request_uids: requestIDs, chats_uids: chatIDs, request_usernames: r_usernames, chats_usernames: c_usernames });
        });
    }

    render() {
        //console.log(this.state.chats_usernames)
        //console.log(this.state.chats_uids)
        return (
            <div className='chats-container'>
                <div className='chat-menu-container'>
                    <div className='chat-request-tabs'>
                        <p className='chat-type-header'>Requests</p>
                        {this.state.request_uids.map((u,i)=> (
                            <button className='chat-menu-tab' key={u} value={u} onClick={() => this.setState({ selectedMessager: u })}>{this.state.request_usernames[i]}</button>
                        ))}
                    </div>
                    <hr />
                    <div className='chat-menu-tabs'>
                        <p className='chat-type-header'>Chats</p>
                        {this.state.chats_uids.map((u,i) => (
                            <button className='chat-menu-tab' key={u} value={u} onClick={() => this.setState({ selectedMessager: u })}>{this.state.chats_usernames[i]}</button>
                        ))}
                    </div>

                </div>
                <div className='chat-container'>
                    { this.state.selectedMessager ? 
                        <Chat dbManager={this.props.dbManager} uid1={auth.currentUser.uid} uid2={this.state.selectedMessager} />
                        : 
                        <p className='no-results'>Select a message</p>
                    }
        
                </div>
            </div>
        );
    }
}

export default Chats;