import React, {Component} from 'react'
import ProfileInfo from './profileInfo'
import InterestsContainer from './interestsContainer'

class ProfileCard extends Component {
    render(){
        return  (
            <div className="profile-container light-border">
                {<ProfileInfo info = {this.props.info}/>}
                <div className= 'interests-info'>
                    <div className= 'interests-nav'>
                        <button className='secondary-button tab-button' disabled>Channels <span>0/0</span></button>
                        <button className='secondary-button tab-button' active = "true">Communities <span>0/0</span></button>
                        <button className='secondary-button tab-button' disabled>Games <span>0/0</span></button>
                    </div>
                    <InterestsContainer favorite= {{name:"r/PS4", image:'https://b.thumbs.redditmedia.com/FAHhwPiuW5nv9wWm6baCsA5UrdP0-qFJiJOzniBigsc.png'}} list ={['r/PS4', 'r/todayilearned', 'r/aww', 'r/UIUC']}/>

                </div>
            </div>

            );
    }
}


export default ProfileCard;