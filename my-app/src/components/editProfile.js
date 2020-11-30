import React, {Component} from 'react'
import Form from './form'
import RegisterInterests from './registerInterests'

class EditProfile extends Component {
    constructor(){
        super();
        this.state = {
            input: {
                username: "",
                gender: "none",
                interest: "none",
                birthdate: "",
                country: "",
                city:"",
                description: ""
            },
            sending: false,
            communities: {},
            formActive: true,
            errors: {}  
        };
        this.formActive= true
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCommunities = this.updateCommunities.bind(this);
        this.changeTab = this.changeTab.bind(this);
        
    }

    componentDidMount() {
        this.setState({input: this.props.userInfo})
    }

    handleChange(event) {
        let input = this.state.input;
        const {name, value} = event.target
        input[name] = value;
        
        this.setState({
          input
        });
    }
    
    updateCommunities(communities){
        this.setState({communities})
    }
    changeTab(formActive){
        this.formActive = formActive
        // this.setState({formActive})
        console.log(formActive)
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.validate()){
            console.log(this.state.input)

            const infoUpdate = {
                username: this.state.input.username,
                country: this.state.input.country,
                city: this.state.input.city,
                interest: this.state.input.interest,
                description: this.state.input.description
            }
            // Let other components know the new info is been sent
            this.setState({sending:true}) 
            // Send the basic info of the user to the database
            this.props.dbManager.registerUserInfo(this.props.user.uid, infoUpdate).then(() =>{
                // sthis.props.setUserInfo();
            });
        }
        // this.setState({sending:false}) // Just for testing purpose
    }

    render(){
        return  (
        <div className="edit-container">
            <h2>Edit Profile</h2>
            <div>
                            <button className='secondary-button tab-button' className={this.state.formActive ? 'secondary-button tab-button selected': 'secondary-button tab-button'} onClick={() =>{this.setState({formActive: true})}}>Information </button>
                            <button className='secondary-button tab-button' className={!this.state.formActive ? 'secondary-button tab-button selected': 'secondary-button tab-button'} onClick={() =>{this.setState({formActive: false})}}>Interests </button>
                        </div>
            <div className= 'edit-info'>
            {this.state.formActive 
                ? <Form data={this.state} handleChange={this.handleChange} isEdit={true}/>
                : <RegisterInterests 
                    dbManager={this.props.dbManager} 
                    isEdit={true}
                    user={this.props.user} 
                    sending = {this.state.sending} 
                    updateCommunities={this.updateCommunities} 
                    error={this.state.errors.interests}/>
            }
            </div>
      
            

            <button onClick={this.handleSubmit}>Save Changes</button>
        </div>
        );
    }

    // Method to validate the registration inputs
    // Inspired by https://www.itsolutionstuff.com/post/username-and-password-validation-in-react-exampleexample.html
    validate(){
        let input = this.state.input;
        let communities = this.state.communities
        let errors = {};
        let isValid = true;
        
        // Checking username validity
        if (!input["username"]) {
            isValid = false;
            errors["username"] = "* Please enter a username.";
        }
        if (typeof input["username"] !== "undefined") {
            const re = /^\S*$/;
            if(input["username"].length < 6 || !re.test(input["username"])){
                isValid = false;
                errors["username"] = "* Please enter valid username.";
            }
        }
        // Checking gender validity
        if (input["gender"]==='none') {
            isValid = false;
            errors["gender"] = "* Please select your gender.";
        }
        // Checking interest validity
        if (input["interest"]==='none') {
            isValid = false;
            errors["interest"] = "* Please select your love interest.";
        }
        // Checking age validity
        if (input["birthdate"] !== "") {
            const birthYear = input["birthdate"].split('-')[0]
            const currentYear = new Date().getFullYear()
            if(birthYear > (currentYear-18)){
                isValid = false;
                errors["birthdate"] = "* You are too young for this.";
            }else if(birthYear < (currentYear-99)){
                isValid = false;
                errors["birthdate"] = "* Please enter a valid birthdate (you can't be this old).";
            }
        }else{
            isValid = false;
            errors["birthdate"] = "* Please enter your birthdate.";
        }
        // Checking description validity
        if (!input["description"]) {
            isValid = false;
            errors["description"] = "* Please say something about yourself.";
        }
        // Checking country vality
        if (!input["country"]) {
            isValid = false;
            errors["country"] = "* Please select your country.";
        }
        // Checking city vality
        if (!input["city"]) {
            isValid = false;
            errors["city"] = "* Please select your city.";
        }
        // if(Object.entries(communities).length === 0){
        //     isValid = false;
        //     errors["interests"] = "* Please sychronize at least one of your interests.";
        // }else{
        //     let allHidden = true
        //     for(var c in communities){
        //         if(communities[c].is_visible){
        //             allHidden = false
        //         }
        //     }
        //     if(allHidden){
        //         isValid = false;
        //         errors["interests"] = "* Please make at least on interest visible";
        //     }
        // }
        this.setState({errors: errors});
        console.log(errors)
        return isValid;
    }


}
export default EditProfile;