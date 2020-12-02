import React from 'react'
import arrowBack from '../images/icons/arrow_green_back.png';
import arrowNext from '../images/icons/arrow_green_next.png';

function ArrowButton (props){
    var button
    if (props.direction === "Back") {
        button = <button className= 'secondary-button' disabled = {!props.active} onClick={props.change}><img src={arrowBack} alt = "arrow" style={{paddingRight:'1em'}}/>{!props.simple && props.direction}</button>
    } else if (props.direction === "Next") {
        button = <button className= 'secondary-button'disabled = {!props.active} onClick={props.change}>{!props.simple && props.direction}<img src={arrowNext} alt = "arrow" style={{paddingLeft:'1em'}}/></button>
    } else {
        console.log("Unknown direction ${props.direction} of ArrowButton")
    }
    return(button);
    
}
export default ArrowButton ;