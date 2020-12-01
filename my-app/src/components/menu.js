import React, {Component} from 'react'
import logo from '../images/logos/logo_big.png';
import arrow from '../images/icons/arrow_white_big.png';



class Menu extends Component {
    render(){
     // If props.active === to what? the what displays the arrow
        return  (
        <div className="menu-container">
            <img src={logo} className="App-logo" alt="logo" />

            <div className= 'menu-tabs'>
                <button className= {this.props.section === 'Browse' ? 'menu-tab active' : 'menu-tab'}  onClick= {() => this.props.changeSection("Browse")}>
                    {this.props.section === 'Browse' && <img src={arrow} alt = "arrow" style={{paddingRight:'1em'}}/>} Browse profiles</button>
                <button className= {this.props.section === 'Profile' ? 'menu-tab active' : 'menu-tab'}  onClick= {() => this.props.changeSection("Profile")}>
                    {this.props.section === 'Profile' && <img src={arrow} alt = "arrow" style={{paddingRight:'1em'}}/>}My profile</button>
                <button className= {this.props.section === 'Chats' ? 'menu-tab active' : 'menu-tab'}  onClick= {() => this.props.changeSection("Chats")}>
                    {this.props.section === 'Chats' && <img src={arrow} alt = "arrow" style={{paddingRight:'1em'}}/>}Chats</button>
                <button className= {this.props.section === 'Settings' ? 'menu-tab active' : 'menu-tab'}  onClick= {() => this.props.changeSection("Settings")}>
                    {this.props.section === 'Settings' && <img src={arrow} alt = "arrow" style={{paddingRight:'1em'}}/>}Settings</button>
            </div>
            <button className= 'menu-tab logout' onClick= {() => this.props.SignOut()}>LogOut</button>

        </div>

        );
    }
}
export default Menu;