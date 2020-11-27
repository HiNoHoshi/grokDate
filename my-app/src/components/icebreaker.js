import React, {Component} from 'react'
import Posts from '../postsDB'
import ArrowButton from "./arrow_button"
import Post from "./post"
import {REDDIT} from '../comm/common.js'

class Icebreaker extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            subreddit_idx: 0,
            post_idx: 0,
            icebreakers: [], // E.g [['UIUC', 'r/UIUC is both of your favorites!', [posts...]]]
        }
        this._isMounted = false
        this.prevSubreddit = this.prevSubreddit.bind(this)
        this.nextSubreddit = this.nextSubreddit.bind(this)
    }

    //  Example to call Reddit API right after the icebreaker appears
    componentDidMount() {
        this._isMounted = true;
        this.calcIcebreakerSubOrdering().then((subOrdering) => {
            this.fetchSubredditsTopPosts(subOrdering).then((topPosts) => {
                topPosts = this.reduceDicts(topPosts)
                // Combine the stuff. E.g.
                // subOrdering = [{'name': 'UIUC', 'reason': 'r/UIUC is your fav!'}, ]
                // topPosts = {'UIUC': [{'author': 'neil', 'title': 'Welcome!', }], }
                // ==> icebreakers = [{'subreddit': 'UIUC', 'reason': 'r/UIUC is your fav!', 'topPosts': [{'author': 'neil', 'title': 'Welcome!', },]}, ]
                var icebreakers = []
                for (let subreddit of subOrdering) {
                    icebreakers.push(
                        {
                            name: subreddit.name,
                            reason: subreddit.reason,
                            topPosts: topPosts[subreddit.name],
                        }
                    )
                }
                console.log(subOrdering)
                console.log(topPosts)
                console.log(icebreakers)

                if (this._isMounted) {
                    this.setState({
                        icebreakers: icebreakers, 
                        loading: false, 
                        subreddit_idx: 0
                    })
                }
            })
        
            // Here the state should be updated with the post fetched in order to
            // automatically display it in the component and after getting the data we will
            // need to change the loading attr to false
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    prevSubreddit(){
        this.setState(state => {
            return {subreddit_idx: state.subreddit_idx - 1}
        });
    }

    nextSubreddit(){
        this.setState(state => {
            return {subreddit_idx: state.subreddit_idx + 1}
        });
    }

    render() {
        const posts = Posts.map(post => <Post key={post.id} subreddit={post.subreddit} postText={post.postText}/>)
        return (
            <div className='icebreaker'>
                <h2>Choose an Icebreaker for <a href='/#'>{this.props.username}</a></h2>
                <select>
                    <option value="Did you see this?">Did you see this?</option>
                    <option value="What do you think about this?">What do you think about this?</option>
                </select>
                {this.state.loading ? <div className="post-container">Loading posts...</div> : posts}
                <div className='profile-nav'>
                    <ArrowButton 
                        active={this.state.subreddit_idx > 0} 
                        direction = 'Back' change = {this.prevSubreddit}
                    />
                    <button>Send message</button>
                    <ArrowButton 
                        active={this.state.subreddit_idx < this.state.icebreakers.length - 1} 
                        direction = 'Next'change = {this.nextSubreddit}
                    />
                </div>
            </div>
        );
    }


    // Return only the subreddits that are favorited on our app
    filterFavorites(subs) {
        var filtered = {}
        for (const [name, info] of Object.entries(subs)) {
            if (info.is_favorite) {
                filtered[name] = info
            }
        }
        return filtered
    }

    // Returns the names of the subreddits in decending order of popularity
    sortPopular(subs) {
        var sorted = []
        var subPopularity = [];
        for (let name in subs) 
            subPopularity.push([name, subs[name].subreddit.subscribers]);
        subPopularity.sort((a, b) => {
            a = a[1];
            b = b[1];
            return a > b ? -1 : (a < b ? 1 : 0);
        });

        for (let i = 0; i < subPopularity.length; i++) {
            var name = subPopularity[i][0];
            sorted.push(name)
        }
        return sorted
    }

    // Returns the subreddits that are subbed to by both people
    filterIntersect(subsA, subsB) {
        var intersect = {}
        for (let name in subsA) {
            var info = subsA[name]
            if (name in subsB || subsB.hasOwnProperty(name)) {
                intersect[name] = info
            }
        }
        return intersect
    }

    // Returns the subreddits that are subbed to by either person
    filterUnion(subsA, subsB) {
        var union = {}
        for (let name in subsA) {
            let info = subsA[name]
            union[name] = info
        }
        for (let name in subsB) {
            let info = subsB[name]
            union[name] = info
        }
        return union
    }

    // Returns the name of a subreddit & the reason it was suggested
    addSubsWithReason(subs, reason, limit = -1) {
        var sorted = this.sortPopular(subs)
        if (limit >= 0) {
            sorted = sorted.slice(0, limit)
        }
        var justified = []
        sorted.forEach((name, index) => {
            justified.push({
                'name': name, 
                'reason': reason.replace("{sub}", "r/" + name),
            })
        })
        return justified
    }

    // Returns the name of a subreddit and who is subscribed to it
    addUnionSubsWithReason(mySubs, theirSubs, unionSubs, reason) {
        var unionSorted = this.sortPopular(unionSubs)
        var justified = []
        unionSorted.forEach((name, index) => {
            justified.push({
                'name': name,
                'reason': reason.replace("{sub}", "r/" + name).replace("{who}", name in theirSubs ? "them" : "you"),
            })
        })
        return justified
    }

    // Removes duplicate subreddits from our list [[name, justification]...]
    removeDuplicates(justified, limit = -1) {
        var unique = []
        var seen = new Set()
        for (var i = 0; i < justified.length; i++) {
            var name = justified[i].name
            if (!seen.has(name)) {
                unique.push(justified[i])
                seen.add(name)
            }
        }
        if (limit >= 0) {
            unique = unique.slice(0, limit)
        }
        return unique
    }

    // Combines a list of dictionaries into one (duplicates overwrite)
    reduceDicts(dict) {
        return dict.reduce((acc, elem) => {
            for (let name in elem) {
                acc[name] = elem[name];
            };
            return acc;
        }, {})
    }

    // Get the top k posts from each subreddit
    fetchSubredditsTopPosts(subOrdering) {
        let promises = []
        subOrdering.forEach((item) => {
            var name = item.name
            let promise = this.getAccessToken().then((token) => {
                return this.fetchTopPostsAtRank(name, 0, 5, token).then((topPosts) => {
                    return {[name]: topPosts}
                })
            })
            promises.push(promise)
        })
        return Promise.all(promises)
    }

    // Generates a list of subreddits we should consider for icebreakers, in
    // prioritized order, with justification
    calcIcebreakerSubOrdering() {
        var dbManager = this.props.dbManager;
        var myUID = this.props.my_uid;
        var theirUID = this.props.their_uid;

        var mySubs, myFavs, theirSubs, theirFavs, intersectSubs, intersectFavs, unionSubs

        // Get the current user's subreddits
        return dbManager.getUserVisibleSubreddits(myUID).then((mine) => {
            mySubs = this.reduceDicts(mine)
            // Get the currently viewed profile's subreddits
            return dbManager.getUserVisibleSubreddits(theirUID).then((theirs) => {
                // Combine the returned list of dictionaries into one
                theirSubs = this.reduceDicts(theirs)

                // Filter out each user's favorites. Perform intersect & union
                myFavs = this.filterFavorites(mySubs)
                theirFavs = this.filterFavorites(theirSubs)
                intersectSubs = this.filterIntersect(mySubs, theirSubs)
                intersectFavs = this.filterIntersect(myFavs, theirFavs)
                unionSubs = this.filterUnion(mySubs, theirSubs)
                // List the subreddits in prioritized order, with justification
                var subOrdering = []
                subOrdering.push(...this.addSubsWithReason(intersectFavs, "{sub} is both of your favorites!"))
                subOrdering.push(...this.addSubsWithReason(theirFavs, "{sub} is their favorite and you're both subscribed to it!"))
                subOrdering.push(...this.addSubsWithReason(myFavs, "{sub} is your favorite and you're both subscribed to it!"))
                subOrdering.push(...this.addSubsWithReason(intersectSubs, "{sub} is subscribed to by both of you!"))
                subOrdering.push(...this.addSubsWithReason(theirFavs, "{sub} is their favorite subreddit!"))
                subOrdering.push(...this.addSubsWithReason(theirSubs, "{sub} is their most popular subreddit!", 1))
                subOrdering.push(...this.addSubsWithReason(myFavs, "{sub} is your favorite subreddit!"))
                subOrdering.push(...this.addSubsWithReason(mySubs, "{sub} is your most popular subreddit!", 1))
                subOrdering.push(...this.addUnionSubsWithReason(mySubs, theirSubs, unionSubs, "{sub} is subscribed to by {who}!"))

                // Get list of just the unique subreddits (keeps decending order of relevance
                // and their reason)
                subOrdering = this.removeDuplicates(subOrdering, 10)
                return subOrdering
            })
        })
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

    getAccessToken() {
        var data = (new URLSearchParams({'grant_type': 'client_credentials'})).toString();

        return fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(REDDIT.APP_ID + ":" + REDDIT.APP_SECRET),
                'User-Agent': REDDIT.APP_NAME + ' by u/' + REDDIT.APP_DEV
            },
                body: data
            })
            .then(this.status).then(this.json)
            .then((responseJSON) => {
                return responseJSON.access_token
            })
            .catch(function (err) {
                console.log('Error: ' + err);
            });
    }

    fetchTopPostsAtRank(name, rank = 0, limit = 1, token) {
        return fetch('https://oauth.reddit.com/r/' + name + '/hot?limit=' + limit + '&g=US&count=' + rank, {
                method: 'GET',
                headers: {
                    'Authorization': 'bearer ' + token,
                    'User-Agent': REDDIT.APP_NAME + ' by u/' + REDDIT.APP_DEV
                }
            })
            .then(this.status).then(this.json)
            .then((respJSON) => {
                var posts = respJSON["data"]["children"]
                return this.parsePosts(posts)
            })
            .catch(function (err) {
                console.log('Error: Failed to get posts:', err)
            });
    }

    parsePosts(posts) {
        var post_infos = []
        for (let post of posts) {
            var data = post["data"]
            var info = {
                author: data.author,
                awards: data.total_awards_received,
                comments: data.num_comments,
                id: data.name,
                link: 'https://www.reddit.com' + data.permalink,
                sticky: data.stickied,
                subreddit: data.subreddit,
                text: data
                    .selftext
                    .replace(/\s\s+/g, ' '), // Remove extra whitespace
                title: data
                    .title
                    .replace(/\s\s+/g, ' '),
                upvotes: data.ups,
                url: data
                    .url
                    .split('?')[0]
            }
            if (info.text !== '') {
                info.type = 'text'
            } else {
                let url = info.url
                if (['.png', '.jpg', '.jpeg', '.gif', '.gifv'].some(v => url.endsWith(v))) 
                    info.type = 'img'
                else if (info.url !== info.link) {
                    if (info.url.indexOf('/gallery/') !== -1) 
                        info.type = 'gallery'
                    else if (info.url.indexOf('v.redd.it') !== -1) 
                        info.type = 'video'
                    else 
                        info.type = 'url'
                } else 
                    info.type = 'blank'
            }
            if (!info.sticky) {
                post_infos.push(info)
            }
        }
        return post_infos
    }
}
export default Icebreaker;