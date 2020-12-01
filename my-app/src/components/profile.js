import React, {Component} from 'react'
import PCard from './profileCard'
import { auth } from '../comm/firebaseCredentials'

class MyProfile extends Component {
    constructor(){
        super();
        this.state = {userInfo:null, userInfoUnsubscribe: null}
        this.my_uid = null
        this.updateProfile = this.updateProfile.bind(this)
    }

    componentDidMount() {
        this.my_uid = auth.currentUser.uid;
        this.props.dbManager.getUserExtendedInfo(this.my_uid).then((result)=>{
            this.setState({userInfo: {...result, user: auth.currentUser}})
        })

    }
    // Updates the profile information after editing it 
    // TODO: discover why in the world only the subreddits are being updated
    updateProfile(updatedUserInfo){
        this.setState(state => {
            const updInfo = updatedUserInfo.infoUpdate;
            const updComm = updatedUserInfo.communities;
            const prevComm = state.userInfo.subreddits;

            const newComm = prevComm.map((sub)=>{
        
                let name = Object.keys(sub)[0]
                let content = {...sub[name], 
                    is_favorite: updComm[name].is_favorite,
                    is_visible: updComm[name].is_visible}
                    return {[name]:content}
            })
            let newState = {
              userInfo: {...state.userInfo, 
                city: updInfo.city,
                country: updInfo.country,
                description: updInfo.description,
                interest: updInfo.interest,
                subreddits: newComm}, 
            }
            return newState
        });
        this.forceUpdate()
    }


    render(){
        var userCard 
        if(this.state.userInfo){
            userCard = <PCard key={this.state.userInfo.username} info={this.state.userInfo} />
        }
        return  (
            
            <div className= 'content-container'>
                {userCard}
                <button onClick={()=>
                    {this.props.updatePopup(true, 'profileEdit', {user: this.state.userInfo.user, userInfo: this.state.userInfo, updateProfile: this.updateProfile})}
                    }>Edit profile</button>

            </div>
        );
    }
}

export default MyProfile;