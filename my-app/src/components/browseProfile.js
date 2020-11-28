import React, {Component} from 'react'
import PCard from './profileCard'
import profiles from '../usersDB'
import ArrowButton from "./arrow_button"
import { auth } from '../comm/firebaseCredentials'


class BrowseProfiles extends Component {
    constructor(){
        super();
        this.state = {
            activePID: 0,
            profiles:[],
            activeProfile: null,
        }
        this.my_uid = null
        this.prevProfile = this.prevProfile.bind(this)
        this.nextProfile = this.nextProfile.bind(this)
    }

    componentDidMount() {
        // charge the user profiles from the database
        this.my_uid = auth.currentUser.uid;
        this.props.dbManager.getAllOtherUsers(this.my_uid).then((profiles) => {
            this.setState({profiles: profiles})
            // console.log(this.state.profiles)
            this.setState({activeProfile: profiles[0], activePID: 0})
            console.log(this.state.activeProfile)
        })
    }

    prevProfile(){
        this.setState(state => {
            return {activePID: state.activePID-1}
        });
    }

    nextProfile(){
        this.setState(state => {
            return {activePID: state.activePID+1}
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.activePID  !== this.state.activePID){
            const activeProfile = this.state.profiles[this.state.activePID]
            this.setState({activeProfile})
            console.log(this.state.activeProfile)
        }
    }

    render(){
        return  (
            <div className= 'content-container'>
                {this.state.activeProfile &&  <PCard key={this.state.activeProfile.uid} info={this.state.activeProfile} />}
                <div className= 'profile-nav'>
                    < ArrowButton active={this.state.activePID> 0} direction='Back' change={this.prevProfile} />
                    <button onClick={()=>{this.props.updatePopup(true,{'their_uid': this.state.activeProfile.uid, 'their_username': this.state.activeProfile.username, 'my_uid': this.my_uid})}}>Break the Ice!</button>
                    < ArrowButton active={this.state.activePID<this.state.profiles.length-1} direction='Next' change={this.nextProfile} />
                </div>
            </div>
        );
    }
}

export default BrowseProfiles;