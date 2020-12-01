import React, {Component} from 'react'
import Icebreaker from './icebreaker'
import EditProfile from './editProfile'


class Popup extends Component {
    constructor(){
        super();
        this.state = {}
    }

    render(){
        var show
        if (this.props.type === 'icebreaker'){
                show =  <Icebreaker 
                username={this.props.details.their_username} 
                dbManager={this.props.dbManager} 
                my_uid={this.props.details.my_uid} 
                their_uid={this.props.details.their_uid} />   

        }if (this.props.type === 'profileEdit'){
            console.log(this.props.details)
            show = <EditProfile 
                user = {this.props.details.user} 
                dbManager = {this.props.dbManager} 
                userInfo = {this.props.details.userInfo} 
                updateProfile= {this.props.details.updateProfile} 
                close = {this.props.close}/>

        }

        return  (
        <div className="popup-container">
            <div className="popup light-border" >
                <button className='secondary-button close-button' onClick={this.props.close}></button>
                {show}
            </div>
        </div>
        );
    }
}
export default Popup;