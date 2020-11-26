import React, {Component} from 'react'
// import {REDDIT} from '../comm/common.js'

class GenIcebreakers extends Component {
  constructor(props) {
    super(props);
    this.genIcebreakers = this.genIcebreakers.bind(this)
  }

  filterGrokFavorites(subs) {
    var filtered = {}
    for (const [name, info] of Object.entries(subs)) {
      if (info.is_favorite) {
        filtered[name] = info
      }
    }
    return filtered
  }

  filterRedditFavorites(subs) {
    var filtered = {}
    for (const [name, info] of Object.entries(subs)) {
      if (info.is_reddit_favorite) {
        filtered[name] = info
      }
    }
    return filtered
  }

  sortPopular(subs) {
    var sorted = []
    var subPopularity = [];
    for (var name in subs) subPopularity.push([name, subs[name].subreddit.subscribers]);
    subPopularity.sort((a, b) => {
        a = a[1];
        b = b[1];
        return a < b ? -1 : (a > b ? 1 : 0);
    });

    for (var i = 0; i < subPopularity.length; i++) {
        var name = subPopularity[i][0];
        var popularity = subPopularity[i][1];
        sorted.push(name)
    }
    return sorted
  }

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

  addSubsWithReason(subs, reason, limit=-1) {
    var sorted = this.sortPopular(subs)
    if (limit >= 0) {
      sorted = sorted.slice(0, limit)
    }
    var justified = []
    sorted.forEach((item, index) => {
      justified.push([item, reason])
    })
    return justified
  }

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

  genIcebreakers() {
    var dbManager = this.props.dbManager;
    var myUID = this.props.my_uid;
    var theirUID = this.props.their_uid;

    var mySubs, myGrokFavs
    var theirSubs, theirGrokFavs
    var intersectSubs, intersectGrokFavs
    var unionSubs, unionGrokFavs

    // TODO figure out the dumb promises
    dbManager.getUserVisibleSubreddits(myUID).then((mine) => {
      mySubs = mine
      console.log(mySubs)
    })
    dbManager.getUserVisibleSubreddits(theirUID).then((theirs) => {
      theirSubs = theirs
      console.log(theirSubs)
    })

    mySubs = {
      PS5: {
        is_favorite: true, 
        is_reddit_favorite: false,
        is_visible: true,
        subreddit: {
          'subscribers': 10,
        }
      },
      UIUC: {
        is_favorite: false, 
        is_reddit_favorite: false,
        is_visible: true,
        subreddit: {
          'subscribers': 20,
        }
      }
    }

    theirSubs = {
      UIUC: {
        is_favorite: true, 
        is_reddit_favorite: false,
        is_visible: true,
        subreddit: {
          'subscribers': 10,
        }
      },
      awww: {
        is_favorite: false, 
        is_reddit_favorite: false,
        is_visible: true,
        subreddit: {
          'subscribers': 50,
        }
      }
    }

    myGrokFavs = this.filterGrokFavorites(mySubs)
    theirGrokFavs = this.filterGrokFavorites(theirSubs)
    intersectSubs = this.filterIntersect(mySubs, theirSubs)
    intersectGrokFavs = this.filterIntersect(myGrokFavs, theirGrokFavs)
    unionSubs = this.filterUnion(mySubs, theirSubs)
    unionGrokFavs = this.filterUnion(myGrokFavs, theirGrokFavs)

    var subOrdering = []
    subOrdering.push(...this.addSubsWithReason(intersectGrokFavs, "{sub} is both of your favorites!"))
    subOrdering.push(...this.addSubsWithReason(theirGrokFavs,     "{sub} is their favorite and you're both subscribed to it!"))
    subOrdering.push(...this.addSubsWithReason(myGrokFavs,        "{sub} is your favorite and you're both subscribed to it!"))
    subOrdering.push(...this.addSubsWithReason(intersectSubs,     "{sub} is subscribed to by both of you!"))
    subOrdering.push(...this.addSubsWithReason(theirGrokFavs,     "{sub} is their favorite subreddit!"))
    subOrdering.push(...this.addSubsWithReason(theirSubs,         "{sub} is their most popular subreddit!", 1))
    subOrdering.push(...this.addSubsWithReason(myGrokFavs,        "{sub} is your favorite subreddit!"))
    subOrdering.push(...this.addSubsWithReason(mySubs,            "{sub} is your most popular subreddit!", 1))
    subOrdering.push(...this.addSubsWithReason(theirSubs,         "{sub} is subscribed to by them!"))
    subOrdering.push(...this.addSubsWithReason(mySubs,            "{sub} is subscribed to by you!"))

    // console.log("duplicates subOrdering", subOrdering)
    subOrdering = this.removeDuplicates(subOrdering)
    // console.log("subOrdering", subOrdering)
  }

  render() {
    return (
      <button onClick={this.genIcebreakers}>Generate Icebreakers</button>
    )
  }
}

export default GenIcebreakers