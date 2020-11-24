import React from 'react'
import arrowBack from '../images/icons/arrow_green_back.png';
import arrowNext from '../images/icons/arrow_green_next.png';

function ArrowButton (props){
    var button
    if (props.direction === "Back"){
        button = <button className= 'arrowButton' disabled = {!props.active} onClick={props.change}><img src={arrowBack} alt = "arrow" style={{paddingRight:'1em'}}/>{props.direction}</button>
    }else{
        button = <button className= 'arrowButton'disabled = {!props.active} onClick={props.change}>{props.direction}<img src={arrowNext} alt = "arrow" style={{paddingLeft:'1em'}}/></button>
    }
    return(button);
    
}
export default ArrowButton ;