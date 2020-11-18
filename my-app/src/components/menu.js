import React from 'react'
import logo from '../images/logos/logo_mid_white.png';

function menu(props){
    // If props.active == to what? the what displays the arrow
    return  (
    <div className="menu-container">
        <img src={logo} className="App-logo" alt="logo" />

        <div className= 'menu-tab'> Browse profiles
        </div>
        <div className= 'menu-tab'>My profile
        </div>
        <div className= 'menu-tab'> Chats
        </div>
        <div className= 'menu-tab'> Settings
        </div>
    </div>

    );
}
export default menu ;