import React, {Component} from 'react'
import {REDDIT} from '../comm/common.js'

class LinkReddit extends Component {
    constructor(){
        super();
        this.tryUserAuth = this.tryUserAuth.bind(this);
        this.handleRedirectURI = this.handleRedirectURI.bind(this);
        this.requestAccessToken = this.requestAccessToken.bind(this);
        this.tryGetCommunityInfo = this.tryGetCommunityInfo.bind(this);
        this.json = this.json.bind(this);
        this.status = this.status.bind(this);
        this.parseSubreddits = this.parseSubreddits.bind(this);
    }

    componentDidMount() {
        this.handleRedirectURI();
    }
    
    render() {
        return  (
            <div className= 'content-container'>
                <button onClick={this.tryUserAuth}>
                  <img 
                    alt={this.props.name + " logo"} 
                    className="platform-icon" 
                    src={this.props.img}
                  >
                  </img>  Link to {this.props.name}
                </button>
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
            this.tryGetCommunityInfo(token);
          }).catch(function (err) {
            console.log('Error: ' + err);
          });
      }
  
      // Get the user's community info
      tryGetCommunityInfo(token) {
        if (token) {
          fetch('https://oauth.reddit.com/subreddits/mine/subscriber', {
            method: 'GET',
            headers: {
              'Authorization': 'bearer ' + token,
            }
          }).then(this.status).then(this.json)
          .then((respJSON) => {
            var subreddits = respJSON["data"]["children"]
            this.parseSubreddits(subreddits);
            window.location.href = REDDIT.TERMINAL_URI
          }).catch(function (err) {
            console.log('Error: Failed to get subreddits:', err)
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
        subreddit_list.forEach((item, index) => {
            var data = item.data
            var subreddit_info = {
                'banner_color': data.banner_background_color, // || '#33a8ff',
                'banner_img': (data.banner_background_image || '').split('?')[0],
                'description': data.public_description,
                'display_name': data.display_name,
                'display_name_prefixed': data.display_name_prefixed,
                'icon': (data.communityIcon || data.icon_img || '../images/external/subreddit_default_icon.png').split('?')[0],
                'link': 'http://www.reddit.com' + data.url,
                'primary_color': data.primary_color || data.key_color || '#0079d3',
                'subscribers': data.subscribers,
                'title': data.title,
                'type': data.subreddit_type,
            };
            this.props.dbManager.registerSubredditInfo(data.display_name, subreddit_info)
            var user_subreddit = {
              'is_favorite': false,
              'is_reddit_favorite': data.user_has_favorited,
              'subreddit_ref': this.props.dbManager.subredditRef.doc(data.display_name),
              'is_visible': true,
            }
            this.props.dbManager.registerUserSubreddit(data.display_name, user_subreddit, this.props.user)
        });
      }
}
export default LinkReddit;