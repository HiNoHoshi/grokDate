import React, {Component} from 'react'
import TagItem from './tagItem'
import LinkReddit from './linkReddit'
import redditLogo from '../images/logos/reddit_logo_white.png'
import DragAndDrop from './dragAndDrop'

class RegisterInterests extends Component {
    constructor(){
        
        super();
        this.state = {
            selectededTag : null,
            favorite: null,
            subReddits: {},
            redditFav: null,
            channels: {},
            games: {}
        }
        this.selectTag = this.selectTag.bind(this);
        this.loadSubs = this.loadSubs.bind(this);
        this.updateTagVisibility = this.updateTagVisibility.bind(this);
        this.setFavorite = this.setFavorite.bind(this);

    }


    // Adds a listener that calls loadSubs when the database is updated
    componentDidMount () {
        this.props.dbManager.listenToRedditSynch(this.props.user.uid, this.loadSubs)
    }
    // Adds the subreddits to the component state
    loadSubs(subReddits){
        this.setState({subReddits});
        this.props.updateCommunities(subReddits)
    }

    // Change the visibility of a subredding in the component state
    updateTagVisibility(sub){
        this.setState(state => {
            const refSub = state.subReddits[sub]
                
            let tempSubs = {...state.subReddits,
                [sub]:{...refSub,
                    is_visible: !refSub.is_visible
                }
            }
            return {subReddits: tempSubs}
        });
    }


    // When the state is updated, it brings the information about the user
    // from the database
    componentDidUpdate(prevProps, prevState) {
        if(!prevProps.sending && this.props.sending){
            // send the subreddit's info to the database
            this.props.dbManager.updateUserCommunities(this.props.user.uid, this.state.subReddits, this.state.redditFav)
        }
        if(prevState.subReddits !== this.state.subReddits){
            this.props.updateCommunities(this.state.subReddits)
        }
    }

    // Method to select a specific tag if dragged
    selectTag(tag){
        this.setState({selectededTag: tag})
    }

    // Set the favorite sub in the component state
    setFavorite(redditFav){
        this.setState({redditFav})
    }


    render(){
        var allTags
        if(this.state.subReddits){       
            allTags = Object.keys(this.state.subReddits).map(sub => this.state.redditFav !== sub && 
            <TagItem key= {sub} 
                name = {sub} 
                editable= {true} 
                is-visible = {this.state.subReddits[sub].is_visible} 
                selectTag = {this.selectTag}
                updateVisibility = {this.updateTagVisibility}/>
            );

        }
        
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
                        
                        <DragAndDrop 
                            fav = {this.state.selectededTag} 
                            setFavorite = {this.setFavorite}
                            selectTag = {this.selectTag} />
                        <div style= {{ height: '100%', maxHeight: '9em', overflowY: 'scroll' }}>
                        {allTags}
                        </div>
                        
                        {Object.entries(this.state.subReddits).length === 0 && 
                            <LinkReddit
                                key={'reddit'} 
                                name={'Reddit'} 
                                img={redditLogo}
                                dbManager={this.props.dbManager}
                                user={this.props.user}

                            />
                        }
                        
                    </div>
                </div>
                <div className="form-error">{this.props.error}</div>
             </div>
        );
    }
}
export default RegisterInterests;