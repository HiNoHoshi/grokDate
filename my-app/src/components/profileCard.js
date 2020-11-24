import React, {Component} from 'react'

class ProfileCard extends Component {
    render(){
        return  (
            <div className="profile-container">
                <div className= 'profile-info light-border'>
                    <h2><a href='#'>{this.props.info.username}</a></h2>
                    <div className='info'>
                        <div className= 'info-column'>
                            <div className='info-item'>
                                <label>Gender:</label>
                                <p>{this.props.info.gender}</p>
                            </div>
                            <div className='info-item'>
                                <label>Looking for:</label>
                                <p>{this.props.info.interest}</p>
                            </div>
                            <div className='info-item'>
                                <label>Age:</label>
                                <p>{this.props.info.age}</p>
                            </div>
                            <div className='info-item'>
                                <label>Location:</label>
                                <p>{this.props.info.location}</p>
                            </div>
                        </div>
                        <div className= 'info-column'>
                            <label>Description:</label>
                            <p>{this.props.info.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            );
    }
}


export default ProfileCard;