import React, {Component} from 'react'
import Browser from './browseProfile'
import Menu from './menu'
// import PopUp from './popup'


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
    this.updatePopup = this.updatePopup(this)
  }

  changeSection(section) {
    console.log(this.state)
    this.setState({section});
  }
  // TODO: anable popup
  updatePopup(active, details) { 
    this.setState(state => {
        let newState = {
          section: state.section, 
          popup: {active:active, details:details}
        }
        return newState
    });
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
    console.log(this.updatePopup)
    switch(this.state.section){
      case "Browse": 
          displayedSection = <Browser updatePopup ={this.updatePopup}/>
          break;
        case "Profile": 
        console.log("Profile")
          // displayedSection = <Profile />
          break;
        case "Chats": 
          console.log("chat")
          // displayedSection = <Chats />
          break;
        case "Settings": 
          console.log("Settings")
          // displayedSection = <Settings />
          break;
        default:
    }

    return  (
        <div className="general-container">
            {/* {this.popup.active && <PopUp details={this.popup.details} />} */}
            < Menu changeSection = {this.changeSection} SignOut= {this.props.SignOut}/>
            {displayedSection}               
        </div>
    );
  }
}

export default GrokApp;
