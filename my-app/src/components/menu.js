import React, {Component} from 'react'
import logo from '../images/logos/logo_big.png';


class Menu extends Component {
    render(){
     // If props.active == to what? the what displays the arrow
        return  (
        <div className="menu-container">
            <img src={logo} className="App-logo" alt="logo" />

            <div className= 'menu-tabs'>
                <button className= 'menu-tab' onClick= {() => this.props.changeSection("Browse")}>Browse profiles</button>
                <button className= 'menu-tab' onClick= {() => this.props.changeSection("Profile")}>My profile</button>
                <button className= 'menu-tab' onClick= {() => this.props.changeSection("Chats")}>Chats</button>
                <button className= 'menu-tab' onClick= {() => this.props.changeSection("Settings")}>Settings</button>
                <button className= 'menu-tab logout' onClick= {() => this.props.SignOut()}>LogOut</button>
            </div>

        </div>

        );
    }
}
export default Menu;