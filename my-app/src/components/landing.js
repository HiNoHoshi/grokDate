import React, {Component} from 'react'
import logo from '../images/logos/logo_big.png';
import SignIn from './signIn'
import SignUp from './signUp'

class Landing extends Component {
    constructor(){
        super();
        this.state = {
            login: true
        }
        this.changeCard = this.changeCard.bind(this)
    }
    
    changeCard() {
        console.log(this.state)
        this.setState(state => {
            let newState = {login: !state.login}
            return newState
        })
    }
    render(){
        var card
        var cardOptionText 
        if (this.state.login){
            card = < SignIn changeSection = {this.props.changeSection}/>
            cardOptionText = <p>You don't have an account yet? <a href = '#' onClick= {this.changeCard} >Sign up</a></p>
        }else{
            card = < SignUp changeSection = {this.props.changeSection} />
            cardOptionText = <p>Already have an account? <a href = '#' onClick= {this.changeCard}>Sign in</a></p>

        }

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
            {card}
            {cardOptionText}
            </div>

        </div>
        );
    }
}
export default Landing;