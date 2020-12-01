import React, {Component} from 'react'

class Tooltip extends Component {

    constructor(props){
        super(props);
        this.state = {
            doShow: "hide"
        }
      }

    toggleShow = () => {
        if(this.state.doShow === "hide"){
            this.setState({
                doShow: "show"
            });
        }
        else{
            this.setState({
                doShow: "hide"
            });
        }
    }

    render(props){
        return  (
            <div id="tooltip" className={this.state.doShow}>
                <div className="tooltip-label">This curation score shows you the number of subreddits this user has chosen to show on their profile out of the ones they are subscribed to</div>
            </div>
        );
    }
}

export default Tooltip;