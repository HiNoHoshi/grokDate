import React, {Component} from 'react'
import del from '../images/icons/delete_button@2x.png';
import add from '../images/icons/add_button@2x.png';

class TagItem extends Component {
    constructor(){
        super();
        this.state = {
            visible: 'true'}
        this.clicked = this.clicked.bind(this)
    }
    
    componentDidMount () {
        this.setState(state => {
            return {visible: this.props.visible}
        });    }

    clicked(){
        this.setState(state => {
            return {visible: !state.visible}
        });
        this.props.updateVisibility(this.props.name, this.state.visible)
    }
    render(){

        var tagStyle
        var action

        if(this.state.visible){
            tagStyle ={ opacity: '100%'}
            action = del

        }else{
            tagStyle ={ opacity: '30%'}
            action = add
        }

        var editButton = {
            height:'25px', 
            width:'25px',
            padding: '0px',
            margin: '0em 0em 0em .4em',
            backgroundImage: "url(" + action + ")",
            alignSelf: 'center',
            pointer: 'pointer'
        }

        var imgStyle = {
            height:'1em', 
            width:'1em', 
            borderRadius:'50%', 
            marginRight:'0.4em'
        }

        return  (
            <div className= {this.state.visible ? 'tag': 'tag actionable'}  
            draggable = {this.state.visible && this.props.editable} //TODO: Check if it still works in the registration
            onDrag={e => {this.props.selectTag(this.props.name)}} 
            onDragEnd={e =>{this.props.selectTag(null)}}
            style = {tagStyle}>

                {this.props.image && 
                <img alt={this.props.name} src={this.props.image} style={imgStyle}/>}
                
                <a href={"https://www.reddit.com/r/"+this.props.name} target= "_blank" rel="noreferrer">{this.props.name}</a>

                {this.props.editable && <button onClick = {this.clicked} className=" close-button secondary-button" alt="close" style={editButton}/>}
            </div>
        );
    }
}
export default TagItem;