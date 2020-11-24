import React, {Component} from 'react'

class SignIn extends Component {

    render(){
        return  (
            <div className='access-card'>
                <h1>Sign in</h1>
                {/* <input type="email"></input> */}
                <button onClick= {(event) => this.props.login()}>Sign in</button>
            </div>
        );
    }
}
export default SignIn;