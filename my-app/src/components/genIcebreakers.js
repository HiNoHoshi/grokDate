import React, {Component} from 'react'
import {REDDIT} from '../comm/common.js'

class GenIcebreakers extends Component {
  constructor(props) {
    super(props);
    this.genIcebreakers = this.genIcebreakers.bind(this)
  }

  // Return only the subreddits that are favorited on our app
  filterGrokFavorites(subs) {
    var filtered = {}
    for (const [name, info] of Object.entries(subs)) {
      if (info.is_favorite) {
        filtered[name] = info
      }
    }
    return filtered
  }

  // Return only the subreddits that are favorited on Reddit
  filterRedditFavorites(subs) {
    var filtered = {}
    for (const [name, info] of Object.entries(subs)) {
      if (info.is_reddit_favorite) {
        filtered[name] = info
      }
    }
    return filtered
  }

  // Returns the names of the subreddits in decending order of popularity
  sortPopular(subs) {
    var sorted = []
    var subPopularity = [];
    for (let name in subs) subPopularity.push([name, subs[name].subreddit.subscribers]);
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
  addSubsWithReason(subs, reason, limit=-1) {
    var sorted = this.sortPopular(subs)
    if (limit >= 0) {
      sorted = sorted.slice(0, limit)
    }
    var justified = []
    sorted.forEach((item, index) => {
      justified.push([item, reason.replace("{sub}", "r/" + item)])
    })
    return justified
  }

  // Returns the name of a subreddit and who is subscribed to it
  addUnionSubsWithReason(mySubs, theirSubs, unionSubs, reason) {
    var unionSorted = this.sortPopular(unionSubs)
    var justified = []
    unionSorted.forEach((item, index) => {
      justified.push([item, reason.replace("{sub}", "r/" + item).replace("{who}", item in theirSubs ? "them" : "you")])
    })
    return justified
  }

  // Removes duplicate subreddits from our list [[name, justification]...]
  removeDuplicates(justified, limit=-1) {
    var unique = []
    var seen = new Set()
    for (var i = 0; i < justified.length; i++) {
      var name = justified[i][0]
      var reason = justified[i][1]
      if (!seen.has(name)) {
        unique.push([name, reason])
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

  // Generates a list of subreddits we should consider for icebreakers, in prioritized order, with justification
  genIcebreakers() {
    var dbManager = this.props.dbManager;
    var myUID = this.props.my_uid;
    var theirUID = this.props.their_uid;

    var mySubs, myGrokFavs
    var theirSubs, theirGrokFavs
    var intersectSubs, intersectGrokFavs
    var unionSubs

    // Get the current user's subreddits
    dbManager.getUserVisibleSubreddits(myUID).then((mine) => {
      mySubs = this.reduceDicts(mine)
      // Get the currently viewed profile's subreddits
      dbManager.getUserVisibleSubreddits(theirUID).then((theirs) => {
        // Combine the returned list of dictionaries into one
        theirSubs = this.reduceDicts(theirs)

        // Filter out each user's favorites. Perform intersect & union
        myGrokFavs = this.filterGrokFavorites(mySubs)
        theirGrokFavs = this.filterGrokFavorites(theirSubs)
        intersectSubs = this.filterIntersect(mySubs, theirSubs)
        intersectGrokFavs = this.filterIntersect(myGrokFavs, theirGrokFavs)
        unionSubs = this.filterUnion(mySubs, theirSubs)
        // unionGrokFavs = this.filterUnion(myGrokFavs, theirGrokFavs)

        // List the subreddits in prioritized order, with justification
        var subOrdering = []
        subOrdering.push(...this.addSubsWithReason(intersectGrokFavs, "{sub} is both of your favorites!"))
        subOrdering.push(...this.addSubsWithReason(theirGrokFavs,     "{sub} is their favorite and you're both subscribed to it!"))
        subOrdering.push(...this.addSubsWithReason(myGrokFavs,        "{sub} is your favorite and you're both subscribed to it!"))
        subOrdering.push(...this.addSubsWithReason(intersectSubs,     "{sub} is subscribed to by both of you!"))
        subOrdering.push(...this.addSubsWithReason(theirGrokFavs,     "{sub} is their favorite subreddit!"))
        subOrdering.push(...this.addSubsWithReason(theirSubs,         "{sub} is their most popular subreddit!", 1))
        subOrdering.push(...this.addSubsWithReason(myGrokFavs,        "{sub} is your favorite subreddit!"))
        subOrdering.push(...this.addSubsWithReason(mySubs,            "{sub} is your most popular subreddit!", 1))
        subOrdering.push(...this.addUnionSubsWithReason(mySubs, theirSubs, unionSubs, "{sub} is subscribed to by {who}!"))

        // Get list of just the unique subreddits (keeps decending order of relevance and their reason)
        subOrdering = this.removeDuplicates(subOrdering, 50)
        console.log("Ideal icebreaker subreddits", subOrdering)

        // Get the top 5 posts from each subreddit (for example)
        // TODO: move this to where icebreakers are browsed through?
        subOrdering.forEach((item) => {
          var name = item[0]
          this.getAccessToken().then((token) => {
            this.fetchTopPostsAtRank(name, 0, 5, token).then((topPosts) => {
              console.log({[name]: topPosts})
            })
          })
        })
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
    var data = (new URLSearchParams({
      'grant_type': 'client_credentials',
    })).toString();

    return fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(REDDIT.APP_ID + ":" + REDDIT.APP_SECRET),
        'User-Agent': REDDIT.APP_NAME + ' by u/' + REDDIT.APP_DEV,
      },
      body: data,
    }).then(this.status).then(this.json)
    .then((responseJSON) => {
      return responseJSON.access_token
    }).catch(function (err) {
      console.log('Error: ' + err);
    });
  }

  fetchTopPostsAtRank(name, rank=0, limit=1, token) {
    return fetch('https://oauth.reddit.com/r/' + name + '/hot?limit=' + limit + '&g=US&count=' + rank, {
      method: 'GET',
      headers: {
        'Authorization': 'bearer ' + token,
        'User-Agent': REDDIT.APP_NAME + ' by u/' + REDDIT.APP_DEV,
      }
    }).then(this.status).then(this.json)
    .then((respJSON) => {
      var posts = respJSON["data"]["children"]
      return this.parsePosts(posts)
    }).catch(function (err) {
      console.log('Error: Failed to get posts:', err)
    });
  }

  parsePosts(posts) {
    var post_infos = {}
    for (let post of posts) {
      var data = post["data"]
      var id = data.name
      var info = {
        author: data.author,
        awards: data.total_awards_received,
        comments: data.num_comments,
        link: 'http://www.reddit.com' + data.permalink,
        sticky: data.stickied,
        subreddit: data.subreddit,
        text: data.selftext.replace(/\s\s+/g, ' '),   // Remove extra whitespace
        title: data.title.replace(/\s\s+/g, ' '),
        upvotes: data.ups,
        url: data.url.split('?')[0],
      }
      if (info.text !== '') {
        info.type = 'text'
      } else {
        if ('.png' in info || '.jpg' in info || '.jpeg' in info || '.gif' in info) info.type = 'img'
        else if (info.url !== info.link) info.type = 'url'
        else info.type = 'idk'
      }
      if (!info.sticky) {
        post_infos[id] = info
      }
    }
    return post_infos
  }

  render() {
    return (
      <button onClick={this.genIcebreakers}>Test Icebreakers</button>
    )
  }
}

export default GenIcebreakers