import React, {Component} from 'react'
import TagItem from './tagItem'
import LinkReddit from './linkReddit'
import redditLogo from '../images/logos/reddit_logo_white.png'
import DragAndDrop from './dragAndDrop'

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
            // const allTags = this.state.reddit.map(sub =><TagItem name = {sub.name} editable= {true}/>)

        return  (
            <div className= 'register-interest'>
                <h2>Your Interests.</h2>
                <div className= 'synchronize-interests'>
                    <div className= "sub-interests">
                        <div className= 'interests-nav'>
                            <button className='secondary-button tab-button' disabled>Channels </button>
                            <button className='secondary-button tab-button' active = "true">Communities </button>
                            <button className='secondary-button tab-button' disabled>Games </button>
                        </div>
                        
                        <DragAndDrop />

                        < TagItem name = "r/UIUC" editable = {true}/>
                        < TagItem name = "r/aww"/>
                        < TagItem name = "r/dataisbeautiful"/>
                        
                        <LinkReddit
                            key={'reddit'} 
                            name={'Reddit'} 
                            img={redditLogo}
                            dbManager={this.props.dbManager}
                            user={this.props.user}
                        />
                    </div>
                </div>
             </div>
        );
    }
}
export default RegisterInterests;