import React, {Component} from 'react'
import Form from './form'
import RegisterInterests from './registerInterests'
import PictureUploader from './pictureUploader'
import {storage } from '../comm/firebaseCredentials'
import loader from '../images/icons/loader.png'


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
            picture: null,
            pictureURL: null,
            activeTab: 'picture',
            errors: {}  
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCommunities = this.updateCommunities.bind(this);
        this.updatePicture = this.updatePicture.bind(this);
        this.setPictureURL = this.setPictureURL.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidMount() {
        this.setState({input: this.props.userInfo})
        // TODO: manage edition with previous picture
        // this.setState({pictureURL: this.props.pictureURL})
    }

    handleChange(event) {
        let input = this.state.input;
        const {name, value} = event.target
        input[name] = value;
        this.setState({input});
    }
    
    updateCommunities(communities){
        this.setState({communities})
    }
    updatePicture(picture){
        this.setState({picture})
    }
    setPictureURL(pictureURL){
        this.setState({pictureURL})
    }
    updateProfile(infoUpdate){
        // Send the basic info of the user to the database
        this.props.dbManager.registerUserInfo(this.props.user.uid, infoUpdate).then(() =>{
                this.props.updateProfile({infoUpdate, communities:this.state.communities})
                this.props.close();
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        if(this.validate()){
            // Let other components know the new info is been sent
            this.setState({sending:true}) 
            
            var infoUpdate = {
                username: this.state.input.username,
                country: this.state.input.country,
                city: this.state.input.city,
                interest: this.state.input.interest,
                description: this.state.input.description
            }

            if(this.state.picture){
                let name = this.props.user.uid+':'+this.state.picture.name
                const uploadTask = storage.ref(`/profile_pics/${name}`).put(this.state.picture)
                //initiates the firebase side uploading 
                uploadTask.on('state_changed', (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    console.log(snapShot)
                }, (err) => {
                    //catches the errors
                    console.log(err)
                }, () => {
                    storage.ref('profile_pics').child(name).getDownloadURL()
                        .then(fireBaseUrl => {
                            infoUpdate.pictureURL = fireBaseUrl;
                            this.updateProfile(infoUpdate)
                        })
                    })
            }else{
                this.updateProfile(infoUpdate)
            }
        }
    }

    render(){
        const hidestyle = {display:'none'}
        const showStyle = {display:'block'}
        return  (
        <div className="edit-container">
            <h2>Edit Profile</h2>
            <div className='loader-container'  style = {this.state.sending ? showStyle : hidestyle}>
                <img src = {loader} className='loader' alt='loading'/>
            </div>
            <div style = {this.state.sending ? hidestyle : showStyle}>
                <div>
                    <button className={this.state.activeTab === 'picture' ? 'secondary-button tab-button selected': 'secondary-button tab-button'} onClick={() =>{this.setState({activeTab: 'picture'})}}>Picture</button>
                    <button className={this.state.activeTab === 'information' ? 'secondary-button tab-button selected': 'secondary-button tab-button'} onClick={() =>{this.setState({activeTab: 'information'})}}>Information</button>
                    <button className={this.state.activeTab === 'interests' ? 'secondary-button tab-button selected': 'secondary-button tab-button'} onClick={() =>{this.setState({activeTab: 'interests'})}}>Interests</button>
                </div>
                <div className= 'edit-info'>

                    <PictureUploader data={this.state}
                        updatePicture={this.updatePicture} 
                        active = {this.state.activeTab === 'picture'}/>

                    <Form data={this.state} 
                        handleChange={this.handleChange} 
                        isEdit={true}
                        active = {this.state.activeTab === 'information'}/>

                    <RegisterInterests 
                        dbManager={this.props.dbManager} 
                        isEdit={true}
                        user={this.props.user} 
                        sending = {this.state.sending} 
                        updateCommunities={this.updateCommunities} 
                        error={this.state.errors.interests}
                        active = {this.state.activeTab === 'interests'}/>
                </div>  

            </div>
            <button onClick={this.handleSubmit} disabled = {this.state.loading}>Save Changes</button>
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
        if(Object.entries(communities).length === 0){
            isValid = false;
            errors["interests"] = "* Please sychronize at least one of your interests.";
        }else{
            let allHidden = true
            for(var c in communities){
                if(communities[c].is_visible){
                    allHidden = false
                }
            }
            if(allHidden){
                isValid = false;
                errors["interests"] = "* Please make at least on interest visible";
            }
        }
        this.setState({errors: errors});
        return isValid;
    }


}
export default EditProfile;