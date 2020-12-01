import React, {Component} from 'react'
import Browser from './browseProfile'
import MyProfile from './profile'
import Chats from './chats'
import Settings from './settings'

import Menu from './menu'
import PopUp from './popup'


class GrokApp extends Component {
  constructor(){
    super();
    // The state is mainly used to show the web sections
    // and show popups
    this.state = {
        section: 'Browse',
        popup:{
          active:false, 
          type: null,
          details: {}
        }
    }
    this.changeSection = this.changeSection.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.closePopup = this.closePopup.bind(this)
  }

  changeSection(section) {
    this.setState({section});
  }

  showPopup(active, type, details) { 
    this.setState(state => {
        let newState = {
          section: state.section, 
          popup: {active, type, details}
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
    var displayedSection
    switch(this.state.section){
      case "Browse": 
          displayedSection = <Browser updatePopup ={this.showPopup} dbManager={this.props.dbManager} />
          break;
        case "Profile": 
          displayedSection = <MyProfile updatePopup ={this.showPopup} dbManager={this.props.dbManager}/>
          break;
        case "Chats": 
          displayedSection = <Chats dbManager={this.props.dbManager}/>
          break;
        case "Settings": 
          displayedSection = <Settings  dbManager={this.props.dbManager} SignOut= {this.props.SignOut}/>
          break;
        default:
    }

    return  (
        <div className="general-container">
            {this.state.popup.active && <PopUp type = {this.state.popup.type} details={this.state.popup.details} close={this.closePopup} dbManager={this.props.dbManager} />}
            < Menu changeSection = {this.changeSection} SignOut= {this.props.SignOut}/>
            {displayedSection}               
        </div>
    );
  }
}

export default GrokApp;
