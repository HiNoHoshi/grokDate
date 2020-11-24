import React, {Component} from 'react'
import {REDDIT} from '../common.js'
import FirebaseManager from '../common/firebaseManager.js';

class LinkPlatform extends Component {
    constructor(){
        super();
        this.state = {popup: false}
        this.currentUser = "darcipeeps"
        // this.showIB = this.showIB.bind(this);
        this.tryUserAuth = this.tryUserAuth.bind(this);
        this.handleRedirectURI = this.handleRedirectURI.bind(this);
        this.requestAccessToken = this.requestAccessToken.bind(this);
        this.tryGetCommunityInfo = this.tryGetCommunityInfo.bind(this);
        this.json = this.json.bind(this);
        this.status = this.status.bind(this);
        this.parseSubreddits = this.parseSubreddits.bind(this);
    }

    // showIB(){
    //     this.setState(state => {
    //         let newState = {popup: !this.state.popup}
    //         return newState
    //     });
    //     console.log(this.state)

    // }

    componentDidMount() {
        this.handleRedirectURI();
    }
    
    render() {
        console.log(this.props)
        // const users = Users.map(user => <PCard key={user.username} username={user.username} info={user.info} />)
        return  (
            <div className= 'content-container'>
                {/* <button onClick={()=>{this.props.updatePopup(true,{})}}>Link to {this.props.community.name}</button> */}
                <button onClick={this.tryUserAuth}><img alt={this.props.name + " logo"} className="platform-icon" src={this.props.img}></img>  Link to {this.props.name}</button>
            </div>
        );
    }

    // Send user to authorization URL to get (mysubreddits) permission
    tryUserAuth() {
        var auth_url = new URL('https://www.reddit.com/api/v1/authorize');
        auth_url.search = new URLSearchParams({
          client_id: REDDIT.APP_ID,
          response_type: 'code',
          state: REDDIT.STATE,
          redirect_uri: REDDIT.APP_REDIRECT,
          duration: 'temporary',
          scope: REDDIT.SCOPE
        });
        console.log(auth_url)
  
        // Once user accepts/declines, handleRedirectURI() is called
        window.location.href = auth_url
      }
  
      // Check if Reddit redirected user back to us
      handleRedirectURI() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('state') === REDDIT.STATE) {
            var code = urlParams.get('code')
            var error = urlParams.get('error')
            if (code) {
                console.log(code)
                this.requestAccessToken(code)
            } else if (error) {
                console.log("Error: " + error)
                window.location.href = REDDIT.TERMINAL_URI
            }
        }
      }
  
      requestAccessToken(code) {
        var data = (new URLSearchParams({
          'grant_type': 'authorization_code',
          'code': code,
          'redirect_uri': REDDIT.APP_REDIRECT,
        })).toString();
  
        fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(REDDIT.APP_ID + ":" + REDDIT.APP_SECRET),
            },
            body: data,
          }).then(this.status).then(this.json)
          .then((responseJSON) => {
            var token = responseJSON.access_token
            console.log("token: " + token)
            this.tryGetCommunityInfo(token);
          }).catch(function (err) {
            console.log('Error: ' + err);
          });
      }
  
      // Get the user's community info
      tryGetCommunityInfo(token) {
        if (token) {
          console.log(token)
          fetch('https://oauth.reddit.com/subreddits/mine/subscriber', {
            method: 'GET',
            headers: {
              'Authorization': 'bearer ' + token,
            }
          }).then(this.status).then(this.json)
          .then((respJSON) => {
            var subreddits = respJSON["data"]["children"]
            console.log(subreddits);
            // Comment out below if you want to see subreddit list
            // TODO: store into database :D
            this.parseSubreddits(subreddits);
            // window.location.href = REDDIT.TERMINAL_URI
          }).catch(function (err) {
            console.log('Error, Failed to get subreddits:', err)
          });
        }
      }
  
      json(response) {
        return response.json();
      }
  
      status(response) {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response)
        } else {
          return Promise.reject(new Error(response.statusText))
        }
      }

      parseSubreddits(subreddit_list) { 
        var subreddit_map = []
        subreddit_list.forEach((item, index) => {
            var data = item.data
            var subreddit_info = {
                'banner_color': data.banner_background_color, // || '#33a8ff',
                'banner_img': (data.banner_background_image || '').split('?')[0],
                'description': data.public_description,
                'display_name': data.display_name,
                'display_name_prefixed': data.display_name_prefixed,
                'icon': (data.communityIcon || data.icon_img || '../img/subreddit_default_icon.png').split('?')[0],
                'link': 'http://www.reddit.com' + data.url,
                'primary_color': data.primary_color || data.key_color || '#0079d3',
                'subscribers': data.subscribers,
                'title': data.title,
                'type': data.subreddit_type,
            };
            this.props.dbManager.registerSubredditInfo(data.display_name, subreddit_info)
        });
        console.log(subreddit_map)
        return true
      }
}
export default LinkPlatform;