import React, {Component} from 'react'
import Browser from './browseProfile'
import Chats from './chats'
import Chat from './chat'
import Menu from './menu'
import PopUp from './popup'
import { auth } from '../comm/firebaseCredentials'


class GrokApp extends Component {
  constructor(){
    super();
    // The state is mainly used to show the web sections
    // and show popups
    this.state = {
        section: 'Browse',
        popup:{active:false, details:{}}
    }
    this.changeSection = this.changeSection.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.closePopup = this.closePopup.bind(this)
  }

  changeSection(section) {
    this.setState({section});
  }

  showPopup(active, details) { 
    this.setState(state => {
        let newState = {
          section: state.section, 
          popup: {active:active, details:details}
        }
        return newState
    });
  }
  closePopup(){
    this.setState({popup: {active: false, details: {}}})
  }
  /** Life cycle method that happens only the first time the component is called
   * Is useful to put API's calls
   */
  componentDidMount() {
  }
  /** This methods is called when the component disappears, good for cleaning */
  componentWillUnmount() {}

    /** This methods defines what to show in the component */
  render(){
    console.log(this.props)
    var displayedSection
    switch(this.state.section){
      case "Browse": 
          displayedSection = <Browser updatePopup ={this.showPopup} dbManager={this.props.dbManager} />
          break;
        case "Profile": 
        console.log("Profile")
          // displayedSection = <Profile />
          break;
        case "Chats": 
          displayedSection = <Chats dbManager={this.props.dbManager}/>
          break;
        case "Settings": 
          console.log("Settings")
          // displayedSection = <Settings />
          break;
        default:
    }

    return  (
        <div className="general-container">
            {this.state.popup.active && <PopUp details={this.state.popup.details} close={this.closePopup} />}
            < Menu changeSection = {this.changeSection} SignOut= {this.props.SignOut}/>
            {displayedSection}               
        </div>
    );
  }
}

export default GrokApp;
