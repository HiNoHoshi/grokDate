import React, {Component} from 'react'
import ProfileInfo from './profileInfo'
import InterestsContainer from './interestsContainer'
import Tooltip from './tooltip'
import get_info_icon from '../images/icons/get_info.png'

class ProfileCard extends Component {

    constructor(props){
        super(props);
        this.tooltipElement = React.createRef();
    }

    changeVisibility = () => {
        this.tooltipElement.current.toggleShow();
    }

    render(){
        let num_visible_subs = this.props.info.subreddits.filter((sub) => {
            let name = Object.keys(sub)[0]
            return sub[name].is_visible
        }).length
        let total_subs = this.props.info.subreddits.length

        var showTooltip = "hide";
        function showCurationInfo(e){
            showTooltip = "show";
        }


        return  (
            <div className="profile-container light-border">
                {<ProfileInfo info = {this.props.info}/>}
                <div className= 'interests-info'>
                    <div className= 'interests-nav'>
                        <button className='secondary-button tab-button' disabled>Channels <span>0/0</span></button>
                        <button className='secondary-button tab-button' active = "true">Communities <span>{num_visible_subs}/{total_subs} <img src={get_info_icon} alt="Curation score info" className="get-info-icon" onMouseEnter={this.changeVisibility} onMouseLeave={this.changeVisibility}/><Tooltip ref={this.tooltipElement}/></span></button>
                        <button className='secondary-button tab-button' disabled>Games <span>0/0</span></button>
                    </div>
                    <InterestsContainer subreddits={this.props.info.subreddits} favorite= {{name:"r/PS4", image:'https://b.thumbs.redditmedia.com/FAHhwPiuW5nv9wWm6baCsA5UrdP0-qFJiJOzniBigsc.png'}} list ={['r/PS4', 'r/todayilearned', 'r/aww', 'r/UIUC']}/>
                </div>
            </div>

            );
    }
}


export default ProfileCard;