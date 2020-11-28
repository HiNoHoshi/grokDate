import React, {Component} from 'react'
import Icebreaker from './icebreaker'

class Popup extends Component {
    constructor(){
        super();
        this.state = {}
    }

    render(){
        return  (
        <div className="popup-container">
            <div className="popup light-border" >
                <button className='secondary-button close-button' onClick={this.props.close}></button>
                <Icebreaker username={this.props.details.their_username} dbManager={this.props.dbManager} my_uid={this.props.details.my_uid} their_uid={this.props.details.their_uid} />   
            </div>
        </div>
        );
    }
}
export default Popup;