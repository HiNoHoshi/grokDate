import React, {Component} from 'react'
import arrowBack from '../images/icons/arrow_green_back.png';
import arrowNext from '../images/icons/arrow_green_next.png';

class ArrowButton extends Component {
    render(){
        var button
        if (this.props.direction === "Back"){
            button = <button className= 'arrowButton'><img src={arrowBack} alt = "arrow" style={{paddingRight:'1em'}}/>{this.props.direction}</button>
        }else{
            button = <button className= 'arrowButton'>{this.props.direction}<img src={arrowNext} alt = "arrow" style={{paddingLeft:'1em'}}/></button>
        }
        return(button);
    }
}
export default ArrowButton ;