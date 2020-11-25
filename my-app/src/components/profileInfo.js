import React, {Component} from 'react'

function profileInfo(props) {
    return  (
        <div className= 'profile-info'>
            <h2>{props.info.username}</h2>
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
                    <label>Description:</label>
                    <p>{props.info.description}</p>
                </div>
            </div>
        </div>
    );
}


export default profileInfo;