import React, {Component} from 'react'

class Post extends Component {
    render(){
        return  (
        <div className="post-container light-border">
            <a className= 'post-header' target="_blank"  href = {'https://www.reddit.com/'+this.props.subreddit}>{this.props.subreddit}</a>
            <p className= 'post-text'>{this.props.postText}</p>
        </div>
        );
    }
}
export default Post;