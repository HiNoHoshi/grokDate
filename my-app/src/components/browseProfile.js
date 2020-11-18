import React from 'react'
import Menu from './menu'
import PCard from './profileCard'
import Users from '../database'

function browseProfiles(){
    console.log(Users)
    const users = Users.map(user => <PCard key={user.username} info={user.info} />)
    return  (
    <div className="general-container">

        < Menu />
        <div className= 'content-container'>
            {users}

            <div className= 'profile-nav'>
                <button>Prev</button>
                <button>Break the Ice!</button>
                <button>Next</button>
            </div>
        </div>
        
    </div>
    );
}
export default browseProfiles;