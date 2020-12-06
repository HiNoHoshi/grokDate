import React, {Component} from 'react'
import PictureDropArea from './pictureDropArea'

class PictureUploader extends Component {
    constructor(){
        
        super();
        this.state = {
        }
        this.loadPicture = this.loadPicture.bind(this);
    }

    componentDidMount () {
    }

    loadPicture(picture){
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }


    render(){
        
        var editStyle = {}

        if(!this.props.active){
            editStyle.display = 'none'
        }

        return  (
            <div className= 'picture-selector' style= {editStyle }>
                <PictureDropArea />
                {/* <button>Upload imeage</button> */}
             </div>
        );
    }
}
export default PictureUploader;