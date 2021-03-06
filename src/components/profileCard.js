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

    render() {
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
                <ProfileInfo key = {this.props.info} info = {this.props.info}/>  
                <div className= 'interests-info'>
                    <div className= 'interests-nav'>
                        <button className='secondary-button tab-button' disabled>Channels <span>0/0</span></button>
                        <button className='secondary-button tab-button selected' active = "true">Communities <span className='curation-score' onMouseEnter={this.changeVisibility} onMouseLeave={this.changeVisibility}>{num_visible_subs}/{total_subs} <img src={get_info_icon} alt="Curation score info" className="get-info-icon"/><Tooltip ref={this.tooltipElement}/></span></button>
                        <button className='secondary-button tab-button' disabled>Games <span>0/0</span></button>
                    </div>
                    <InterestsContainer subreddits={this.props.info.subreddits}/>
                </div>
            </div>

            );
    }
}


export default ProfileCard;