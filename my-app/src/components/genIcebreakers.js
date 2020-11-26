import React, {Component} from 'react'
// import {REDDIT} from '../comm/common.js'

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
    for (var name in subs) subPopularity.push([name, subs[name].subreddit.subscribers]);
    subPopularity.sort((a, b) => {
        a = a[1];
        b = b[1];
        return a > b ? -1 : (a < b ? 1 : 0);
    });

    for (var i = 0; i < subPopularity.length; i++) {
        var name = subPopularity[i][0];
        var popularity = subPopularity[i][1];
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
      var info = subsA[name]
      union[name] = info
    }
    for (let name in subsB) {
      var info = subsB[name]
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
  removeDuplicates(justified) {
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
    var unionSubs, unionGrokFavs

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
        unionGrokFavs = this.filterUnion(myGrokFavs, theirGrokFavs)

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

        // Get list of just the unique subreddits (keeps decending order of relevance)
        subOrdering = this.removeDuplicates(subOrdering)
        console.log(subOrdering)
        // TODO darci: store or use the prioritized subreddits :)
      })
    })
  }

  render() {
    return (
      <button onClick={this.genIcebreakers}>Generate Icebreakers</button>
    )
  }
}

export default GenIcebreakers