import React, {Component} from 'react'
import PCard from './profileCard'
import { auth } from '../comm/firebaseCredentials'

class MyProfile extends Component {
    constructor(){
        super();
        this.state = {userInfo:null
        }
        this.my_uid = null

    }

    componentDidMount() {
        this.my_uid = auth.currentUser.uid;
        this.props.dbManager.getUserExtendedInfo(this.my_uid).then((result)=>{
            this.setState({userInfo: {...result, user: auth.currentUser}})
        })
    }

    // componentDidUpdate(prevProps, prevState) {
    // }

    render(){
        var userCard 
        if(this.state.userInfo){
            userCard = <PCard info={this.state.userInfo} />
        }
        return  (
            
            <div className= 'content-container'>
                {userCard}
                <button onClick={()=>{this.props.updatePopup(true, 'profileEdit', this.state.userInfo)}}>Edit profile</button>

            </div>
        );
    }
}

export default MyProfile;