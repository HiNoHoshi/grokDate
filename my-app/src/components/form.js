import React, {Component} from 'react'

class Form extends Component {
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
            <div className= 'register-info'>
                <h2>Profile Information.</h2>
                <div className = 'row'>
                    <div className= "item">
                        <h4>Nickname</h4>
                        <input type="text" id="nickname" placeholder="Nickname"></input>    
                    </div>
                </div>
                <div className = 'row'>
                    <div className= "item">
                        <h4>birthdate</h4>
                        <input type="date" placeholder="mm/dd/yyyy" id= "birthdate"></input>    
                    </div>
                    <div className= "item">
                        <h4>Location</h4>
                        <input type="text" id="country" placeholder="Country"></input>
                        <input type="text" id="city" placeholder="City"></input>
                    </div>
                </div>
                <div className = 'row'>
                    <div className= "item">
                        <h4>Gender</h4>               
                        <select name="Gender" id="gender" placeholder="Your Gender">
                            <option value ="" disable selected>Select your gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Female Trans">Female Trans</option>
                            <option value="Male Trans">Male Trans</option>
                        </select>
                    </div>
                    <div className= "item">
                        <h4>Looking for</h4>          
                        <select name="looking" id="looking" placeholder="Love interest">
                            <option value ="" disable selected>Select your love interest</option>
                            <option value="Female">Woman</option>
                            <option value="Male">Man</option>
                            <option value="Female Trans">Woman or Man</option>
                        </select>
                    </div>
                </div>
                <div className = 'row'>
                    <div className= "item">
                        <h4>Description</h4>          
                        <textarea type="text" id="description" placeholder="Say something about you..."></textarea>
                    </div>
                </div>
            </div>
        );
    }
}
export default Form;