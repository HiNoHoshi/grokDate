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
                    name:'r/PS5',
                    is_favorite: true,
                    is_visible: true
                },
                {
                    name:'r/UIUC',
                    is_favorite: false,
                    is_visible: true
                },
                {
                    name:'r/oddlysatisfying',
                    is_favorite: false,
                    is_visible: false
                },
                {
                    name:'r/trashpandas',
                    is_favorite: false,
                    is_visible: true
                }
        ],
            youtube: [],
            steam: []
        }
    }

    render(){
        const allTags = this.state.reddit.map(sub =><TagItem key= {sub.name} name = {sub.name} editable= {true} is-visible = {sub.is_visible}/>)

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
                        {allTags}
                        {/* < TagItem name = "r/UIUC" editable = {true}/>
                        < TagItem name = "r/aww"/>
                        < TagItem name = "r/dataisbeautiful"/> */}
                        
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