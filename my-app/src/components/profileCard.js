import React from 'react'

function profileCard(props){
    console.log(props)
    return  (
    <div className="profile-container">
        <div className= 'user-info'>
            <h1>{props.info.username}</h1>
            <p>{props.info.gender}</p>
            <p>{props.info.interest}</p>
            <p>{props.info.age}</p>
            <p>{props.info.location}</p>
            <p>{props.info.description}</p>
        </div>

        {/* <div className= 'communities'>
            <div className= 'community' style = {{display: !props.communities.reddit && "none"}}> Reddit</div>
            <div className= 'community' style = {{display: !props.communities.youtube && "none"}}> Youtube</div>
            <div className= 'community' style = {{display: props.communities.steam ? "block": "none"}}> Steam</div>  
        </div> */}
    </div>
    );
}
export default profileCard;