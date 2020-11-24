import React ,{Component} from 'react'
import './App.css';
import Landing from './components/landing'
import Register from './components/register'
import GrokApp from './components/grok_app'

import firebase, { auth, provider } from './comm/firebaseCredentials.js';
import FirebaseManager from './comm/firebaseManager'
import { useAuthState } from 'react-firebase-hooks/auth';

const firestore = firebase.firestore();
const fbManager = new FirebaseManager(firestore)


class App extends Component {
  constructor() {
    super();
    console.log('app constructed')
    this.state = {
      currentScreen: '',
      userInfo: {username: false},
      user: null 
    }
    this.signIn = this.signIn.bind(this); 
    this.signOut = this.signOut.bind(this); 
    this.setUserInfo = this.setUserInfo.bind(this); 
  }
  

  
  // To keep the ser looged in
  componentDidMount() {
    // this.signOut()
    console.log(firebase.auth().currentUser)
    if(firebase.auth().currentUser){
      this.setState({user: firebase.auth().currentUser})
      }
    
    
    // auth.onAuthStateChanged((u) => {
    //   if (u && !this.state.user) {
    //     console.log(this.estate)
    //     // this.setState({user})
    //     user = u;
    //   }
    // });
    // this.setState({user})
  }


  // When the state is updated
  componentDidUpdate(prevProps, prevState) {
    console.log("State updated")

    if(!prevState.user  && this.state.user){
      let user = this.state.user
      console.log("just identified an user")
      fbManager.referenceUser(user.uid).then((result) =>{
        if (result){
          console.log(result)
          if(result.username){
            this.setState({user: user.email, userInfo: result});
          }
        }
      })
      console.log("End referencing user")
    }
  }

  // For clean up your code before the component disappear
  componentWillUnmount() {}

  render() {
    var screen

    if (!this.state.user){
      screen = <Landing SignIn = {this.signIn}/>
    }else{
      console.log(this.state)  
      if(this.state.userInfo.username){
        screen = <GrokApp SignOut = {this.signOut} dbManager = {fbManager}/>
      }else{
        screen = <Register user = {this.state.user} dbManager = {fbManager} setUserInfo = {this.setUserInfo} />
      }
    }
  
    return (
      <div className="App-container">
        {screen}
      </div>
    );
  }
  signIn() {
    auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      this.setState({user})
      console.log("Login with:");
      console.log(user.email);
      fbManager.referenceUser(user.uid, this)
      .then((ref) =>{
        console.log(ref)
        if (!ref){
          console.log('creating new user')
          fbManager.addUser(user)
        }
        console.log("End login")
      })

    });
  }
  
  signOut() {
    auth.signOut()
    this.setState = {
      currentScreen: '',
      userInfo: {username: false},
      user: null 
    }
  }

  setUserInfo(){
    console.log(this.state)  
    fbManager.getUserInfo(this.state.user.uid).then((uInfo) =>{
      this.setState({userInfo: uInfo})
      console.log(this.state)   
    })

  }
}



export default App;
