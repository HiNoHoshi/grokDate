import React, {Component} from 'react'
import PCard from './profileCard'
import Data from '../database'
import ArrowButton from "./arrow_button"


class Icebreaker extends Component {
    render(){
        console.log(this.props)
        const posts = Data.posts.map(post => <PCard key={post.id} subreddit={post.subreddit} postText={post.postText} />)
        return  (
        <div className="popup-container">
            <div className= 'popup'>
                <h2>Chose an Icebreaker for <a href='#'>{this.props.username}</a></h2>
                <select>
                    <option value="Did you see this?">Did you see this?</option>
                    <option value="What do you think about this?">What do you think about this?</option>
                </select>
                {posts}

                <div className= 'profile-nav'>
                    < ArrowButton direction = 'Back'/>
                    <button>Send message</button>
                    < ArrowButton direction = 'Next'/>
                </div>
            </div>     
        </div>
        );
    }
}
export default Icebreaker;