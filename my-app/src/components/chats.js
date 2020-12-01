import React, { Component, useState, useEffect } from 'react'
import Chat from './chat'
import Request from './request'
import { auth } from '../comm/firebaseCredentials'
import arrow from '../images/icons/arrow_white_big.png';

class Chats extends Component {

    constructor(props){
        super(props);
        this.state = {
            recieved_requests: [],
            accepted_chats: [],
            pending_requests: [],
            selected_uid: null,
            selected_type: null,
            selected_username: null,
        };
        this._isMounted = false;
        this.handleAccept = this.handleAccept.bind(this);
        this.handleDecline = this.handleDecline.bind(this);
        // this.handleRecind = this.handleRecind.bind(this);
    }

    componentDidMount() {
        // Get requests and chats from db
        this._isMounted = true;
        this.props.dbManager.getAllContacts().then(contacts => {
            var pending_requests = []
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
                    } else if (contact.is_requester && !(contact.is_req_accepted || contact.is_req_declined)) {
                        pending_requests.push(contact)
                    }
                }
            }
            if (this._isMounted) {
                this.setState({ recieved_requests: recieved_requests, accepted_chats: accepted_chats, pending_requests: pending_requests });
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleAccept() {
        let uid1 = auth.currentUser.uid;
        let uid2 = this.state.selected_uid;
        this.props.dbManager.acceptRequest(uid1, uid2).then(() => {
            this.setState({selected_type: 'CHAT'});
        });
    }

    handleDecline() {
        let uid1 = auth.currentUser.uid;
        let uid2 = this.state.selected_uid;
        this.props.dbManager.declineRequest(uid1, uid2);
    }   

    // handleRecind() {

    // }

    render() {
        //console.log(this.state.chats_usernames)
        //console.log(this.state.chats_uids)
        return (
            <div className='chats-container'>
                <div className='chat-menu-container'>
                    <div className='chat-request-tabs'>
                        <p className='chat-type-header'>Requests</p>
                        {this.state.recieved_requests.map((info,idx)=> (
                            <button className={this.state.selected_uid === info.uid ? 'chat-menu-tab active' : 'chat-menu-tab'} key={info.uid} value={info.uid} onClick={() => this.setState({ selected_uid: info.uid, selected_username: info.username, selected_type: 'REQUEST' })} >
                            {this.state.selected_uid === info.uid && <img src={arrow} alt = "arrow" style={{paddingRight:'1em', 'height': '1em', 'width': 'auto'}}/>}{info.username} </button>
                        ))}
                    </div>
                    <hr />
                    <div className='chat-menu-tabs'>
                        <p className='chat-type-header'>Chats</p>
                        {this.state.accepted_chats.map((info,idx)=> (
                            <button className={this.state.selected_uid === info.uid ? 'chat-menu-tab active' : 'chat-menu-tab'} key={info.uid} value={info.uid} onClick={() => this.setState({ selected_uid: info.uid, selected_username: info.username, selected_type: 'CHAT' })}>
                            {this.state.selected_uid === info.uid && <img src={arrow} alt = "arrow" style={{paddingRight:'1em', 'height': '1em', 'width': 'auto'}}/>}{info.username} </button>
                        ))}
                    </div>
                    <hr />
                    <div className='chat-menu-tabs'>
                        <p className='chat-type-header'>Pending</p>
                        {this.state.pending_requests.map((info,idx)=> (
                            <button className={this.state.selected_uid === info.uid ? 'chat-menu-tab active' : 'chat-menu-tab'} key={info.uid} value={info.uid} onClick={() => this.setState({ selected_uid: info.uid, selected_username: info.username, selected_type: 'PENDING' })}>
                            {this.state.selected_uid === info.uid && <img src={arrow} alt = "arrow" style={{paddingRight:'1em', 'height': '1em', 'width': 'auto'}}/>}{info.username} </button>
                        ))}
                    </div>
                </div>
                    { (this.state.selected_uid && this.state.selected_type === 'CHAT') ? 
                        <div className='chat-container'>
                        <h2 className='chat-header'>Chat with <a className='profile-username'>{this.state.selected_username}</a></h2>
                        <Chat dbManager={this.props.dbManager} uid1={auth.currentUser.uid} uid2={this.state.selected_uid} />
                        </div>

                        : (this.state.selected_uid && this.state.selected_type === 'REQUEST') ? 
                        <div className='request-container'>
                        <h2 className='chat-header'>Request from <a className='profile-username'>{this.state.selected_username}</a></h2>
                        <Request dbManager={this.props.dbManager} uid1={auth.currentUser.uid} uid2={this.state.selected_uid} />
                        <button onClick={this.handleAccept}>Answer</button><button className='decline-button' onClick={this.handleDecline}>Decline</button>
                        </div>

                        : (this.state.selected_uid && this.state.selected_type === 'PENDING') ? 
                        <div className='request-container'>
                        <h2 className='chat-header'>Request to <a className='profile-username'>{this.state.selected_username}</a></h2>
                        <Request dbManager={this.props.dbManager} uid1={auth.currentUser.uid} uid2={this.state.selected_uid} />
                        {/* <button className='decline-button' onClick={this.handleRecind} >Recind</button> */}
                        </div>

                        : <div className='chat-container'><p className='no-results'>Select a message</p></div>
                    }
                
            </div>
        );
    }
}

export default Chats;