import React, {Component} from 'react'
import close from '../images/icons/close_icon@2x.png';

class TagItem extends Component {
    constructor(){
        super();
        this.state = { }
        // this.changeCard = this.changeCard.bind(this)
    }
    render(){
        return  (
            <div className= "tag">
                <p>{this.props.name}</p>
                <img src={close} className="close-icon" alt="close" />
            </div>
        );
    }
}
export default TagItem;