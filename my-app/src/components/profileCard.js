import React, {Component} from 'react'
import ProfileInfo from './profileInfo'
import InterestsContainer from './interestsContainer'

class ProfileCard extends Component {
    render(){
        let num_visible_subs = this.props.info.subreddits.filter((sub) => {
            let name = Object.keys(sub)[0]
            return sub[name].is_visible
        }).length
        let total_subs = this.props.info.subreddits.length
        return  (
            <div className="profile-container light-border">
                <ProfileInfo key = {this.props.info} info = {this.props.info}/>  
                <div className= 'interests-info'>
                    <div className= 'interests-nav'>
                        <button className='secondary-button tab-button' disabled>Channels <span>0/0</span></button>
                        <button className='secondary-button tab-button selected' >Communities <span>{num_visible_subs}/{total_subs}</span></button>
                        <button className='secondary-button tab-button' disabled>Games <span>0/0</span></button>
                    </div>
                    <InterestsContainer subreddits={this.props.info.subreddits}/>
                </div>
            </div>

            );
    }
}


export default ProfileCard;