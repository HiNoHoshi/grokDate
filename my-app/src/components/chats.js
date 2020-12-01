import React, { Component, useState, useEffect } from 'react'
import Chat from './chat'
import Request from './request'
import { auth } from '../comm/firebaseCredentials'

class Chats extends Component {

    constructor(props){
        super(props);
        this.state = {
            recieved_requests: [],
            accepted_chats: [],
            selected_uid: null,
            selected_type: null,
        };
        this._isMounted = false;
    }

    componentDidMount() {
        // Get requests and chats from db
        this._isMounted = true;
        this.props.dbManager.getAllContacts().then(contacts => {
            // var sent_requests = []
            var recieved_requests = []
            // var declined_requests = []
            var accepted_chats = []
            // var blocked_them = []
            // var blocked_me = []
            for (const contact of contacts) {
                if (!contacts.is_blocked) {
                    // Get incoming requests that I haven't responded to
                    if (!contact.is_requester && !(contact.is_req_accepted || contact.is_req_declined)) {
                        recieved_requests.push(contact);
                    } else if (contact.is_req_accepted) {
                        accepted_chats.push(contact);
                    }
                }
            }
            if (this._isMounted) {
                this.setState({ recieved_requests: recieved_requests, accepted_chats: accepted_chats });
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        //console.log(this.state.chats_usernames)
        //console.log(this.state.chats_uids)
        return (
            <div className='chats-container'>
                <div className='chat-menu-container'>
                    <div className='chat-request-tabs'>
                        <p className='chat-type-header'>Requests</p>
                        {this.state.recieved_requests.map((info,idx)=> (
                            <button className='chat-menu-tab' key={info.uid} value={info.uid} onClick={() => this.setState({ selected_uid: info.uid, selected_type: 'REQUEST' })}>{info.username}</button>
                        ))}
                    </div>
                    <hr />
                    <div className='chat-menu-tabs'>
                        <p className='chat-type-header'>Chats</p>
                        {this.state.accepted_chats.map((info,idx)=> (
                            <button className='chat-menu-tab' key={info.uid} value={info.uid} onClick={() => this.setState({ selected_uid: info.uid, selected_type: 'CHAT' })}>{info.username}</button>
                        ))}
                    </div>
                </div>
                    { (this.state.selected_uid && this.state.selected_type === 'CHAT') ? 
                        <div className='chat-container'>
                        <Chat dbManager={this.props.dbManager} uid1={auth.currentUser.uid} uid2={this.state.selected_uid} />
                        </div>

                        : (this.state.selected_uid && this.state.selected_type === 'REQUEST') ? 
                        <div className='request-container'>
                        <Request dbManager={this.props.dbManager} uid1={auth.currentUser.uid} uid2={this.state.selected_uid} />
                        </div>

                        : <div className='chat-container'><p className='no-results'>Select a message</p></div>
                    }
                
            </div>
        );
    }
}

export default Chats;