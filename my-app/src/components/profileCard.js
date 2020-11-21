import React, {Component} from 'react'

class ProfileCard extends Component {
    render(){
        return  (
            <div className="profile-container">
                <div className= 'user-info'>
                    <h1>{this.props.username}</h1>
                    <p>{this.props.info.gender}</p>
                    <p>{this.props.info.interest}</p>
                    <p>{this.props.info.age}</p>
                    <p>{this.props.info.location}</p>
                    <p>{this.props.info.description}</p>
                </div>
        
                {/* <div className= 'communities'>
                    <div className= 'community' style = {{display: !props.communities.reddit && "none"}}> Reddit</div>
                    <div className= 'community' style = {{display: !props.communities.youtube && "none"}}> Youtube</div>
                    <div className= 'community' style = {{display: props.communities.steam ? "block": "none"}}> Steam</div>  
                </div> */}
            </div>
            );
    }
}


export default ProfileCard;