import React from 'react'
import defaultPP from  '../images/profile-pics/default_profile_pic.jpg';


function profileInfo(props) {
    return  (
        <div className= 'profile-info'>
            <div className='profile-header'>
                <img className= 'profile-pic' src={props.info.pictureURL ? props.info.pictureURL: defaultPP}/>
                <h2 className='profile-username'>{props.info.username}</h2>
            </div>
            <div className='info'>
                <div className= 'info-column' style={{width:'40%'}}>
                    <div className='info-item'>
                        <label>Gender:</label>
                        <p>{props.info.gender}</p>
                    </div>
                    <div className='info-item'>
                        <label>Looking for:</label>
                        <p>{props.info.interest}</p>
                    </div>
                    <div className='info-item'>
                        <label>Age:</label>
                        <p>{props.info.age}</p>
                    </div>
                    <div className='info-item'>
                        <label>Location:</label>
                        <p>{props.info.location}</p>
                    </div>
                </div>
                <div className= 'info-column' style={{width:'60%'}}>
                    <div className='info-item'>
                        <label>Description:</label>
                        <p>{props.info.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default profileInfo;