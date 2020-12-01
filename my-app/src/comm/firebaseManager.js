import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';
import { auth } from '../comm/firebaseCredentials'

class FirebaseManager{
    
    constructor(firestore){
        this.db = firestore
        this.usersRef = firestore.collection('users');
        this.subredditRef = firestore.collection('subreddit')

        this.getAllOtherUsers = this.getAllOtherUsers.bind(this)
    }

    // Check if the user exist, and returns its information if there is any
    referenceUser(uid){
        // console.log("referencing user")
        let user = this.usersRef.doc(uid).get()
        .then((docContent)=>{
            let result 
            // If the user exist
            if(docContent.data()){
                let data = docContent.data();
                if(data.username){
                    // If there is data about this user, resturn it
                    result = data;
                }else{
                    // If there is no data, just return true (the user exist)
                    result = true;
                }
            }else{
                // if the user does not exist, return false 
                result =  false
                // console.log("user doesn't exist")
            }
            return result
        })
        return user
    }

    // Creates a new user in the database from an id
    addUser(user){
        return this.usersRef.doc(user.uid).set({email: user.email}).then(()=>{return true})
    }

    // Get the information of an existent user based on it's id
    getUserInfo(uid){
        let userInfo = this.usersRef.doc(uid).get()
            .then((docContent)=>{ 
                return docContent.data()
            })
        return userInfo
    }

    // Get the information of an existent user including communities
    getUserExtendedInfo(uid){
        let userInfo = this.usersRef.doc(uid).get()
            .then((docContent)=>{ 
                var userExtendedInfo = docContent.data()
                let [year, month, day] = userExtendedInfo.birthdate.split('-')
                userExtendedInfo.age = (new Date()).getFullYear() - (new Date(year, month, day).getFullYear())
                userExtendedInfo.location = userExtendedInfo.city + ', ' + userExtendedInfo.country
                return this.getUserSubreddits(uid).then((subs) =>{
                    return {...userExtendedInfo,
                    subreddits: subs}
                }) 
            })
        return userInfo
    }

    listenToUserExtendedInfo(uid, updateComponent){

        return this.usersRef.doc(uid)
            .onSnapshot((docContent)=>{ 
                var userExtendedInfo = docContent.data()
                let [year, month, day] = userExtendedInfo.birthdate.split('-')
                userExtendedInfo.age = (new Date()).getFullYear() - (new Date(year, month, day).getFullYear())
                userExtendedInfo.location = userExtendedInfo.city + ', ' + userExtendedInfo.country
                return this.getUserSubreddits(uid).then((subs) =>{
                    updateComponent({...userExtendedInfo, subreddits: subs}) 
                }) 
            })
    }

    // Register the information for an existent user
    registerUserInfo(uid, info){
        return this.usersRef.doc(uid).update(info).then(()=>{return true})
    }

    registerSubredditInfo(display_name, info) {
        return this.subredditRef.doc(display_name).set(info, {merge: true}).then(()=>{return true})
    }

    registerUserSubreddit(display_name, info, user) {
        var uid = user.uid
        var docRef;
        // Create user document if it doesn't exist
        return this.usersRef.doc(uid).set({email: user.email}, {merge: true}).then(()=>{
            docRef = this.usersRef.doc(uid).collection('subreddit').doc(display_name)
            // Don't overwrite is_visible nor is_favorite
            return docRef.get().then((docContent) => {
                if (docContent.data()) {
                    var data = docContent.data()
                    var curr_is_visible = data.is_visible
                    var curr_is_favorite = data.is_favorite
                    info.is_favorite = curr_is_favorite ? true : false;
                    info.is_visible = curr_is_visible ? true : false;
                }
                // Store info about this user on the subreddit
                return docRef.set(info, {merge: true}).then(()=>{return true})
            });
        })
    }

    // Updates the visivility of the communities and the favorite community for the user
    updateUserCommunities(uid, communities, fav){
        const ref = this.usersRef.doc(uid).collection("subreddit")
        for(let c in communities){
                ref.doc(c).update({is_visible: communities[c].is_visible})
            if(c ===fav){
                ref.doc(c).update({is_favorite: true})
            }else{
                ref.doc(c).update({is_favorite: false})
            }
        }
    }

    
    listenToRedditSynch(uid, loadSubs) {
        return this.usersRef.doc(uid).collection("subreddit")
        .onSnapshot(function(querySnapshot) {
            var subs = {}

            querySnapshot.forEach(function(doc) {
                var subData = doc.data()
                var subName = doc.id


                subs[subName] = {
                    is_favorite: subData.is_favorite,
                    is_visible: subData.is_visible,
                }
            })
            loadSubs(subs)
            return subs
        });
    
    }


    getUserVisibleSubreddits(uid) {
        return this.usersRef.doc(uid).collection("subreddit").where("is_visible", "==", true).get().then((querySnap) => {
            var promises = []
            querySnap.forEach((userDoc) => {
                // console.log(userDoc)
                var userData = userDoc.data()
                // console.log(userData)
                var name = userDoc.id
                var promise = this.subredditRef.doc(name).get().then((subDoc) => {
                    var subData = subDoc.data()
                    var info = {
                        is_favorite: userData.is_favorite,
                        is_reddit_favorite: userData.is_reddit_favorite,
                        is_visible: userData.is_visible,
                        subreddit: subData,
                    }
                    // console.log(info)
                    return {[name]: info}
                })
                promises.push(promise)
            })
            return Promise.all(promises)
        })
    }

    getAllMessages(){
        var uid = auth.currentUser.uid;
        var messagesRef = this.usersRef.doc(uid).collection('messages');

        function RetrieveMessages(){
            const query = messagesRef.orderBy('accepted');
            const requests = [];
            const chats = [];
            const result = useCollectionData(query)[0]; 
            if(result){
                for(var i=0; i<result.length; i++){
                    var accepted = result[i].accepted; //TODO how to get these in db?
                    var senderUID = result[i].senderUID; //TODO how to get these in db?
                    if(accepted){
                        chats.push(senderUID);
                    }
                    else{
                        requests.push(senderUID);
                    }
                }
            }
            return [requests, chats];
        }
        var [requests, chats] = RetrieveMessages();
        
        return [requests, chats];
    }

    getMessagesBetween2Users(uid1, uid2){

        if(!uid2 || uid2.length === 0){
            uid2 = "NaN";
        }
        var messagesRef = this.usersRef.doc(uid1).collection('messages').doc(uid2);
        var collectionsRef = messagesRef ? messagesRef.collection('chat') : null;

        function RetrieveMessages(){
            const query = collectionsRef.orderBy('createdAt');
            const [messages] = useCollectionData(query, { idField: 'id' }); 
            return messages;
        }
        var messages = RetrieveMessages();

        return [collectionsRef, messages];
    }

    getUsernameFromUID(uid){
        let username = this.usersRef.doc("NBWmUOSzU5WToFPNCB41DUwX2Hy2").get().then((docContent)=>{
            let result;
            if(docContent.data()){
                let data = docContent.data();
                if(data.username){
                    result = data.username;
                }else{
                    result = true;
                }
            }else{
                result =  false;
            }
            return result;
        })
        return username;
    }

    getTimestamp(){
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    getAllOtherUsers(my_uid) {
        return this.usersRef.get().then((querySnap) => {
            var promises = []
            querySnap.forEach((userDoc) => {
                var userData = userDoc.data()
                var uid = userDoc.id
                // Don't include incomplete profiles
                if (!userData.username) {
                    return
                }
                userData.uid = uid
                let [year, month, day] = userData.birthdate.split('-')
                userData.age = (new Date()).getFullYear() - (new Date(year, month, day).getFullYear())
                userData.location = userData.city + ', ' + userData.country

                if (userData.uid !== my_uid) {
                    var promise = this.getUserSubreddits(uid).then((subreddits) => {
                        userData.subreddits = subreddits
                        return userData
                    })
                    promises.push(promise)
                }
            })
            return Promise.all(promises)
        })
    }

    getUserSubreddits(uid) {
        return this.usersRef.doc(uid).collection("subreddit").get().then((querySnap) => {
            var promises = []
            querySnap.forEach((userDoc) => {
                // console.log(userDoc)
                var userData = userDoc.data()
                // console.log(userData)
                var name = userDoc.id
                var promise = this.subredditRef.doc(name).get().then((subDoc) => {
                    var subData = subDoc.data()
                    var info = {
                        is_favorite: userData.is_favorite,
                        is_reddit_favorite: userData.is_reddit_favorite,
                        is_visible: userData.is_visible,
                        subreddit: subData,
                    }
                    return {[name]: info}
                })
                promises.push(promise)
            })
            return Promise.all(promises)
        })
    }

    deleteUser(uid){
        console.log("Noooo, don't goooo")
        return this.usersRef.doc(uid).delete()
    }

}
export default FirebaseManager;