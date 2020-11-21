import React, {Component} from 'react'
import logo from '../images/logos/logo_mid.png';
import Form from './form'
import RegisterInterests from './registerInterests'

class Register extends Component {
    constructor(){
        super();
        this.state = {
            username: "",
            info: {
                gender: "",
                interest: "",
                age: "",
                location: "",
                description: ""
            },
            communities: {
                reddit: [],
                youtube: [],
                steam: []
            }
        }
    }
    render(){
        return  (
        <div className="register-container">
            <img src={logo} className="register-logo" alt="logo" />
            <Form />
            <RegisterInterests />
            <button className= 'register-button' onClick= {(event) => this.props.changeSection('browsing')}>Create Account</button>
        </div>
        );
    }
}
export default Register;