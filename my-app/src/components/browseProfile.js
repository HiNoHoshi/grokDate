import React, {Component} from 'react'
import PCard from './profileCard'
import Users from '../usersDB'
import ArrowButton from "./arrow_button"



class BrowseProfiles extends Component {
    constructor(){
        super();
        this.state = {popup: false}
        this.currentUser = Users[0].username
        this.showIB = this.showIB.bind(this);
    }
    showIB(){
        this.setState(state => {
            let newState = {popup: !this.state.popup}
            return newState
        });
        console.log(this.state)

    }
    
    render(){
        const users = Users.map(user => <PCard key={user.username} username={user.username} info={user.info} />)
        return  (
            <div className= 'content-container'>
                {users}
                <div className= 'profile-nav'>
                    < ArrowButton direction = 'Back'/>
                    <button onClick={()=>{this.props.showPopup(true,{})}}>Break the Ice!</button>
                    < ArrowButton direction = 'Next'/>
                </div>
            </div>
        );
    }
}
export default BrowseProfiles;