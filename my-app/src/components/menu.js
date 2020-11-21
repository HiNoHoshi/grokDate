import React, {Component} from 'react'
import logo from '../images/logos/logo_big.png';


class Menu extends Component {
    render(){
     // If props.active == to what? the what displays the arrow
        return  (
        <div className="menu-container">
            <img src={logo} className="App-logo" alt="logo" />

            <div className= 'menu-tabs'>
                <button className= 'menu-tab' >Browse profiles</button>
                <button className= 'menu-tab'>My profile</button>
                <button className= 'menu-tab'>Chats</button>
                <button className= 'menu-tab'>Settings</button>
            </div>      
        </div>

        );
    }
}
export default Menu ;