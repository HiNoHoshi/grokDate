import React, {Component} from 'react'
import del from '../images/icons/delete_button@2x.png';

class TagItem extends Component {
    constructor(){
        super();
        this.state = {
            visible: 'true'}
        this.clicked = this.clicked.bind(this)


    }
    clicked(){
        console.log('clicked')
        this.setState(state => {
            return {visible: !state.visible}
        });
    }
    render(){
        var editButton = {
            height:'20px', 
            width:'20px',
            padding: '0px',
            marginLeft: '10px',
            backgroundImage: "url(" + del + ")"

            // backgroundColor:'white',
        }

        var imgStyle = {
            height:'1em', 
            width:'1em', 
            borderRadius:'50%', 
            marginRight:'0.4em'
        }
        
        if(this.state.visible){
            var visibleStyle ={ opacity: '100%'}
        }else{
            var visibleStyle ={ opacity: '10%'}
        }

        return  (
            <div className= "tag" draggable = "true" onDrag={e => {this.props.selectAsFavorite(e.target)}} style = {visibleStyle}>
                {this.props.image && <img alt={this.props.name} src={this.props.image} style={imgStyle}/>}
                <p>{this.props.name}</p>
                {/* {this.props.editable && <img src={close} className="close-icon" alt="close" />} */}
                {this.props.editable && <button src = {del} onClick = {this.clicked} className=" close-button secondary-button" alt="close" style={editButton}/>}
            </div>
        );
    }
}
export default TagItem;