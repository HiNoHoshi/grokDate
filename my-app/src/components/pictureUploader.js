import React, {Component} from 'react'
import PictureDropArea from './pictureDropArea'

class PictureUploader extends Component {
    constructor(){
        
        super();
        this.state = {}
        this.setPicture = this.setPicture.bind(this);
    }

    setPicture(picture){
        this.props.updatePicture(picture)
    }

    render(){
        
        var editStyle = {}

        if(!this.props.active){
            editStyle.display = 'none'
        }

        return  (
            <div className= 'picture-selector' style= {editStyle}>
                <PictureDropArea setPicture = {this.setPicture}/>
             </div>
        );
    }
}
export default PictureUploader;