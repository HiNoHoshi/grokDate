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
                <button className='close-button' onClick={this.props.close}></button>
                <Icebreaker username= "Hoshi"/>   
            </div>
        </div>
        );
    }
}
export default Popup;