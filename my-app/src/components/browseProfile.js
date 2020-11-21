import React, {Component} from 'react'
import Menu from './menu'
import PCard from './profileCard'
import Users from '../usersDB'
import ArrowButton from "./arrow_button"
import Icebreaker from './icebreaker'



class BrowseProfiles extends Component {
    constructor(){
        super();
        this.state = {}
        this.showIB = this.showIB.bind(this)
    }
    showIB(show){
        if(show){
            return <Icebreaker username="SourPickle"/>
        }else{
            return 
        }
    }
    
    render(){
        const users = Users.map(user => <PCard key={user.username} username={user.username} info={user.info} />)
        return  (
        <div className="general-container">

            < Menu />
            <div className= 'content-container'>
                {users}

                <div className= 'profile-nav'>
                    < ArrowButton direction = 'Back'/>
                    <button>Break the Ice!</button>
                    < ArrowButton direction = 'Next'/>
                </div>
            </div>
            {this.showIB(false)}
        </div>
        );
    }
}
export default BrowseProfiles;