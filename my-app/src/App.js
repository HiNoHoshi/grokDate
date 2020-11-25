import React ,{Component} from 'react'
import './App.css';
import Landing from './components/landing'
import Register from './components/register'
import GrokApp from './components/grok_app'

import firebase, { auth, provider } from './comm/firebaseCredentials.js';
import FirebaseManager from './comm/firebaseManager'

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
  

  // Check the authentication state at the beggining 
  // To keep the user looged in
  componentDidMount = () => {
    var unsubscribe = auth.onAuthStateChanged(userAuth => {
      this.setState({ user: userAuth});
      unsubscribe();
    });
    
};

  // When the state is updated, it brings the information about the user
  // from the database
  componentDidUpdate(prevProps, prevState) {
    if(!prevState.user  && this.state.user){
      let user = this.state.user
      fbManager.referenceUser(user.uid).then((result) =>{
        if (result){
          if(result.username){
            this.setState({user: user.email, userInfo: result});
          }
        }
      })
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

  // Sign in if the user exist, sign up otherwise
  signIn() {
    auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      this.setState({user})
      fbManager.referenceUser(user.uid, this)
      .then((ref) =>{
        if (!ref){
          // creates a new user if the user is not found
          fbManager.addUser(user)
        }
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
