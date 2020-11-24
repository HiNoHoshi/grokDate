import React, {Component} from 'react'

class SignUp extends Component {
    render(){
        return  (
            <div className='access-card'>
                <h1>Sign up</h1>
                <button onClick= {(event) => this.props.login()}>Sign up</button>
            </div>
        );
    }
}
export default SignUp;