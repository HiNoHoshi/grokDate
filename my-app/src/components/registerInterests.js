import React, {Component} from 'react'
import TagItem from './tagItem'
import ArrowButton from "./arrow_button"

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
                <h2>Your Intrests.</h2>
                <div className= 'synchronize-interests'>
                    <div className= "sub-interests">
                        <h3>Communities</h3>
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