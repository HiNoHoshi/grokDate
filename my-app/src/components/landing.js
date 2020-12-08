import React, {Component} from 'react'
import logo from '../images/logos/logo_big.png';
import SignIn from './signIn'

class Landing extends Component {
    constructor(){
        super();
        this.state = {
            login: true
        }
        this.changeCard = this.changeCard.bind(this)
    }
    
    changeCard() {
        this.setState(state => {
            let newState = {login: !state.login}
            return newState
        })
    }

    render(){
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
            <div style=  {{textAlign: 'center'}}>
                < SignIn login = {this.props.SignIn}/>
                <p style = {{fontSize: '16px'}}>Read about 
                    <a href ="https://docs.google.com/document/d/1WtTGWn2Fx6pdw4052BIB0xfOlUZf0qLouKvJao5Shtc/edit?usp=sharing"
                                target= "_blank">privacy policy
                    </a>
                     and  
                    <a href ="https://docs.google.com/document/d/122qxArlLZWS7iEdxdioE1WD_RjjA4J9LQB8JAhqdv-g/edit?usp=sharing"
                                target= "_blank">terms of service
                    </a>
                </p>
            </div>
            
        </div>
        );
    }
}
export default Landing;