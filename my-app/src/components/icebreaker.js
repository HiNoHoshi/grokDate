import React, {Component} from 'react'
import Posts from '../postsDB'
import ArrowButton from "./arrow_button"
import Post from "./post"


class Icebreaker extends Component {
    constructor(){
        super();
        this.state = {
            loading: false,
            icebreakers: [
                {
                    id:'',
                    community: '',
                    post_text:''
                }
            ]
        }
    }
    
    //  Example to call Reddit API right after the icebreaker appears
    componentDidMount() {
        fetch('https://www.reddit.com/r/UIUC.json')
            .then(response => response.json())
            .then(data => console.log(data))
            // Here the state should be updated with the post fetched 
            // in order to automatically display it in the component
            // and after getting the data we will need to change the loading attr to false
    }

    render(){
        const posts = Posts.map(post => <Post key={post.id} subreddit={post.subreddit} postText={post.postText} />)
        return  (
            <div className= 'icebreaker'>
                <h2>Chose an Icebreaker for <a href='#'>{this.props.username}</a></h2>
                <select>
                    <option value="Did you see this?">Did you see this?</option>
                    <option value="What do you think about this?">What do you think about this?</option>
                </select>
                {this.state.loading ? <div className="post-container">loading</div>:posts}

                <div className= 'profile-nav'>
                    {/* TODO: set up the arrows to navigate in the posts */}
                    {/* < ArrowButton direction = 'Back'/> */}
                    <button>Send message</button>
                    {/* < ArrowButton direction = 'Next'/> */}
                </div>
            </div>     
        );
    }
}
export default Icebreaker;