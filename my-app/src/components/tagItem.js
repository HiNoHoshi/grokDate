import React, {Component} from 'react'
import close from '../images/icons/close_icon@2x.png';

class TagItem extends Component {
    constructor(){
        super();
        this.state = { }
        // this.changeCard = this.changeCard.bind(this)
        var imgStyle = {
            heigh:'1em',
            width:'1em'

        }

    }
    render(){
        var editButton = {
            borderRadius: '10px',
            height:'10px', 
            width:'10px',
            // backgroundColor:'white',
            textSize: '8px'
        }
        return  (
            <div className= "tag">
                {this.props.image && <img alt={this.props.name} src={this.props.image} style={{height:'1em', width:'1em', borderRadius:'50%', marginRight:'0.4em'}}/>}
                <p>{this.props.name}</p>
                {/* {this.props.editable && <img src={close} className="close-icon" alt="close" />} */}
                {this.props.editable && <button src={close} className="secondary-button" alt="close" style={editButton}>+</button>}
            </div>
        );
    }
}
export default TagItem;