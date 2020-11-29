import React, {useRef,Component} from 'react'
import PCard from './profileCard'
import profiles from '../usersDB'
import ArrowButton from "./arrow_button"
import GenIcebreaker from "./genIcebreakers"


class BrowseProfiles extends Component {
    constructor(){
        super();
        this.state = {
            activePID: 0,
            profiles:[],
            activeProfile: null,
        }
        this.prevProfile = this.prevProfile.bind(this)
        this.nextProfile = this.nextProfile.bind(this)
    }

    componentDidMount() {
        // charge the user profiles from the database
        this.setState({profiles, activeProfile: profiles[0]})
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
        }
      }
    render(){
        return  (
            <div className= 'content-container'>
                {this.state.activeProfile &&  <PCard key={this.state.activeProfile.uid} info={this.state.activeProfile.info} />}
                <div className= 'profile-nav'>
                    < ArrowButton active= {this.state.activePID> 0} direction = 'Back' change = {this.prevProfile}/>
                    <button onClick={()=>{this.props.updatePopup(true,{})}}>Break the Ice!</button>
                    {/* <GenIcebreaker dbManager={this.props.dbManager} my_uid='oaHZIbeZcHXJAfBqEXHuglDi3Yo1' their_uid='NBWmUOSzU5WToFPNCB41DUwX2Hy2' /> */}
                    < ArrowButton active= {this.state.activePID<this.state.profiles.length-1} direction = 'Next'change = {this.nextProfile}/>
                </div>
            </div>
        );
    }
}
export default BrowseProfiles;