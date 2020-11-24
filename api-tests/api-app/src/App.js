import React, {Component} from 'react'
import './App.css';

import LinkPlatform from './components/LinkPlatform.js'

import firebase, { auth, provider } from './common/firebaseCredentials.js';
import FirebaseManager from './common/firebaseManager'

const firestore = firebase.firestore();
const fbManager = new FirebaseManager(firestore)

class App extends React.Component {
  render () {
    return (<LinkPlatform 
      key={'reddit'} 
      name={'Reddit'} 
      img={'https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png'}
      dbManager={fbManager}
    />)
  }
}

export default App;
