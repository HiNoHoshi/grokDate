import React, {Component} from 'react'
import './App.css';
import Landing from './components/landing'
import Register from './components/register'
import Browser from './components/browseProfile'




class App extends Component {
  constructor(){
    super();
    this.state = {
        section: 'landing'
    }
    this.changeSection = this.changeSection.bind(this)
  }

  changeSection(section) {
    console.log(this.state)
    this.setState(state => {
        let newState = {section: section}
        return newState
    });
  }
  /** Life cycle method that happens only the first time the component is called
   * Is useful to put API's calls
   */
  componentDidMount() {}
  /** This methods is called when the component disappears, good for cleaning */
  componentWillUnmount() {}

    /** This methods defines what to show in the component */
  render(){
    var displayedSection
    switch(this.state.section){
      case "landing":
        displayedSection = <Landing changeSection = {this.changeSection} />
        break;
      case "register":
          displayedSection = <Register changeSection = {this.changeSection} />
          break;
      case "browsing": 
        displayedSection = <Browser />
        break;
    }


    return  (
      <div className="App-container">
        {displayedSection}
      </div>
    );
  }
}

export default App;
