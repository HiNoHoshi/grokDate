import React, {Component} from 'react'
import TagItem from './tagItem'
import LinkReddit from './linkReddit'

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
                <h2>Your Interests.</h2>
                <div className= 'synchronize-interests'>
                    <div className= "sub-interests">
                        <h3>Communities</h3>
                        <LinkReddit
                            key={'reddit'} 
                            name={'Reddit'} 
                            img={'https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png'}
                            dbManager={this.props.dbManager}
                            user={this.props.user}
                        />
                        <br></br>
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