import React, { Component, useState, useEffect } from 'react'
import { auth } from '../comm/firebaseCredentials'
import PCard from './profileCard'


class Request extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profile_info: null,
            uid2: this.props.uid2,
        }
    }

    componentDidMount() {
        // charge the user profiles from the database
        this.props.dbManager.getUserProfileInfo(this.props.uid2).then((profile_info) => {
            this.setState({profile_info: profile_info, uid2: this.props.uid2})
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
            </div>
            // Icebreaker
        )
    }

}

export default Request