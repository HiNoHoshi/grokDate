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
                <Icebreaker username= "Hoshi" dbManager={this.props.dbManager} my_uid='oaHZIbeZcHXJAfBqEXHuglDi3Yo1' their_uid='NBWmUOSzU5WToFPNCB41DUwX2Hy2' />   
            </div>
        </div>
        );
    }
}
export default Popup;