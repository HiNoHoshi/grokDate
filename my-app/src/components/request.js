import React, { Component, useState, useEffect } from 'react'
import { auth } from '../comm/firebaseCredentials'
import PCard from './profileCard'
import Post from './post'


class Request extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profile_info: null,
            uid1: this.props.uid1,
            uid2: this.props.uid2,
            icebreaker_chat: null,
        }
    }

    componentDidMount() {
        // charge the user profiles from the database
        this.props.dbManager.getUserProfileInfo(this.props.uid2).then((profile_info) => {
            this.setState({profile_info: profile_info, uid2: this.props.uid2})
        })

        this.props.dbManager.getIcebreakerInfo(this.props.uid1, this.props.uid2).then((ice_info) => {
            this.setState({icebreaker_chat: ice_info});
        })
    }

    componentDidUpdate() {
        if (this.props.uid2 !== this.state.uid2) {
            this.setState({uid2: this.props.uid2})
            this.props.dbManager.getUserProfileInfo(this.props.uid2).then((profile_info) => {
                this.setState({profile_info: profile_info})
            })
        }
    }

    render() {
        return (
            <div className="Request">
                {this.state.profile_info ? <PCard key={this.state.profile_info.uid} info={this.state.profile_info} /> : null}
                { 
                    this.state.icebreaker_chat ? 
                    <Post data={this.state.icebreaker_chat.icebreaker} /> : null
                }
            </div>
        )
    }

}

export default Request