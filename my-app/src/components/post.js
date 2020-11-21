import React, {Component} from 'react'

class Post extends Component {
    render(){
        return  (
        <div className="post-container">
            <h5 className= 'post-title'>{this.props.subreddit}</h5>
            <p className= 'post-text'>{this.props.postText}</p>
        </div>
        );
    }
}
export default Post;