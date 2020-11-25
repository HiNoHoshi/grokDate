import React, {Component} from 'react'
import TagItem from './tagItem'
import ArrowButton from "./arrow_button"
import LinkReddit from './linkReddit'

class RegisterInterests extends Component {
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
        // this.changeCard = this.changeCard.bind(this)
    }
    render(){
        return  (
            <div className= 'register-interest'>
                <h2>Your Interests.</h2>
                <div className= 'synchronize-interests'>
                    <div className= "sub-interests">
                        <h3>Communities</h3>
                        <LinkReddit
                            key={'reddit'} 
                            name={'Reddit'} 
                            img={'https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png'}
                            dbManager={this.props.dbManager}
                            user={this.props.user}
                        />
                        <br></br>
                        <div className = "dropping-area">
                            <span>Drag your favorite here</span>
                        </div>
                        < TagItem name = "r/UIUC"/>
                        < TagItem name = "r/aww"/>
                        < TagItem name = "r/dataisbeautiful"/>
                    </div>
                </div>
                < ArrowButton direction = 'Back'/>
                < ArrowButton direction = 'Next'/>
                
             </div>
        );
    }
}
export default RegisterInterests;