import React, { Component } from 'react'
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
        this._isMounted = false;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        // charge the user profiles from the database
        this.props.dbManager.getUserProfileInfo(this.props.uid2).then((profile_info) => {
            this.props.dbManager.getIcebreakerInfo(this.props.uid1, this.props.uid2).then((ice_info) => {
                if (this._isMounted) this.setState({profile_info: profile_info, uid2: this.props.uid2, icebreaker_chat: ice_info});
            })
        })
    }

    componentDidUpdate() {
        if (this.props.uid2 !== this.state.uid2) {
            if (this._isMounted) this.setState({uid2: this.props.uid2})
            this.props.dbManager.getUserProfileInfo(this.props.uid2).then((profile_info) => {
                this.props.dbManager.getIcebreakerInfo(this.props.uid1, this.props.uid2).then((ice_info) => {
                    if (this._isMounted) this.setState({profile_info: profile_info, uid2: this.props.uid2, icebreaker_chat: ice_info});
                })
            })
        }
    }

    render() {
        var request = <div className="request-container"></div>
        if (!(!this.state.profile_info || !this.state.icebreaker_chat)){
            request = <div className="request-container">
                        <PCard key={this.state.profile_info.uid} info={this.state.profile_info} />
                        <div className='request'>
                            <h2><a className='profile-username'>{this.state.icebreaker_chat.uid === this.state.uid1 ? 'Me': this.state.profile_info.username}</a>: {this.state.icebreaker_chat.text}</h2>
                            <Post data={this.state.icebreaker_chat.icebreaker} />
                        </div>
                    </div>
        }

        return (
            request
        )
    }

}

export default Request