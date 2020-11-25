import React, {Component} from 'react'
import TagItem from './tagItem'

class RegisterInterests extends Component {
    constructor(){
        
        super();
        this.state = {
            reddit: [
                {
                    name:'r/PS4',
                    favorite: true,
                    visible: true
                },
                {
                    name:'r/UIUC',
                    favorite: false,
                    visible: true
                },
                {
                    name:'r/oddlysatisfying',
                    favorite: false,
                    visible: false
                },
                {
                    name:'r/trashpandas',
                    favorite: false,
                    visible: true
                }
        ],
            youtube: [],
            steam: []
        }
    }

    render(){
            const allTags = this.state.reddit.map(sub =><TagItem name = {sub.name} editable= {true}/>)

        return  (
            <div className= 'register-interest'>
                <h2>Your Intrests.</h2>
                <div className= 'synchronize-interests'>
                    <div className= "sub-interests">
                        <h3>Communities</h3>
                        <div className = "dropping-area">
                            <span>Drag your favorite here</span>
                        </div>
                        < TagItem name = "r/UIUC"/>
                        < TagItem name = "r/aww"/>
                        < TagItem name = "r/dataisbeautiful"/>
                    </div>
                </div>
             </div>
        );
    }
}
export default RegisterInterests;