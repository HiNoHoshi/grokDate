import React, {Component} from 'react'
import Icebreaker from '../icebreaker'

class Popup extends Component {
    constructor(){
        super();
        this.state = {}
    }

    render(){
        console.log(this.props)
        return  (
        <div className="popup-container">
            <Icebreaker username= {this.props.username}/>   
        </div>
        );
    }
}
export default Popup;