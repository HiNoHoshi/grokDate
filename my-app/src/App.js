import React ,{Component} from 'react'
import './App.css';
import Landing from './components/landing'
import Register from './components/register'
import GrokApp from './components/grok_app'

import firebase, { auth, provider } from './comm/firebaseCredentials.js';
import FirebaseManager from './comm/firebaseManager'
// import { useAuthState } from 'react-firebase-hooks/auth';

const firestore = firebase.firestore();
const fbManager = new FirebaseManager(firestore)


class App extends Component {
  constructor() {
    super();
    this.state = {
      currentScreen: '',
      userInfo: {username: false},
      user: null 
    }
    this.baseState = this.state
    this.signIn = this.signIn.bind(this); 
    this.signOut = this.signOut.bind(this); 
    this.setUserInfo = this.setUserInfo.bind(this); 
  }
  

  // To keep the ser looged in
  componentDidMount = () => {
    var unsubscribe = auth.onAuthStateChanged(userAuth => {
      this.setState({ user: userAuth});
      unsubscribe();
    });
    
};

  // When the state is updated
  componentDidUpdate(prevProps, prevState) {
    console.log("State updated")
    console.log(this.state)

    if(!prevState.user  && this.state.user){
      let user = this.state.user
      console.log("just identified an user")
      fbManager.referenceUser(user.uid).then((result) =>{
        if (result){
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
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      // auth.setPersistence(auth.Auth.Persistence.SESSION)
      const user = result.user;
      this.setState({user})
      console.log("Login with:");
      console.log(user.email);
      fbManager.referenceUser(user.uid, this)
      .then((ref) =>{
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
    this.setState(this.baseState)
  }

  setUserInfo(){
    fbManager.getUserInfo(this.state.user.uid).then((uInfo) =>{
      this.setState({userInfo: uInfo})
    })
  }
}



export default App;
