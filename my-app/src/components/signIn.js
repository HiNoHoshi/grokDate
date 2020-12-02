import React, {Component} from 'react'

class SignIn extends Component {

    render(){
        return  (
            <div className='access-card'>
                <h1>Enter</h1>
                <p>Enter to grok.date usign you Google account, and enjoy the new experience </p>
                <button onClick= {(event) => this.props.login()}>Enter with Google</button>
            </div>
        );
    }
}
export default SignIn;