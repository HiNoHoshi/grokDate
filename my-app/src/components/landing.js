import React from 'react'
import logo from '../images/logos/logo_big.png';
import Login from './login'

function landing(props){
    return  (
    <div className="landing-container">

        <div id= 'App-punch-line'>
            <img src={logo} className="App-logo" alt="logo" />
            <ul className= 'arrow-list'>
                <li>Share interests</li>
                <li>Meet new communities</li>
                <li>Find love, be yourself</li>
            </ul>
        </div>
        < Login />
    </div>

    );
}
export default landing;